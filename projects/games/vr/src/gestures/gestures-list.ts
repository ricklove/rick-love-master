/* eslint-disable no-bitwise */
import type {} from 'three';
import {
  fingerExtendedIndex,
  fingerExtendedMiddle,
  fingerExtendedPinky,
  fingerExtendedRing,
  fingerExtendedThumb,
} from './gestures/finger-states';
import { pointingGun, pointingHand, pointingIndexFinger, pointingWand } from './gestures/pointing';

export const handGestures = {
  fingerExtendedThumb,
  fingerExtendedIndex,
  fingerExtendedMiddle,
  fingerExtendedPinky,
  fingerExtendedRing,
  pointingHand,
  pointingGun,
  pointingIndexFinger,
  pointingWand,
};

export const gestures = {
  ...handGestures,
};
