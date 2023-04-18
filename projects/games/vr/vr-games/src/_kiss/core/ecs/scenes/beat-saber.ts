import { Ecs } from '../components/_components';
import { EntityActionCode } from '../components/actions/parser';
import { createAlienEgg } from '../prefabs/alien-egg';
import { createHands } from '../prefabs/hands';
import { createWeapon_knuckleClaws } from '../prefabs/weapons/knuckleClaws';

export const createScene_beatSaber = (ecs: Ecs) => {
  const hands = createHands(ecs);

  const egg = (side: `left` | `right`) => {
    const eggRaw = createAlienEgg(
      ecs,
      [0, 0, 0],
      0.5,
      side === `left` ? 0x00ff00 : 0xffff00,
      side === `left` ? 0x0000ff : 0xff0000,
    );
    return (
      ecs
        .copy(eggRaw, `eggEnemy`, false)
        .moveToTarget({
          target: [0, 0, 0],
          timeToMoveSec: 6,
        })
        .actions({})
        .actionDisableEntity({ actionName: `disable` })
        .collisionAction({
          collisionTagFilter: `weapon-${side}`,
          // selfColliderTagFilder: `leg`,
          action: `actionDisableEntity.disable()` as EntityActionCode,
        })
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
        .build()
    );
  };

  const root = ecs
    .entity(`root`, true)
    .addChild(hands.hands.left)
    .addChild(hands.hands.right)
    .addChild(hands.controllerHands.left)
    .addChild(hands.controllerHands.right)
    .addChild(hands.mouseHand)
    // .addChild(createWeapon_saber(ecs, [0, 1, -0.35], 1, `mouse`, true))
    .addChild(createWeapon_knuckleClaws(ecs, [0, 1, -0.35], 1, `mouse`, `weapon-left`, [-0.05, 0, 0], true))
    .addChild(createWeapon_knuckleClaws(ecs, [0, 1, -0.35], 1, `mouse`, `weapon-right`, [0.05, 0, 0], true))
    // .addChild(createWeapon_saber(ecs, [0, 1, -0.35], 1, `left`, `weapon-left`))
    // .addChild(createWeapon_saber(ecs, [0, 1, -0.35], 1, `right`, `weapon-right`))
    .addChild(createWeapon_knuckleClaws(ecs, [0, 1, -0.35], 1, `left`, `weapon-left`))
    .addChild(createWeapon_knuckleClaws(ecs, [0, 1, -0.35], 1, `right`, `weapon-right`))

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
        .entity(`eggSpawner-left`)
        .spawner({
          poolSize: 0,
          prefab: egg(`left`),
        })
        .build(),
    )
    .addChild(
      ecs
        .entity(`eggSpawner-right`)
        .spawner({
          poolSize: 0,
          prefab: egg(`right`),
        })
        .build(),
    )
    .addChild(ecs.entity(`game`).game({ active: true }).gameWithWaves({}).gameWithMusicWaves({}).build())
    .build();

  return root;
};
