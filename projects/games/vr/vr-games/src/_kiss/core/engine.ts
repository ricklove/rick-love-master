import * as THREE from 'three';
import { Object3D } from 'three';
import { TextGeometry } from 'three-stdlib';
import { logger } from '../../utils/logger';
import { createMessageBufferPool } from './messages/message-buffer';
import { MessageBufferKind, WorkerMessageFromWorker, WorkerMessageToWorker } from './messages/message-type';
import { readMessageSceneObjectTransforms } from './messages/messages/message-scene-object-transforms';
import { postMessageUserInputTransforms } from './messages/messages/message-user-input';
import { setupThree } from './three-setup';
import { addTestScene, updateTestScene } from './three-test-scene';

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
    const { scene, camera, renderer, dispose, state } = setupThree(host);
    const testScene = addTestScene(scene, renderer);
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeometry = new THREE.SphereGeometry(1);

    const objectMap = [] as (undefined | Object3D)[];
    let addObjectsData = undefined as undefined | Extract<WorkerMessageFromWorker, { kind: `addObjects` }>;
    let removeObjectsData = undefined as undefined | Extract<WorkerMessageFromWorker, { kind: `removeObjects` }>;
    let updateObjectsData = undefined as undefined | Extract<WorkerMessageFromWorker, { kind: `updateObjects` }>;
    let updateObjectsArrayBuffer = undefined as undefined | ArrayBuffer;

    const updateSceneFromData = () => {
      if (addObjectsData) {
        const data = addObjectsData;
        addObjectsData = undefined;

        data.boxes?.forEach((o) => {
          const object = new THREE.Mesh(boxGeometry, new THREE.MeshLambertMaterial({ color: o.color }));
          // const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xff0000 }));
          object.matrixAutoUpdate = false;
          object.position.set(o.position[0], o.position[1], o.position[2]);
          object.quaternion.set(o.quaternion[0], o.quaternion[1], o.quaternion[2], o.quaternion[3]);
          object.scale.set(o.scale[0], o.scale[1], o.scale[2]);
          object.updateMatrix();

          scene.add(object);

          objectMap[o.id] = object;
        });
        data.spheres?.forEach((o) => {
          const object = new THREE.Mesh(sphereGeometry, new THREE.MeshLambertMaterial({ color: o.color }));
          // const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xff0000 }));
          object.matrixAutoUpdate = false;
          object.position.set(o.position[0], o.position[1], o.position[2]);
          object.scale.set(o.radius, o.radius, o.radius);
          object.updateMatrix();

          scene.add(object);

          objectMap[o.id] = object;
        });
        data.texts?.forEach((o) => {
          const font = state.font;
          if (!font) {
            console.error(`No font loaded`);
            return;
          }

          const fontSize = o.fontSize;
          const thickness = fontSize * 0.1;
          const textGeometry = new TextGeometry(o.text, { font, size: fontSize, height: thickness });
          const objectInner = new THREE.Mesh(textGeometry, new THREE.MeshLambertMaterial({ color: o.color }));
          const object = new THREE.Group();
          object.add(objectInner);

          textGeometry.computeBoundingBox();
          const boundingBox = textGeometry.boundingBox!;
          const textWidth = boundingBox.max.x - boundingBox.min.x;
          const textHeight = fontSize; // boundingBox.max.y - boundingBox.min.y;

          // TODO: put this in a group to perserver the alignment
          // text geometry is baseline left by default
          // fontSize is baseline to top of MW
          // g is below the fontSize
          const xOffset = o.alignment === `center` ? -textWidth / 2 : o.alignment === `right` ? -textWidth : 0;
          const yOffset =
            o.verticalAlignment === `center` ? -textHeight / 2 : o.verticalAlignment === `top` ? -textHeight : 0;

          console.log(`font size`, {
            alignment: o.alignment,
            verticalAlignment: o.verticalAlignment,
            xOffset,
            yOffset,
            fontSize,
            textWidth,
            textHeight,
            boundingBox,
          });
          objectInner.position.set(xOffset, yOffset, 0);
          object.matrixAutoUpdate = false;
          object.position.set(o.position[0], o.position[1], o.position[2]);
          object.updateMatrix();

          scene.add(object);

          objectMap[o.id] = object;
        });

        logger.log(`updateSceneFromData:addObjects Added objects to scene`, { data, objectMap });
      }
      if (removeObjectsData) {
        removeObjectsData.objectIds.forEach((id) => {
          const object = objectMap[id];
          if (!object) {
            return;
          }
          scene.remove(object);
          objectMap[id] = undefined;
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
      if (updateObjectsArrayBuffer) {
        const data = updateObjectsArrayBuffer;
        updateObjectsArrayBuffer = undefined;
        // logger.log(`updateObjectsArrayBuffer`, { data, objectMap });
        readMessageSceneObjectTransforms(data, objectMap);
        bufferPool.returnBuffer(data);
      }
    };

    worker.onmessage = (e) => {
      // logger.log(`From [Worker]`, { e });
      const data = e.data as WorkerMessageFromWorker;
      if (data instanceof ArrayBuffer) {
        // logger.log(`ArrayBuffer from [Worker]`, { e });
        const kind = new Int32Array(data, 0, 1)[0];
        if (kind === MessageBufferKind.returnedBuffer) {
          bufferPool.addReturnedBuffer(data);
          return;
        }
        if (kind === MessageBufferKind.sceneObjectTransforms) {
          if (updateObjectsArrayBuffer) {
            bufferPool.returnBuffer(updateObjectsArrayBuffer);
          }
          updateObjectsArrayBuffer = data;
          return;
        }
        logger.error(`Unhandled ArrayBuffer from [Worker]`, { e });
        bufferPool.returnBuffer(data);
        return;
      }
      if (data.kind === `pong`) {
        logger.log(`pong from [Worker]`, {
          pingTime: data.pingTime,
          time: data.time,
          delta: data.time - data.pingTime,
        });
        return;
      }
      if (data.kind === `addObjects`) {
        // logger.log(`addObjects from [Worker]`, { e });
        addObjectsData = data;
        return;
      }
      if (data.kind === `removeObjects`) {
        // logger.log(`addObjects from [Worker]`, { e });
        removeObjectsData = data;
        return;
      }
      if (data.kind === `updateObjects`) {
        // logger.log(`updateObjects from [Worker]`, { e });
        updateObjectsData = data;
        return;
      }

      logger.error(`Unhandled message from [Worker]`, { e });
    };

    worker.postMessage({ kind: `ping`, time: performance.now() });
    worker.postMessage({ kind: `ping`, time: performance.now() });
    worker.postMessage({ kind: `setup` });

    const bufferPool = createMessageBufferPool(workerRaw);

    let frameCount = 0;
    let fpsRunningAverage = 60;
    let stop = false;
    let disposed = false;
    let lastFrameTime = performance.now();

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

      const frameTime = time; // performance.now();
      //console.log(`frameTime`, { time, frameTime, lastFrameTime });
      const deltaTime = frameTime - lastFrameTime;
      lastFrameTime = frameTime;

      const fps = 1000 / (deltaTime || 1);
      fpsRunningAverage = 0.9 * fpsRunningAverage + 0.1 * fps;

      worker.postMessage({ kind: `frameSync`, time: frameTime });

      if (frameCount % (10 * 60) === 0) {
        logger.log(`mainLoop`, { frameCount, deltaTime, fps, fpsRunningAverage });
        worker.postMessage({ kind: `ping`, time: frameTime });
      }

      postMessageUserInputTransforms(renderer, frame, bufferPool);

      updateSceneFromData();
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
