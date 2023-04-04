import { handJointNames } from '../../input/hand-joints';
import { Ecs } from '../components/_components';

export const createHands = (ecs: Ecs, jointRadius = 0.02) => {
  const leftHand = createHand(ecs, `left`, jointRadius);
  const rightHand = createHand(ecs, `right`, jointRadius);

  return {
    hands: {
      left: leftHand,
      right: rightHand,
    },
  };
};

const createHand = (ecs: Ecs, side: `left` | `right`, jointRadius: number) => {
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
            .shape_sphere({ radius: jointRadius })
            .collider({ restitution: 0, friction: 1 })
            .graphics({ color: 0x00ff00 })
            .build(),
        )
        .build(),
    );
  });

  return x.build();
};
