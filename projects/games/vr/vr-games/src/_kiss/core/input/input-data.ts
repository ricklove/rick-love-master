import { handJointNames } from './hand-joints';

/** Position, Quanternion for each */
enum InputBufferIndex {
  handLeft = 0,
  handRight = handLeft + handJointNames.length * 3,
  camera = handRight + handJointNames.length * 3,
  controllerLeft = camera + 7,
  controllerRight = controllerLeft + 7,
  controllerGripLeft = controllerRight + 7,
  controllerGripRight = controllerGripLeft + 7,
  COUNT = controllerGripRight + 7,
}

export const createInputBuffer = () => {
  return new Float32Array(InputBufferIndex.COUNT);
};
