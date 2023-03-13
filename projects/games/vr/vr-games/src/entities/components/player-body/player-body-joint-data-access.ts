import { Triplet } from '@react-three/cannon';
import { humanJointData } from './player-body-joint-data';

type HumanJointExtraName = `neck-head-base` | `head-back` | `head-center` | `head-top` | `foot-ball-bottom`;
type HumanJointDataName = typeof humanJointData[number][`label`];
export type HumanJointName = HumanJointDataName | HumanJointExtraName;
export type HumanLimbName = `hand` | `arm` | `head` | `neck` | `core` | `leg` | `foot`;
export type HumanJointData = {
  side: `center` | `left` | `right`;
  joint: HumanJointName;
  children: HumanJointName[];
  radius: number;
  startPosition: Triplet;
  limb: HumanLimbName;
};

const getJointData = (side: `left` | `right`, joint: HumanJointDataName) => {
  const { cx, cy } = humanJointData.find((x) => x.label === joint)!;
  const pos = [((side === `left` ? -1 : 1) * Number(cx)) / 100, -Number(cy) / 100, 0] as Triplet;

  return {
    joint,
    startPosition: pos,
  };
};

const getNonHandJointData = (
  side: `center` | `left` | `right`,
  radius: number,
  z: number,
  limb: HumanLimbName,
  joint: Exclude<HumanJointDataName, XRHandJoint>,
  children: HumanJointName[],
) => {
  const j = getJointData(side === `center` ? `left` : side, joint) as {
    joint: Exclude<HumanJointDataName, XRHandJoint>;
    startPosition: Triplet;
  };
  return {
    side,
    limb,
    joint: j.joint as Exclude<HumanJointDataName, XRHandJoint>,
    children,
    radius,
    startPosition: [j.startPosition[0], j.startPosition[1], z] as Triplet,
  };
};

const getFootJointData = (
  side: `left` | `right`,
  radius: number,
  _zIgnored: number,
  joint: Exclude<HumanJointDataName, XRHandJoint>,
  children: HumanJointName[],
) => {
  const j = getJointData(side, joint) as {
    joint: Exclude<HumanJointDataName, XRHandJoint>;
    startPosition: Triplet;
  };
  return {
    side,
    limb: `foot` as const,
    joint: j.joint,
    children,
    radius,
    startPosition: [j.startPosition[0], 0, 3 * j.startPosition[1]] as Triplet,
  };
};

const getHandJointData = (side: `left` | `right`, joint: XRHandJoint, children: HumanJointName[]) => {
  const j = getJointData(side, joint) as {
    joint: XRHandJoint;
    startPosition: Triplet;
  };
  return {
    side,
    limb: `hand` as const,
    joint: j.joint,
    children,
    radius: 0.005,
    startPosition: j.startPosition,
  };
};

const createPlayerBody = () => {
  const joints: HumanJointData[] = [
    ...createPlayerSide(`left`),
    ...createPlayerSide(`right`),
    ...createPlayerHead(),
    {
      ...getNonHandJointData(`center`, 0.005, 0, `core`, `pelvis-top`, [
        `neck-base`,
        `pelvis-bottom`,
        `hip-socket`,
        `shoulder-socket`,
      ]),
    },
    {
      ...getNonHandJointData(`center`, 0.005, 0, `core`, `pelvis-bottom`, []),
    },

    // createPlayerHandNode({ ...getJointData(`left`, `neck-base`) }),
    // createPlayerHandNode({ ...getJointData(side, `thumb-metacarpal`) }),
    // createPlayerHandNode({ ...getJointData(side, `thumb-phalanx-proximal`) }),
  ];
  return [...joints];
};

const createPlayerHead = () => {
  const centerToTopDistance = 1 - getNonHandJointData(`center`, 0.01, 0, `head`, `nose-tip`, []).startPosition[1];
  const zHeadCenter = -0.01;
  const zHeadBack = zHeadCenter + 0.75 * centerToTopDistance;
  const zHeadFace = zHeadCenter - 0.75 * centerToTopDistance;

  const joints: HumanJointData[] = [
    { ...getNonHandJointData(`center`, 0.01, 0, `neck`, `neck-base`, [`neck-head-base`]) },
    {
      ...getNonHandJointData(`center`, 0.01, 0, `head`, `nose-tip`, [`head-center`]),
      joint: `neck-head-base` as const,
    },
    {
      // head-center is only slightly forward than body center (shoulder to knee)
      ...getNonHandJointData(`center`, 0.02, zHeadCenter, `head`, `nose-tip`, [
        `head-back`,
        `head-top`,
        `chin-tip`,
        `nose-tip`,
        `eye-lens`,
      ]),
      joint: `head-center` as const,
    },
    {
      ...getNonHandJointData(`center`, 0.005, zHeadBack, `head`, `nose-tip`, [`head-back`]),
      joint: `head-back` as const,
    },
    {
      ...getNonHandJointData(`center`, 0.005, 0, `head`, `nose-tip`, []),
      startPosition: [0, 1, -0.01],
      joint: `head-top` as const,
    },
    { ...getNonHandJointData(`center`, 0.005, zHeadFace, `head`, `chin-tip`, []) },
    { ...getNonHandJointData(`center`, 0.005, zHeadFace - 0.01, `head`, `nose-tip`, []) },
    { ...getNonHandJointData(`left`, 0.005, zHeadFace, `head`, `eye-lens`, []) },
    { ...getNonHandJointData(`right`, 0.005, zHeadFace, `head`, `eye-lens`, []) },
  ];
  return joints;
};

const createPlayerSide = (side: `left` | `right`) => {
  const ankle = getNonHandJointData(side, 0.01, 0.01, `leg`, `ankle`, [
    `foot-ball-bottom`,
    `big-toe-tip`,
    `index-toe-tip`,
    `middle-toe-tip`,
    `ring-toe-tip`,
    `pinky-toe-tip`,
  ]);
  const joints: HumanJointData[] = [
    ...createPlayerHand(side),
    { ...getNonHandJointData(side, 0.01, 0, `arm`, `elbow`, [`wrist`]) },
    { ...getNonHandJointData(side, 0.01, 0, `arm`, `shoulder-socket`, [`elbow`]) },
    { ...getNonHandJointData(side, 0.01, 0, `leg`, `hip-socket`, [`femur-top`]) },
    { ...getNonHandJointData(side, 0.01, 0, `leg`, `femur-top`, [`knee`]) },
    { ...getNonHandJointData(side, 0.01, 0, `leg`, `knee`, [`ankle`]) },
    {
      ...ankle,
    },
    {
      ...ankle,
      radius: 0.005,
      limb: `foot`,
      startPosition: [ankle.startPosition[0], 0, ankle.startPosition[2] + 0.01],
      joint: `foot-ball-bottom` as const,
    },
    { ...getFootJointData(side, 0.005, 0, `big-toe-tip`, []) },
    { ...getFootJointData(side, 0.005, 0, `index-toe-tip`, []) },
    { ...getFootJointData(side, 0.005, 0, `middle-toe-tip`, []) },
    { ...getFootJointData(side, 0.005, 0, `ring-toe-tip`, []) },
    { ...getFootJointData(side, 0.005, 0, `pinky-toe-tip`, []) },
  ];
  return joints;
};

const createPlayerHand = (side: `left` | `right`) => {
  // The code even looks like a hand 🤓
  const joints: HumanJointData[] = [
    {
      ...getHandJointData(side, `wrist`, [
        `thumb-metacarpal`,
        `index-finger-metacarpal`,
        `middle-finger-metacarpal`,
        `ring-finger-metacarpal`,
        `pinky-finger-metacarpal`,
      ]),
    },
    { ...getHandJointData(side, `thumb-metacarpal`, [`thumb-phalanx-proximal`]) },
    { ...getHandJointData(side, `thumb-phalanx-proximal`, [`thumb-phalanx-distal`]) },
    { ...getHandJointData(side, `thumb-phalanx-distal`, [`thumb-tip`]) },
    { ...getHandJointData(side, `thumb-tip`, []) },
    { ...getHandJointData(side, `index-finger-metacarpal`, [`index-finger-phalanx-proximal`]) },
    { ...getHandJointData(side, `index-finger-phalanx-proximal`, [`index-finger-phalanx-intermediate`]) },
    { ...getHandJointData(side, `index-finger-phalanx-intermediate`, [`index-finger-phalanx-distal`]) },
    { ...getHandJointData(side, `index-finger-phalanx-distal`, [`index-finger-tip`]) },
    { ...getHandJointData(side, `index-finger-tip`, []) },
    { ...getHandJointData(side, `middle-finger-metacarpal`, [`middle-finger-phalanx-proximal`]) },
    { ...getHandJointData(side, `middle-finger-phalanx-proximal`, [`middle-finger-phalanx-intermediate`]) },
    { ...getHandJointData(side, `middle-finger-phalanx-intermediate`, [`middle-finger-phalanx-distal`]) },
    { ...getHandJointData(side, `middle-finger-phalanx-distal`, [`middle-finger-tip`]) },
    { ...getHandJointData(side, `middle-finger-tip`, []) },
    { ...getHandJointData(side, `ring-finger-metacarpal`, [`ring-finger-phalanx-proximal`]) },
    { ...getHandJointData(side, `ring-finger-phalanx-proximal`, [`ring-finger-phalanx-intermediate`]) },
    { ...getHandJointData(side, `ring-finger-phalanx-intermediate`, [`ring-finger-phalanx-distal`]) },
    { ...getHandJointData(side, `ring-finger-phalanx-distal`, [`ring-finger-tip`]) },
    { ...getHandJointData(side, `ring-finger-tip`, []) },
    { ...getHandJointData(side, `pinky-finger-metacarpal`, [`pinky-finger-phalanx-proximal`]) },
    { ...getHandJointData(side, `pinky-finger-phalanx-proximal`, [`pinky-finger-phalanx-intermediate`]) },
    { ...getHandJointData(side, `pinky-finger-phalanx-intermediate`, [`pinky-finger-phalanx-distal`]) },
    { ...getHandJointData(side, `pinky-finger-phalanx-distal`, [`pinky-finger-tip`]) },
    { ...getHandJointData(side, `pinky-finger-tip`, []) },
  ];
  return joints;
};

const cache = {
  humanJoints: undefined as undefined | HumanJointData[],
};
export const getHumanJointData = () => {
  if (cache.humanJoints) {
    return cache.humanJoints;
  }
  return (cache.humanJoints = createPlayerBody());
};
