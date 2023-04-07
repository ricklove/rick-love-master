import { Ecs } from '../components/_components';
import { createAlienEgg } from '../prefabs/alien-egg';
import { createHands } from '../prefabs/hands';
import { createMenu } from '../prefabs/menu';
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
    .actions({})
    .actionDisableEntity({ actionName: `disable` })
    .collisionAction({ collisionTagFilter: `weapon`, action: `actionDisableEntity.disable()` })
    // .addChild(
    //   ecs
    //     .entity(`eggEnemy-text`)
    //     .transform({ position: [0.35, 0.25, 0] })
    //     .shape_text({ text: `Egg`, fontSize: 0.5, alignment: `left`, verticalAlignment: `center` })
    //     .graphics({ color: 0xff0000 })
    //     .moveRelativeToParent({})
    //     // .collider({ sensor: true })
    //     .build(),
    // )
    .build();

  const songs = [
    `MW`,
    `g`,
    `n`,
    `Song-1`,
    `Song-2`,
    `Song-3`,
    `Song-4`,
    `Song-5`,
    `Song-6`,
    `Song-7`,
    `Song-8`,
    `Song-9`,
    `Song-10`,
  ];
  const menu = createMenu(ecs, [-0.1, 1, -0.5], songs);

  const root = ecs
    .entity(`root`, true)
    .addChild(hands.hands.left)
    .addChild(hands.hands.right)
    .addChild(hands.mouseHand)
    .addChild(createWeapon_knuckleClaws(ecs, [0, 1, -0.35], 1, `mouse`))
    .addChild(createWeapon_saber(ecs, [0, 1, -0.35], 1, `left`))
    .addChild(createWeapon_knuckleClaws(ecs, [0, 1, -0.35], 1, `right`))
    // .addChild(
    //   ecs
    //     .entity(`weapon-test`)
    //     .transform({ position: [0.25, 0, -3] })
    //     .rigidBody({ kind: `kinematicPositionBased`, collisionTag: `weapon` })
    //     .addChild(
    //       ecs
    //         .entity(`box-collider`)
    //         .transform({ position: [0, 0.5, 0] })
    //         .shape_box({ scale: [0.5, 0.5, 0.5] })
    //         .collider({ colliderEvents: true })
    //         .graphics({ color: 0xff0000 })
    //         .build(),
    //     )
    //     .build(),
    // )
    .addChild(menu)
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
        .entity(`eggSpawner`)
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
                  spawnerName: `eggSpawner`,
                  count: 3,
                  position: [2, 1, -25],
                  action: `moveToTarget.setTarget([-1, 1, 0], 6)`,
                  timeBeforeSpawnSec: 1,
                },
                {
                  spawnerName: `eggSpawner`,
                  count: 3,
                  position: [-2, 1, -15],
                  action: `moveToTarget.setTarget([1, 1, 0], 3)`,
                  timeBeforeSpawnSec: 1,
                },
                {
                  spawnerName: `eggSpawner`,
                  count: 3,
                  position: [0, 0, -25],
                  action: `moveToTarget.setTarget([0, 0, 0], 6)`,
                  timeBeforeSpawnSec: 1,
                },
              ],
              timeBeforeWaveSec: 3,
            },
          ],
        })
        .build(),
    )
    .build();

  return root;
};
