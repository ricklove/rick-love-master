import { handJointNames } from '../../input/hand-joints';
import { Ecs } from '../components/_components';

export const createHands = (ecs: Ecs) => {
  const leftHand = createHand(ecs, `left`);
  const rightHand = createHand(ecs, `right`);

  return {
    hands: {
      left: leftHand,
      right: rightHand,
    },
  };
};

const createHand = (ecs: Ecs, side: `left` | `right`) => {
  let x = ecs.entity(`${side}-hand`);

  handJointNames.forEach((jointName) => {
    x = x.addChild(
      ecs
        .entity(`${side}-hand-${jointName}`)
        .transform({ position: [0, 0, 0] })
        .rigidBody({ kind: `kinematicPositionBased` })
        .inputHandJoint({ handSide: side, handJoint: jointName })
        .addChild(
          ecs
            .entity(`${side}-hand-${jointName}-collider`)
            .transform({ position: [0, 0, 0] })
            .shape_sphere({ radius: 0.01 })
            .collider({ restitution: 0.8, friction: 0.1 })
            .graphics({ color: 0x00ff00 })
            .build(),
        )
        .build(),
    );
  });

  return x.build();
};
