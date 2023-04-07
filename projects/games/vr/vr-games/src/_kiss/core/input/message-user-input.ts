import { Quaternion, Vector3 } from 'three';
import { MessageBufferPool } from '../messages/message-buffer';
import { MessageBufferKind } from '../messages/message-type';
import { GamePlayerInputs } from './game-player-inputs';
import { handJointNameIndex, handJointNames } from './hand-joints';
import { MouseState } from './mouse';

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
  /**
   * 10 floats: position(3), direction(3), time, buttons, wheelDeltaX, wheelDeltaY
   */
  mouse = controllerGripRight + 7,
  COUNT = mouse + 10,
}

const getBufferSize = () => {
  return InputBufferIndex.COUNT * 4;
};

const injectXrInput = (renderer: THREE.WebGLRenderer, frame: XRFrame, buffer: Float32Array) => {
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
};

const vMouseScreenPosition = new Vector3();
const vMouseDirection = new Vector3();
const q = new Quaternion();
const injectMouseInput = (
  renderer: THREE.WebGLRenderer,
  mouseState: MouseState,
  nonXrCamera: THREE.Camera,
  buffer: Float32Array,
) => {
  const mainCamera = nonXrCamera;

  vMouseScreenPosition.set(mouseState.u, mouseState.v, 0);
  vMouseScreenPosition.unproject(mainCamera);

  vMouseDirection.set(mouseState.u, mouseState.v, 1);
  vMouseDirection.unproject(mainCamera);
  vMouseDirection.sub(mainCamera.position).normalize();

  vMouseScreenPosition.toArray(buffer, InputBufferIndex.mouse);
  vMouseDirection.toArray(buffer, InputBufferIndex.mouse + 3);

  buffer[InputBufferIndex.mouse + 6] = mouseState.time;
  buffer[InputBufferIndex.mouse + 7] = mouseState.buttons;
  buffer[InputBufferIndex.mouse + 8] = mouseState.wheelDeltaX;
  buffer[InputBufferIndex.mouse + 9] = mouseState.wheelDeltaY;

  // console.log(`injectMouseInput`, { vMouseScreenPosition, vMouseDirection, time: mouseState.time });
};

export const postMessageUserInputTransforms = (
  renderer: THREE.WebGLRenderer,
  frame: XRFrame,
  bufferPool: MessageBufferPool,
  mouseState: MouseState,
  nonXrCamera: THREE.Camera,
) => {
  const size = getBufferSize();
  const buffer = bufferPool.claimBuffer(size);
  const fBuffer = new Float32Array(buffer);
  const iBuffer = new Int32Array(buffer);

  // wogger.log(`postMessageArrayBufferFromWorker`, { boxes, spheres, buffer, fBuffer, iBuffer });

  iBuffer[0] = bufferKind;
  injectXrInput(renderer, frame, fBuffer);
  injectMouseInput(renderer, mouseState, nonXrCamera, fBuffer);
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

  [inputs.mouse].forEach((o) => {
    offset = InputBufferIndex.mouse;
    o.position.set(f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++]);
    o.direction.set(f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++]);
    o.time = f32Buffer[offset++];
    o.buttons = i32Buffer[offset++];
    o.wheelDeltaX = f32Buffer[offset++];
    o.wheelDeltaY = f32Buffer[offset++];
  });

  // console.log(`readMessageUserInputTransforms position set`, { handJoints });
};
