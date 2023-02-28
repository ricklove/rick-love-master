/* eslint-disable no-bitwise */
import type {} from 'three';
import { pointingGun, pointingHand, pointingIndexFinger, pointingWand } from './gestures/pointing';

export const handGestures = {
  pointingHand,
  pointingGun,
  pointingIndexFinger,
  pointingWand,
};

export const gestures = {
  ...handGestures,
};
