import { Triplet } from '@react-three/cannon';
import { defineComponent, EntityBase, EntityList, EntityWithChildren } from '../../core';
import { Entity } from '../../entity';
import { EntityPhysicsViewSphere } from '../physics-view-sphere';
import { humanJointData } from './player-body-joint-data';

export type EntityPlayerBody = EntityWithChildren & {
  playerBody: {
    parts: EntityBase[];
  };
};
export const EntityPlayerBody = defineComponent<EntityPlayerBody>()
  .with(`children`, () => new EntityList())
  .with(`playerBody`, ({}: {}, e) => {
    const parts = createPlayerBody();
    e.children.add(...parts);
    return { parts };
  })
  .attach({});

type HumanJointKind = typeof humanJointData[number][`label`];
const getJointData = (side: `left` | `right`, joint: HumanJointKind) => {
  const { cx, cy } = humanJointData.find((x) => x.label === joint)!;
  const pos = [((side === `left` ? 1 : -1) * Number(cx)) / 100, -Number(cy) / 100, 0] as Triplet;

  return {
    joint,
    startPosition: pos,
  };
};

const getNonHandJointData = (
  side: `left` | `right`,
  radius: number,
  z: number,
  joint: Exclude<HumanJointKind, XRHandJoint>,
) => {
  const j = getJointData(side, joint) as {
    joint: Exclude<HumanJointKind, XRHandJoint>;
    startPosition: Triplet;
  };
  return {
    joint: j.joint as Exclude<HumanJointKind, XRHandJoint>,
    radius,
    startPosition: [j.startPosition[0], j.startPosition[1], z] as Triplet,
  };
};

const getFootJointData = (
  side: `left` | `right`,
  radius: number,
  z: number,
  joint: Exclude<HumanJointKind, XRHandJoint>,
) => {
  const j = getJointData(side, joint) as {
    joint: Exclude<HumanJointKind, XRHandJoint>;
    startPosition: Triplet;
  };
  return {
    joint: j.joint as Exclude<HumanJointKind, XRHandJoint>,
    radius,
    startPosition: [j.startPosition[0], 0, -3 * j.startPosition[1]] as Triplet,
  };
};

const getHandJointData = (side: `left` | `right`, joint: XRHandJoint) => {
  return getJointData(side, joint) as {
    joint: XRHandJoint;
    startPosition: Triplet;
  };
};

const createPlayerBody = () => {
  const joints = [
    ...createPlayerSide(`left`),
    ...createPlayerSide(`right`),
    createPlayerNonHandNode({ ...getNonHandJointData(`left`, 0.01, 0, `neck-base`) }),
    createPlayerNonHandNode({ ...getNonHandJointData(`left`, 0.005, 0.04, `chin-tip`) }),
    createPlayerNonHandNode({ ...getNonHandJointData(`left`, 0.005, 0.05, `nose-tip`) }),

    // createPlayerHandNode({ ...getJointData(`left`, `neck-base`) }),
    // createPlayerHandNode({ ...getJointData(side, `thumb-metacarpal`) }),
    // createPlayerHandNode({ ...getJointData(side, `thumb-phalanx-proximal`) }),
  ];
  return [...joints];
};

const createPlayerSide = (side: `left` | `right`) => {
  const joints = [
    ...createPlayerHand(side),
    createPlayerNonHandNode({ ...getNonHandJointData(side, 0.005, 0.03, `eye-lens`) }),
    createPlayerNonHandNode({ ...getNonHandJointData(side, 0.01, 0, `elbow`) }),
    createPlayerNonHandNode({ ...getNonHandJointData(side, 0.01, 0, `shoulder-socket`) }),
    createPlayerNonHandNode({ ...getNonHandJointData(side, 0.01, 0, `hip-socket`) }),
    createPlayerNonHandNode({ ...getNonHandJointData(side, 0.01, 0, `femur-top`) }),
    createPlayerNonHandNode({ ...getNonHandJointData(side, 0.01, 0, `knee`) }),
    createPlayerNonHandNode({ ...getNonHandJointData(side, 0.01, 0, `ankle`) }),
    createPlayerNonHandNode({ ...getFootJointData(side, 0.005, 0, `big-toe-tip`) }),
    createPlayerNonHandNode({ ...getFootJointData(side, 0.005, 0, `index-toe-tip`) }),
    createPlayerNonHandNode({ ...getFootJointData(side, 0.005, 0, `middle-toe-tip`) }),
    createPlayerNonHandNode({ ...getFootJointData(side, 0.005, 0, `ring-toe-tip`) }),
    createPlayerNonHandNode({ ...getFootJointData(side, 0.005, 0, `pinky-toe-tip`) }),
  ];
  return joints;
};

const createPlayerHand = (side: `left` | `right`) => {
  const joints = [
    createPlayerHandNode({ ...getHandJointData(side, `wrist`) }),
    createPlayerHandNode({ ...getHandJointData(side, `thumb-metacarpal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `thumb-phalanx-proximal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `thumb-phalanx-distal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `thumb-tip`) }),
    createPlayerHandNode({ ...getHandJointData(side, `index-finger-metacarpal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `index-finger-phalanx-proximal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `index-finger-phalanx-intermediate`) }),
    createPlayerHandNode({ ...getHandJointData(side, `index-finger-phalanx-distal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `index-finger-tip`) }),
    createPlayerHandNode({ ...getHandJointData(side, `middle-finger-metacarpal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `middle-finger-phalanx-proximal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `middle-finger-phalanx-intermediate`) }),
    createPlayerHandNode({ ...getHandJointData(side, `middle-finger-phalanx-distal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `middle-finger-tip`) }),
    createPlayerHandNode({ ...getHandJointData(side, `ring-finger-metacarpal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `ring-finger-phalanx-proximal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `ring-finger-phalanx-intermediate`) }),
    createPlayerHandNode({ ...getHandJointData(side, `ring-finger-phalanx-distal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `ring-finger-tip`) }),
    createPlayerHandNode({ ...getHandJointData(side, `pinky-finger-metacarpal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `pinky-finger-phalanx-proximal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `pinky-finger-phalanx-intermediate`) }),
    createPlayerHandNode({ ...getHandJointData(side, `pinky-finger-phalanx-distal`) }),
    createPlayerHandNode({ ...getHandJointData(side, `pinky-finger-tip`) }),
  ];
  return joints;
};

const createPlayerNonHandNode = ({
  startPosition,
  joint,
  radius,
}: {
  startPosition: Triplet;
  joint: HumanJointKind;
  radius: number;
}) => {
  const ball = Entity.create(`ball`)
    .addComponent(EntityPhysicsViewSphere, {
      mass: 0,
      radius,
      debugColor: 0x0000ff,
      startPosition,
    })
    .build();

  return ball;
};

const createPlayerHandNode = ({ startPosition, joint }: { startPosition: Triplet; joint: XRHandJoint }) => {
  const ball = Entity.create(`ball`)
    .addComponent(EntityPhysicsViewSphere, {
      mass: 0,
      radius: 0.005,
      debugColor: 0x0000ff,
      startPosition,
    })
    .build();

  return ball;
};
