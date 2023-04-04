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
    .actions({})
    .actionDisableEntity({ actionName: `collide` })
    .collisionAction({ collisionTagFilter: `weapon`, action: `collide` })
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
    .build();

  return root;
};
