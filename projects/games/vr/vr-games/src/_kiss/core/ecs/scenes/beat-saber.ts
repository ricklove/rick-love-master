import { Ecs } from '../components/_components';
import { EntityActionCode } from '../components/actions/parser';
import { EntityDescUntyped } from '../ecs-engine';
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

  const groundTile = ([i, j]: [number, number], scaleSize: number) => {
    const size = 0.9 * scaleSize;
    return ecs
      .entity(`ground`)
      .transform({ position: [i * scaleSize, -0.5 * scaleSize, j * scaleSize] })
      .rigidBody({ kind: `fixed` })
      .addChild(
        ecs
          .entity(`ground-collider`)
          .transform({ position: [0, 0, 0] })
          .shape_box({ scale: [size, size, size] })
          .collider({ restitution: 0.8 })
          .graphics({ color: 0xffffff })
          .build(),
      )
      .build();
  };

  const groundTiles = (gridRadius: number, scaleSize: number) =>
    [...new Array((2 * gridRadius + 1) * (2 * gridRadius + 1) - 1)].map((_, i) =>
      groundTile([gridRadius - (i % (gridRadius * 2)), gridRadius - Math.floor(i / (gridRadius * 2))], scaleSize),
    );

  const menuItemPrefab = ecs
    .entity(`menu-item`, true)
    .transform({ position: [0, 0, -3] })
    .shape_box({ scale: [0.05, 0.05, 0.05] })
    .graphics({ color: 0xff0000 })
    .build();
  const menuTest = ecs
    .entity(`menuTest`, true)
    .transform({ position: [0, 0, 0] })
    .menu({
      menuItem: {
        prefab: menuItemPrefab,
        bounds: [0.2, 0.2, 0.2],
        setItemAction: `` as EntityActionCode,
        moveToTargetAction: `` as EntityActionCode,
        setPositionAction: `transform.move([0,0,0])` as EntityActionCode,
      },
      menuItemDetails: {
        prefab: menuItemPrefab,
        bounds: [0.2, 0.2, 0.2],
        setItemAction: `` as EntityActionCode,
        setPositionAction: `` as EntityActionCode,
      },
      path: [
        [-2, 0, -5],
        [-1, 1, -2],
        [0, 1.5, -1],
        [1, 1, -2],
        [2, 2, -5],
      ],
    })
    .build();

  const inputs = ecs
    .entity(`inputs`, true)
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

    .build();

  const ground = ecs
    .entity(`ground`, true)
    .addChild(
      ecs
        .entity(`subground`)
        .transform({ position: [0, -105, 0] })
        .rigidBody({ kind: `fixed` })
        .addChild(
          ecs
            .entity(`ground-collider`)
            .transform({ position: [0, 0, 0] })
            .shape_box({ scale: [100, 10, 100] })
            .collider({ restitution: 0.8 })
            .graphics({ color: 0x330000 })
            .build(),
        )
        .build(),
    )
    .addChildren(groundTiles(4, 0.25))
    .build();

  const root = ecs
    .entity(`root`, true)
    .addChild(inputs as EntityDescUntyped)
    .addChild(menuTest as EntityDescUntyped)
    .addChild(ground as EntityDescUntyped)
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
