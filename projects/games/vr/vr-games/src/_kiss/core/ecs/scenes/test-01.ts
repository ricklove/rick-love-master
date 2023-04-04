import { Ecs } from '../components/_components';
import { createAlienEgg } from '../prefabs/alien-egg';
import { createHands } from '../prefabs/hands';
import { createWeapon_saber } from '../prefabs/weapons/saber';

export const createScene_test01 = (ecs: Ecs) => {
  const hands = createHands(ecs);

  const scale = 0.25;
  const cols = 5;
  const count = 50;
  const eggs = [...new Array(count)].map((_, i) =>
    createAlienEgg(
      ecs,
      [-1 + scale * (i % cols), 1 + scale * Math.floor(i / (cols * cols)), -1 + scale * (Math.floor(i / cols) % cols)],
      scale,
    ),
  );

  const root = ecs
    .entity(`root`, false)
    .addChild(
      ecs
        .entity(`ground`)
        .transform({ position: [0, -5, 0] })
        .rigidBody({ kind: `fixed` })
        .addChild(
          ecs
            .entity(`ground-collider`)
            .transform({ position: [0, 0, 0] })
            .shape_box({ scale: [100, 10, 100] })
            .collider({ restitution: 0.8 })
            .graphics({ color: 0x333333 })
            .build(),
        )
        .build(),
    )
    .addChild(
      ecs
        .entity(`table`)
        .transform({ position: [0, 1, -1] })
        .rigidBody({ kind: `fixed` })
        .addChild(
          ecs
            .entity(`table-collider`)
            .transform({ position: [0, -0.025, 0] })
            .shape_box({ scale: [2, 0.05, 2] })
            .collider({ restitution: 0.1 })
            .graphics({ color: 0x111111 })
            .build(),
        )
        .build(),
    )
    .addChild(createWeapon_saber(ecs, [0, 1, -0.35], 1))
    .addChildren(eggs)
    // .addChild(createSaber(ecs, [0, 1, -0.35], 1))
    // .addChild(createSaber(ecs, [0, 1, -0.25], 1))
    // .addChild(createSaber(ecs, [0, 1, -0.15], 1))
    // .addChild(createSaber(ecs, [0, 1, -0.05], 1))
    // .addChild(createAlienEgg(ecs, [-1, 2, -3], 0.25))
    .addChild(createAlienEgg(ecs, [-2, 2, -5]))
    .addChild(
      ecs
        .entity(`ball`)
        .transform({ position: [0, 2, -5] })
        .rigidBody({ kind: `dynamic` })
        .addChild(
          ecs
            .entity(`ball-collider`)
            .transform({ position: [0, 0, 0] })
            .shape_sphere({ radius: 0.5 })
            .collider({ restitution: 0.8, colliderEvents: true })
            .graphics({ color: 0x0000ff })
            .build(),
        )
        .build(),
    )
    .addChild(
      ecs
        .entity(`ball2`)
        .transform({ position: [0, 2.7, -5] })
        .rigidBody({ kind: `dynamic` })
        .addChild(
          ecs
            .entity(`ball-collider`)
            .transform({ position: [0, 0, 0] })
            .shape_sphere({ radius: 0.1 })
            .collider({ restitution: 0.8 })
            .graphics({ color: 0x550055 })
            .build(),
        )
        .build(),
    )
    .addChild(hands.hands.left)
    .addChild(hands.hands.right)
    .build();

  return root;
};
