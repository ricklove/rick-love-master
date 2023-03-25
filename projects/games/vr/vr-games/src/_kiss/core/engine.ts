import * as THREE from 'three';
import { Object3D } from 'three';
import { logger } from '../../utils/logger';
import { createInputBuffer, readXrInput } from './input/input-data';
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
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeometry = new THREE.SphereGeometry(1);

    const objectMap = [] as Object3D[];
    let addObjectsData = undefined as undefined | Extract<WorkerMessageFromWorker, { kind: `addObjects` }>;
    let updateObjectsData = undefined as undefined | Extract<WorkerMessageFromWorker, { kind: `updateObjects` }>;

    const updateSceneFromData = () => {
      if (addObjectsData) {
        const data = addObjectsData;
        addObjectsData = undefined;

        data.boxes.forEach((o) => {
          const object = new THREE.Mesh(
            boxGeometry,
            new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }),
          );
          // const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xff0000 }));
          object.matrixAutoUpdate = false;
          object.position.set(o.position[0], o.position[1], o.position[2]);
          object.quaternion.set(o.quaternion[0], o.quaternion[1], o.quaternion[2], o.quaternion[3]);
          object.scale.set(o.scale[0], o.scale[1], o.scale[2]);
          scene.add(object);
          objectMap[o.id] = object;
        });
        data.spheres.forEach((o) => {
          const object = new THREE.Mesh(
            sphereGeometry,
            new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }),
          );
          // const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xff0000 }));
          object.matrixAutoUpdate = false;
          object.position.set(o.position[0], o.position[1], o.position[2]);
          object.scale.set(o.radius, o.radius, o.radius);
          scene.add(object);
          objectMap[o.id] = object;
        });
      }
      if (updateObjectsData) {
        const data = updateObjectsData;
        updateObjectsData = undefined;

        data.boxes.forEach((o) => {
          const object = objectMap[o.id];
          if (!object) {
            return;
          }
          object.position.set(o.position[0], o.position[1], o.position[2]);
          object.quaternion.set(o.quaternion[0], o.quaternion[1], o.quaternion[2], o.quaternion[3]);
          object.updateMatrix();
          // object.scale.set(o.scale[0], o.scale[1], o.scale[2]);
        });
        data.spheres.forEach((o) => {
          const object = objectMap[o.id];
          if (!object) {
            return;
          }
          object.position.set(o.position[0], o.position[1], o.position[2]);
          object.updateMatrix();
        });
      }
    };

    worker.onmessage = (e) => {
      // logger.log(`From [Worker]`, { e });
      if (e.data.kind === `pong`) {
        logger.log(`pong from [Worker]`, {
          pingTime: e.data.pingTime,
          time: e.data.time,
          delta: e.data.time - e.data.pingTime,
        });
      }
      if (e.data.kind === `addObjects`) {
        // logger.log(`addObjects from [Worker]`, { e });
        addObjectsData = e.data;
      }
      if (e.data.kind === `updateObjects`) {
        // logger.log(`updateObjects from [Worker]`, { e });
        updateObjectsData = e.data;
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

      worker.postMessage({ kind: `frameSync`, time: performance.now() });

      if (frameCount % (10 * 60) === 0) {
        logger.log(`mainLoop`, { frameCount, deltaTime, fps, fpsRunningAverage });
        worker.postMessage({ kind: `ping`, time: performance.now() });
      }

      readXrInput(renderer, frame, inputBuffer);
      worker.postMessage(inputBuffer.buffer);

      updateTestScene(deltaTime, testScene);
      renderer.render(scene, camera);
      updateSceneFromData();

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
