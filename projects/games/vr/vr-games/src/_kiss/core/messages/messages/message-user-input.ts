import { GamePlayerInputs } from '../../input/game-player-inputs';
import { handJointNameIndex, handJointNames } from '../../input/hand-joints';
import { MessageBufferPool } from '../message-buffer';
import { MessageBufferKind } from '../message-type';

const bufferKind = MessageBufferKind.userInputTransforms;

enum InputBufferIndex {
  bufferKind = 0,
  handLeft = bufferKind + 1,
  handRight = handLeft + handJointNames.length * 3,
  camera = handRight + handJointNames.length * 3,
  controllerLeft = camera + 7,
  controllerRight = controllerLeft + 7,
  controllerGripLeft = controllerRight + 7,
  controllerGripRight = controllerGripLeft + 7,
  COUNT = controllerGripRight + 7,
}

const getBufferSize = () => {
  return InputBufferIndex.COUNT * 4;
};

const setXrInput = (renderer: THREE.WebGLRenderer, frame: XRFrame, buffer: Float32Array) => {
  const session = frame?.session;
  if (!session) {
    return;
  }

  const referenceSpace = renderer.xr.getReferenceSpace();
  if (!referenceSpace) {
    return;
  }

  const camera = renderer.xr.getCamera();
  camera.position.toArray(buffer, InputBufferIndex.camera);
  camera.quaternion.toArray(buffer, InputBufferIndex.camera + 3);

  [0, 1].forEach((iController) => {
    const controller = renderer.xr.getController(iController);
    const inputSource = session.inputSources[iController];
    const sideOffset = inputSource.handedness === `left` ? 0 : 1;
    controller.position.toArray(buffer, InputBufferIndex.controllerLeft + sideOffset * 7);
    controller.quaternion.toArray(buffer, InputBufferIndex.controllerLeft + sideOffset * 7 + 3);

    const controlleGrip = renderer.xr.getControllerGrip(sideOffset);
    controlleGrip.position.toArray(buffer, InputBufferIndex.controllerGripLeft + sideOffset * 7);
    controlleGrip.quaternion.toArray(buffer, InputBufferIndex.controllerGripLeft + sideOffset * 7 + 3);

    const hand = renderer.xr.getHand(sideOffset);
    if (hand) {
      for (const jointName of handJointNames) {
        const joint = hand.joints[jointName];
        if (!joint) {
          continue;
        }

        joint.position.toArray(
          buffer,
          InputBufferIndex.handLeft + (sideOffset * handJointNames.length + handJointNameIndex[jointName]) * 3,
        );
      }
    }
  });

  // console.log(`readXrInput`, { buffer });
};

export const postMessageUserInputTransforms = (
  renderer: THREE.WebGLRenderer,
  frame: XRFrame,
  bufferPool: MessageBufferPool,
) => {
  const size = getBufferSize();
  const buffer = bufferPool.claimBuffer(size);
  const fBuffer = new Float32Array(buffer);
  const iBuffer = new Int32Array(buffer);

  // wogger.log(`postMessageArrayBufferFromWorker`, { boxes, spheres, buffer, fBuffer, iBuffer });

  iBuffer[0] = bufferKind;
  setXrInput(renderer, frame, fBuffer);
  bufferPool.postMessage(buffer);
};

export const readMessageUserInputTransforms = (buffer: ArrayBuffer, inputs: GamePlayerInputs) => {
  const f32Buffer = new Float32Array(buffer);
  const i32Buffer = new Int32Array(buffer);

  let offset = 0;
  const _kind = i32Buffer[offset++];
  if (_kind !== bufferKind) {
    console.error(`readMessageUpdateTransforms: wrong kind`, { _kind, bufferKind });
  }

  [inputs.hands.left, inputs.hands.right].forEach((handJoints) => {
    const handOffset = handJoints === inputs.hands.left ? InputBufferIndex.handLeft : InputBufferIndex.handRight;
    handJoints.forEach((o, i) => {
      offset = handOffset + i * 3;
      o.position.set(f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++]);
    });
  });

  [inputs.head].forEach((o) => {
    offset = InputBufferIndex.camera;
    o.position.set(f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++]);
    o.quaternion.set(f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++]);
  });

  // console.log(`readMessageUserInputTransforms position set`, { handJoints });
};
