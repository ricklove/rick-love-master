import { HumanJointName } from './humanoid-body-joint-data-access';

const complexHand = {
  hand: {
    mass: 0.5,
    rotation: [0, 0, Math.PI / 12],
    joints: [
      `wrist`,
      `thumb-metacarpal`,
      `index-finger-metacarpal`,
      `middle-finger-metacarpal`,
      `ring-finger-metacarpal`,
      `pinky-finger-metacarpal`,
      //   `thumb-phalanx-proximal`,
      `index-finger-phalanx-proximal`,
      `middle-finger-phalanx-proximal`,
      `ring-finger-phalanx-proximal`,
      `pinky-finger-phalanx-proximal`,
    ],
  },
  'finger-thumb-0': {
    mass: 0.03,
    joints: [`thumb-metacarpal`, `thumb-phalanx-proximal`],
  },
  'finger-thumb-1': {
    mass: 0.03,
    joints: [`thumb-phalanx-proximal`, `thumb-phalanx-distal`],
  },
  'finger-thumb-2': {
    mass: 0.03,
    joints: [`thumb-phalanx-distal`, `thumb-tip`],
  },
  'finger-index-1': {
    mass: 0.03,
    joints: [`index-finger-phalanx-proximal`, `index-finger-phalanx-intermediate`],
  },
  'finger-index-2': {
    mass: 0.03,
    joints: [`index-finger-phalanx-intermediate`, `index-finger-phalanx-distal`],
  },
  'finger-index-3': {
    mass: 0.03,
    joints: [`index-finger-phalanx-distal`, `index-finger-tip`],
  },
  'finger-middle-1': {
    mass: 0.03,
    joints: [`middle-finger-phalanx-proximal`, `middle-finger-phalanx-intermediate`],
  },
  'finger-middle-2': {
    mass: 0.03,
    joints: [`middle-finger-phalanx-intermediate`, `middle-finger-phalanx-distal`],
  },
  'finger-middle-3': {
    mass: 0.03,
    joints: [`middle-finger-phalanx-distal`, `middle-finger-tip`],
  },
  'finger-ring-1': {
    mass: 0.03,
    joints: [`ring-finger-phalanx-proximal`, `ring-finger-phalanx-intermediate`],
  },
  'finger-ring-2': {
    mass: 0.03,
    joints: [`ring-finger-phalanx-intermediate`, `ring-finger-phalanx-distal`],
  },
  'finger-ring-3': {
    mass: 0.03,
    joints: [`ring-finger-phalanx-distal`, `ring-finger-tip`],
  },
  'finger-pinky-1': {
    mass: 0.03,
    joints: [`pinky-finger-phalanx-proximal`, `pinky-finger-phalanx-intermediate`],
  },
  'finger-pinky-2': {
    mass: 0.03,
    joints: [`pinky-finger-phalanx-intermediate`, `pinky-finger-phalanx-distal`],
  },
  'finger-pinky-3': {
    mass: 0.03,
    joints: [`pinky-finger-phalanx-distal`, `pinky-finger-tip`],
  },
} as const;

const mediumHand = {
  hand: {
    mass: 0.5,
    rotation: [0, 0, Math.PI / 12],
    joints: [
      `wrist`,
      `thumb-metacarpal`,
      `index-finger-metacarpal`,
      `middle-finger-metacarpal`,
      `ring-finger-metacarpal`,
      `pinky-finger-metacarpal`,
      //   `thumb-phalanx-proximal`,
      `index-finger-phalanx-proximal`,
      `middle-finger-phalanx-proximal`,
      `ring-finger-phalanx-proximal`,
      `pinky-finger-phalanx-proximal`,
    ],
  },
  'finger-thumb': {
    mass: 0.1,
    joints: [
      `thumb-metacarpal`,
      // `thumb-phalanx-proximal`,
      // `thumb-phalanx-distal`,
      `thumb-tip`,
    ],
  },
  'finger-index': {
    mass: 0.1,
    joints: [
      `index-finger-phalanx-proximal`,
      // `index-finger-phalanx-intermediate`,
      // `index-finger-phalanx-distal`,
      `index-finger-tip`,
    ],
  },
  'finger-middle': {
    mass: 0.1,
    joints: [
      `middle-finger-phalanx-proximal`,
      // `middle-finger-phalanx-intermediate`,
      // `middle-finger-phalanx-distal`,
      `middle-finger-tip`,
    ],
  },
  'finger-ring': {
    mass: 0.1,
    joints: [
      `ring-finger-phalanx-proximal`,
      // `ring-finger-phalanx-intermediate`,
      // `ring-finger-phalanx-distal`,
      `ring-finger-tip`,
    ],
  },
  'finger-pinky': {
    mass: 0.1,
    joints: [
      `pinky-finger-phalanx-proximal`,
      // `pinky-finger-phalanx-intermediate`,
      // `pinky-finger-phalanx-distal`,
      `pinky-finger-tip`,
    ],
  },
} as const;

const simpleHand = {
  hand: {
    mass: 0.5,
    rotation: [0, 0, Math.PI / 12],
    joints: [
      ...new Set(Object.values(complexHand).flatMap((x) => x.joints)),
    ] as typeof complexHand[keyof typeof complexHand][`joints`][number][],
  },
} as const;

const mainBodyParts = {
  head: {
    mass: 2,
    joints: [`neck-head-base`, `head-center`, `head-back`, `head-top`, `eye-lens`, `nose-tip`, `chin-tip`, `ear`],
  },
  neck: {
    mass: 1,
    joints: [`neck-base`, `neck-head-base`],
  },
  'upper-torso': {
    mass: 6,
    joints: [`neck-base`, `shoulder-socket`, `pelvis-top`],
  },
  'lower-torso': {
    mass: 4,
    joints: [`pelvis-top`, `pelvis-bottom`, `hip-socket`],
  },
  'upper-leg': {
    mass: 6,
    joints: [`hip-socket`, `femur-top`, `knee`],
  },
  'lower-leg': {
    mass: 3,
    joints: [`knee`, `ankle`],
  },
  foot: {
    mass: 1,
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
    mass: 2,
    joints: [`shoulder-socket`, `elbow`],
  },
  'lower-arm': {
    mass: 2,
    joints: [`elbow`, `wrist`],
  },
} as const;

export const humanBodyParts = {
  ...mainBodyParts,
  // ...complexHand,
  // ...mediumHand,
  ...simpleHand,
} as const satisfies {
  [name in string]: {
    joints: readonly HumanJointName[];
    mass?: number;
    rotation?: readonly [number, number, number];
  };
};

export type HumanBodyPartName = keyof typeof humanBodyParts;
