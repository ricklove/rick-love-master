import * as THREE from 'three';
import { logger } from '../../utils/logger';
import { createInputBuffer, readXrInput } from './input-data';
import { setupThree } from './three-setup';
import { addTestScene, updateTestScene } from './three-test-scene';
import { WorkerMessageFromWorker, WorkerMessageToWorker } from './worker/message-type';

export const createGameEngine = (host: HTMLDivElement, workerRaw: Worker) => {
  // [MainLoop] Read input from web-xr
  // [MainLoop] Send data to [Worker]
  // [MainLoop] Use updated transforms from [Worker] to update Three Objects
  // [MainLoop] Render Three
  // [Worker] Receive inputs from [Main] and store quickly
  // [WorkerLoop] Step rapier physics at constant fps (based on current performance measurements)
  // [WorkerLoop] At sync time (once per MainLoop fps), send changed transforms to [Main] (filter out sub pixel changes, based on camera position)
  // [Main] Receive transforms from [Worker] and store quickly

  const worker = workerRaw as {
    postMessage: (message: WorkerMessageToWorker) => void;
    onmessage: (e: MessageEvent<WorkerMessageFromWorker>) => void;
  };

  const setup = () => {
    const { scene, camera, renderer, dispose } = setupThree(host);
    const testScene = addTestScene(scene, renderer);
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    worker.onmessage = (e) => {
      logger.log(`From [Worker]`, { e });
      if (e.data.kind === `pong`) {
        logger.log(`pong from [Worker]`, {
          pingTime: e.data.pingTime,
          time: e.data.time,
          delta: e.data.time - e.data.pingTime,
        });
      }
      if (e.data.kind === `addObjects`) {
        logger.log(`addObjects from [Worker]`, { e });
        e.data.boxes.forEach((box) => {
          //const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
          const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xff0000 }));
          object.position.set(box.position[0], box.position[1], box.position[2]);
          object.quaternion.set(box.quaternion[0], box.quaternion[1], box.quaternion[2], box.quaternion[3]);
          object.scale.set(box.scale[0], box.scale[1], box.scale[2]);
          testScene.room.add(object);
        });
      }
    };

    worker.postMessage({ kind: `ping`, time: performance.now() });
    worker.postMessage({ kind: `ping`, time: performance.now() });
    worker.postMessage({ kind: `setup` });

    const inputBuffer = createInputBuffer();

    let frameCount = 0;
    let fpsRunningAverage = 60;
    let stop = false;
    let disposed = false;
    const clock = new THREE.Clock();

    const mainLoop: XRFrameRequestCallback = (time, frame) => {
      if (disposed) {
        return;
      }
      if (stop) {
        disposed = true;
        logger.log(`mainLoop STOPPED`, { frameCount, fpsRunningAverage });
        worker.postMessage({ kind: `dispose` });
        dispose();
        return;
      }

      const deltaTime = clock.getDelta() * 1000;
      const fps = 1000 / (deltaTime || 1);
      fpsRunningAverage = 0.9 * fpsRunningAverage + 0.1 * fps;

      if (frameCount % (10 * 60) === 0) {
        logger.log(`mainLoop`, { frameCount, deltaTime, fps, fpsRunningAverage });
        worker.postMessage({ kind: `ping`, time: performance.now() });
      }

      readXrInput(renderer, frame, inputBuffer);
      worker.postMessage(inputBuffer.buffer);

      updateTestScene(deltaTime, testScene);
      renderer.render(scene, camera);
      frameCount++;
    };

    const animate = () => {
      renderer.setAnimationLoop(mainLoop);
    };

    return {
      animate,
      dispose: () => {
        stop = true;
      },
    };
  };

  return { setup };
};
