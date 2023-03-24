import * as THREE from 'three';
import { logger } from '../../utils/logger';
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
    const { scene, camera, renderer, dispose, raycaster } = setupThree(host);
    const { room, controllers } = addTestScene(scene, renderer);

    worker.onmessage = (e) => {
      logger.log(`From [Worker]`, { e });
      if (e.data.kind === `pong`) {
        logger.log(`pong from [Worker]`, {
          pingTime: e.data.pingTime,
          time: e.data.time,
          delta: e.data.time - e.data.pingTime,
        });
      }
    };

    worker.postMessage({ kind: `ping`, time: performance.now() });
    worker.postMessage({ kind: `ping`, time: performance.now() });
    worker.postMessage({ kind: `setup` });

    let frameCount = 0;
    let fpsRunningAverage = 60;
    let stop = false;
    let disposed = false;
    const clock = new THREE.Clock();

    const mainLoop = () => {
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

      readXrInput(renderer, camera);
      // testWorker(worker);

      updateTestScene(deltaTime, { room, controllers, raycaster });
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

const readXrInput = (renderer: THREE.Renderer, camera: THREE.Camera) => {
  // Read input from web-xr
  // WebX;
};
