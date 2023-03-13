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
    const parts = [...createPlayerHand(`left`), ...createPlayerHand(`right`)];
    e.children.add(...parts);
    return { parts };
  })
  .attach({});

const createPlayerHand = (side: `left` | `right`) => {
  const getJointData = (joint: XRHandJoint) => {
    const { cx, cy } = humanJointData.find((x) => x.label === joint)!;
    const pos = [((side === `left` ? 1 : -1) * Number(cx)) / 100, -Number(cy) / 100, 0] as Triplet;

    return {
      joint,
      startPosition: pos,
    };
  };
  const joints = [
    createPlayerHandNode({ ...getJointData(`wrist`) }),
    // createPlayerHandNode({ ...getJointData(`thumb-metacarpal`) }),
    // createPlayerHandNode({ ...getJointData(`thumb-phalanx-proximal`) }),
    // createPlayerHandNode({ ...getJointData(`thumb-phalanx-distal`) }),
    // createPlayerHandNode({ ...getJointData(`thumb-tip`) }),
    // createPlayerHandNode({ ...getJointData(`index-finger-metacarpal`) }),
    // createPlayerHandNode({ ...getJointData(`index-finger-phalanx-proximal`) }),
    // createPlayerHandNode({ ...getJointData(`index-finger-phalanx-intermediate`) }),
    // createPlayerHandNode({ ...getJointData(`index-finger-phalanx-distal`) }),
    // createPlayerHandNode({ ...getJointData(`index-finger-tip`) }),
    // createPlayerHandNode({ ...getJointData(`middle-finger-metacarpal`) }),
    // createPlayerHandNode({ ...getJointData(`middle-finger-phalanx-proximal`) }),
    // createPlayerHandNode({ ...getJointData(`middle-finger-phalanx-intermediate`) }),
    // createPlayerHandNode({ ...getJointData(`middle-finger-phalanx-distal`) }),
    // createPlayerHandNode({ ...getJointData(`middle-finger-tip`) }),
    // createPlayerHandNode({ ...getJointData(`ring-finger-metacarpal`) }),
    // createPlayerHandNode({ ...getJointData(`ring-finger-phalanx-proximal`) }),
    // createPlayerHandNode({ ...getJointData(`ring-finger-phalanx-intermediate`) }),
    // createPlayerHandNode({ ...getJointData(`ring-finger-phalanx-distal`) }),
    // createPlayerHandNode({ ...getJointData(`ring-finger-tip`) }),
    // createPlayerHandNode({ ...getJointData(`pinky-finger-metacarpal`) }),
    // createPlayerHandNode({ ...getJointData(`pinky-finger-phalanx-proximal`) }),
    // createPlayerHandNode({ ...getJointData(`pinky-finger-phalanx-intermediate`) }),
    // createPlayerHandNode({ ...getJointData(`pinky-finger-phalanx-distal`) }),
    // createPlayerHandNode({ ...getJointData(`pinky-finger-tip`) }),
  ];
  return [...joints];
};

const createPlayerHandNode = ({ startPosition, joint }: { startPosition: Triplet; joint: XRHandJoint }) => {
  const ball = Entity.create(`ball`)
    .addComponent(EntityPhysicsViewSphere, {
      mass: 0,
      radius: 0.01,
      debugColor: 0x0000ff,
      startPosition,
    })
    .build();

  return ball;
};
