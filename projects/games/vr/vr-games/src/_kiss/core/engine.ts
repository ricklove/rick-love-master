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
    const { scene, camera, renderer, dispose } = setupThree(host);
    const testScene = addTestScene(scene, renderer);

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

export const handJointNames = [
  `wrist`,
  `thumb-metacarpal`,
  `thumb-phalanx-proximal`,
  `thumb-phalanx-distal`,
  `thumb-tip`,
  `index-finger-metacarpal`,
  `index-finger-phalanx-proximal`,
  `index-finger-phalanx-intermediate`,
  `index-finger-phalanx-distal`,
  `index-finger-tip`,
  `middle-finger-metacarpal`,
  `middle-finger-phalanx-proximal`,
  `middle-finger-phalanx-intermediate`,
  `middle-finger-phalanx-distal`,
  `middle-finger-tip`,
  `ring-finger-metacarpal`,
  `ring-finger-phalanx-proximal`,
  `ring-finger-phalanx-intermediate`,
  `ring-finger-phalanx-distal`,
  `ring-finger-tip`,
  `pinky-finger-metacarpal`,
  `pinky-finger-phalanx-proximal`,
  `pinky-finger-phalanx-intermediate`,
  `pinky-finger-phalanx-distal`,
  `pinky-finger-tip`,
] as const satisfies readonly XRHandJoint[];

const handJointNameIndex = Object.fromEntries(handJointNames.map((name, index) => [name, index] as const));

enum MatrixBufferIndex {
  camera,
  controllerLeft,
  controllerRight,
  controllerGripLeft,
  controllerGripRight,
  handLeft,
  handRight = handLeft + handJointNames.length,
  COUNT = handRight + handJointNames.length + 1,
}

const createInputBuffer = () => {
  return new Float32Array(16 * MatrixBufferIndex.COUNT);
};
const readXrInput = (renderer: THREE.WebGLRenderer, frame: XRFrame, buffer: Float32Array) => {
  const session = frame?.session;
  if (!session) {
    return;
  }

  const referenceSpace = renderer.xr.getReferenceSpace();
  if (!referenceSpace) {
    return;
  }

  const camera = renderer.xr.getCamera();
  camera.matrixWorld.toArray(buffer, MatrixBufferIndex.camera * 16);

  [0, 1].forEach((sideOffset) => {
    const controller = renderer.xr.getController(sideOffset);
    controller.matrixWorld.toArray(buffer, (MatrixBufferIndex.controllerLeft + sideOffset) * 16);

    const controlleGrip = renderer.xr.getControllerGrip(sideOffset);
    controlleGrip.matrixWorld.toArray(buffer, (MatrixBufferIndex.controllerGripLeft + sideOffset) * 16);

    const hand = renderer.xr.getHand(sideOffset);
    if (hand) {
      for (const jointName of handJointNames) {
        const joint = hand.joints[jointName];
        if (!joint) {
          continue;
        }

        joint.matrixWorld.toArray(
          buffer,
          MatrixBufferIndex.handLeft + sideOffset * handJointNames.length + handJointNameIndex[jointName] * 16,
        );
      }
    }
  });

  console.log(`readXrInput`, { buffer });
};
