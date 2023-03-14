import { HumanJointName } from './player-body-joint-data-access';

export type HumanBodyPartName =
  | `head`
  | `neck`
  | `upper-torso`
  | `lower-torso`
  | `upper-leg`
  | `lower-leg`
  | `foot`
  | `upper-arm`
  | `lower-arm`
  | `hand`
  | `finger-thumb-1`
  | `finger-thumb-2`
  | `finger-index-1`
  | `finger-index-2`
  | `finger-index-3`
  | `finger-middle-1`
  | `finger-middle-2`
  | `finger-middle-3`
  | `finger-ring-1`
  | `finger-ring-2`
  | `finger-ring-3`
  | `finger-pinky-1`
  | `finger-pinky-2`
  | `finger-pinky-3`;
export const humanBodyParts = {
  head: {
    joints: [`neck-head-base`, `head-center`, `head-back`, `head-top`, `eye-lens`, `nose-tip`, `chin-tip`, `ear`],
  },
  neck: { joints: [`neck-base`, `neck-head-base`] },
  'upper-torso': { joints: [`neck-base`, `shoulder-socket`, `pelvis-top`] },
  'lower-torso': { joints: [`pelvis-top`, `pelvis-bottom`, `hip-socket`] },
  'upper-leg': { joints: [`hip-socket`, `femur-top`, `knee`] },
  'lower-leg': { joints: [`knee`, `ankle`] },
  foot: {
    joints: [
      `ankle`,
      `foot-ball-bottom`,
      `big-toe-tip`,
      `index-toe-tip`,
      `middle-toe-tip`,
      `ring-toe-tip`,
      `pinky-toe-tip`,
    ],
  },
  'upper-arm': {
    joints: [`shoulder-socket`, `elbow`],
  },
  'lower-arm': {
    joints: [`elbow`, `wrist`],
  },
  hand: {
    rotation: [0, 0, Math.PI / 12],
    joints: [
      `wrist`,
      `thumb-metacarpal`,
      `index-finger-metacarpal`,
      `middle-finger-metacarpal`,
      `ring-finger-metacarpal`,
      `pinky-finger-metacarpal`,
      `thumb-phalanx-proximal`,
      `index-finger-phalanx-proximal`,
      `middle-finger-phalanx-proximal`,
      `ring-finger-phalanx-proximal`,
      `pinky-finger-phalanx-proximal`,
    ],
  },
  'finger-thumb-1': {
    joints: [`thumb-phalanx-proximal`, `thumb-phalanx-distal`],
  },
  'finger-thumb-2': {
    joints: [`thumb-phalanx-distal`, `thumb-tip`],
  },
  'finger-index-1': {
    joints: [`index-finger-phalanx-proximal`, `index-finger-phalanx-intermediate`],
  },
  'finger-index-2': {
    joints: [`index-finger-phalanx-intermediate`, `index-finger-phalanx-distal`],
  },
  'finger-index-3': {
    joints: [`index-finger-phalanx-distal`, `index-finger-tip`],
  },
  'finger-middle-1': {
    joints: [`middle-finger-phalanx-proximal`, `middle-finger-phalanx-intermediate`],
  },
  'finger-middle-2': {
    joints: [`middle-finger-phalanx-intermediate`, `middle-finger-phalanx-distal`],
  },
  'finger-middle-3': {
    joints: [`middle-finger-phalanx-distal`, `middle-finger-tip`],
  },
  'finger-ring-1': {
    joints: [`ring-finger-phalanx-proximal`, `ring-finger-phalanx-intermediate`],
  },
  'finger-ring-2': {
    joints: [`ring-finger-phalanx-intermediate`, `ring-finger-phalanx-distal`],
  },
  'finger-ring-3': {
    joints: [`ring-finger-phalanx-distal`, `ring-finger-tip`],
  },
  'finger-pinky-1': {
    joints: [`pinky-finger-phalanx-proximal`, `pinky-finger-phalanx-intermediate`],
  },
  'finger-pinky-2': {
    joints: [`pinky-finger-phalanx-intermediate`, `pinky-finger-phalanx-distal`],
  },
  'finger-pinky-3': {
    joints: [`pinky-finger-phalanx-distal`, `pinky-finger-tip`],
  },
} as const satisfies {
  [name in HumanBodyPartName]: {
    joints: readonly HumanJointName[];
    rotation?: readonly [number, number, number];
  };
};
