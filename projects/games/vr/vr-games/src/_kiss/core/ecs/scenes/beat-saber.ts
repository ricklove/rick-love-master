import { Ecs } from '../components/_components';
import { createAlienEgg } from '../prefabs/alien-egg';
import { createHands } from '../prefabs/hands';
import { createWeapon_knuckleClaws } from '../prefabs/weapons/knuckleClaws';
import { createWeapon_saber } from '../prefabs/weapons/saber';

export const createScene_beatSaber = (ecs: Ecs) => {
  const hands = createHands(ecs);

  const eggRaw = createAlienEgg(ecs, [0, 0, 0], 0.5);
  const egg = ecs
    .copy(eggRaw, `eggEnemy`, false)
    .moveToTarget({
      target: [0, 0, 0],
      timeToMoveSec: 6,
    })
    .build();

  const root = ecs
    .entity(`root`, false)
    .addChild(hands.hands.left)
    .addChild(hands.hands.right)
    .addChild(createWeapon_saber(ecs, [0, 1, -0.35], 1, `left`))
    .addChild(createWeapon_knuckleClaws(ecs, [0, 1, -0.35], 1, `right`))
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
        .entity(`egg`)
        .spawner({
          poolSize: 0,
          prefab: egg,
        })
        .build(),
    )
    .addChild(
      ecs
        .entity(`game`)
        .game({ active: true })
        .gameWithWaves({
          waves: [
            {
              sequence: [
                {
                  spawnerName: `egg`,
                  count: 10,
                  position: [0, 1, -25],
                  timeBeforeSequenceSec: 1,
                },
              ],
              timeBeforeWaveSec: 3,
            },
          ],
        })
        .build(),
    )

    // .addChild(
    //   ecs
    //     .entity(`table`)
    //     .transform({ position: [0, 1, -1] })
    //     .rigidBody({ kind: `fixed` })
    //     .addChild(
    //       ecs
    //         .entity(`table-collider`)
    //         .transform({ position: [0, -0.025, 0] })
    //         .shape_box({ scale: [2, 0.05, 2] })
    //         .collider({ restitution: 0.1 })
    //         .graphics({ color: 0x111111 })
    //         .build(),
    //     )
    //     .build(),
    // )
    // .addChildren(eggs)
    // .addChild(createSaber(ecs, [0, 1, -0.35], 1))
    // .addChild(createSaber(ecs, [0, 1, -0.25], 1))
    // .addChild(createSaber(ecs, [0, 1, -0.15], 1))
    // .addChild(createSaber(ecs, [0, 1, -0.05], 1))
    // .addChild(createAlienEgg(ecs, [-1, 2, -3], 0.25))
    // .addChild(createAlienEgg(ecs, [-2, 2, -5]))
    // .addChild(
    //   ecs
    //     .entity(`ball`)
    //     .transform({ position: [0, 2, -5] })
    //     .rigidBody({ kind: `dynamic` })
    //     .addChild(
    //       ecs
    //         .entity(`ball-collider`)
    //         .transform({ position: [0, 0, 0] })
    //         .shape_sphere({ radius: 0.5 })
    //         .collider({ restitution: 0.8, colliderEvents: true })
    //         .graphics({ color: 0x0000ff })
    //         .build(),
    //     )
    //     .build(),
    // )
    // .addChild(
    //   ecs
    //     .entity(`ball2`)
    //     .transform({ position: [0, 2.7, -5] })
    //     .rigidBody({ kind: `dynamic` })
    //     .addChild(
    //       ecs
    //         .entity(`ball-collider`)
    //         .transform({ position: [0, 0, 0] })
    //         .shape_sphere({ radius: 0.1 })
    //         .collider({ restitution: 0.8 })
    //         .graphics({ color: 0x550055 })
    //         .build(),
    //     )
    //     .build(),
    // )

    .build();

  return root;
};
