import { Ecs } from '../components/_components';
import { EntityActionCode } from '../components/actions/parser';

export const createMenu = (
  ecs: Ecs,
  {
    position,
    items,
  }: {
    position: [number, number, number];
    items: { text: string; action: EntityActionCode }[];
  },
) => {
  const itemHeight = 0.04;

  const menuContainer = ecs.entity(`menu`);
  let menuScroller = ecs
    .entity(`menu-scroller`)
    .transform({ position })
    // using physics to move the menu
    .rigidBody({ kind: `dynamic`, gravityScale: 0 })
    .moveToTarget({ target: position, timeToMoveSec: 0.1 });

  // A rigidbody needs a collider to work
  menuScroller = menuScroller.addChild(
    ecs
      .entity(`menu-scroller-debug`)
      .transform({ position: [0, 0, 0] })
      .shape_sphere({ radius: 0.01 })
      .collider({ sensor: true })
      // for debugging
      // .graphics({ color: 0xffff00 })
      .build(),
  );

  // menu scroll buttons
  menuContainer
    .addChild(
      ecs
        .entity(`menu-up`)
        .transform({ position: [position[0] - itemHeight * 2.0, position[1] + itemHeight * 1.0, position[2]] })
        .rigidBody({ kind: `dynamic`, gravityScale: 0 })
        .collisionAction({
          collisionTagFilter: `hand`,
          action: `../menu-scroller/moveToTarget.setRelativeTarget([0,${itemHeight},0],0.25)` as EntityActionCode,
        })
        .addChild(
          ecs
            .entity(`menu-up-bullet`)
            .transform({ position: [0, 0, 0], rotation: [0, 0, Math.PI * 0.25] })
            .shape_box({ scale: [itemHeight * 0.75, itemHeight * 0.75, itemHeight * 0.75] })
            .collider({ sensor: true, colliderEvents: true })
            .graphics({ color: 0x0000ff })
            .build(),
        )
        // .addChild(
        //   ecs
        //     .entity(`menu-up-text`)
        //     .transform({ position: [0, 0, 0] })
        //     .shape_text({ text: `UP`, fontSize: itemHeight * 0.25, alignment: `center`, verticalAlignment: `center` })
        //     .graphics({ color: 0x00ff00 })
        //     .moveRelativeToParent({})
        //     // .collider({ sensor: true })
        //     .build(),
        // )
        .build(),
    )
    .addChild(
      ecs
        .entity(`menu-down`)
        .transform({ position: [position[0] - itemHeight * 2.0, position[1] - itemHeight * 1.0, position[2]] })
        .rigidBody({ kind: `dynamic`, gravityScale: 0 })
        .collisionAction({
          collisionTagFilter: `hand`,
          action: `../menu-scroller/moveToTarget.setRelativeTarget([0,-${itemHeight},0],0.25)` as EntityActionCode,
        })
        .addChild(
          ecs
            .entity(`menu-down-bullet`)
            .transform({ position: [0, 0, 0], rotation: [0, 0, Math.PI * 0.25] })
            .shape_box({ scale: [itemHeight * 0.75, itemHeight * 0.75, itemHeight * 0.75] })
            .collider({ sensor: true, colliderEvents: true })
            .graphics({ color: 0x0000ff })
            .build(),
        )
        // .addChild(
        //   ecs
        //     .entity(`menu-down-text`)
        //     .transform({ position: [0, 0, 0] })
        //     .shape_text({ text: `UP`, fontSize: itemHeight * 0.25, alignment: `center`, verticalAlignment: `center` })
        //     .graphics({ color: 0x00ff00 })
        //     .moveRelativeToParent({})
        //     // .collider({ sensor: true })
        //     .build(),
        // )
        .build(),
    );

  items.forEach(({ text, action }, i) => {
    menuScroller = menuScroller.addChild(
      ecs
        .entity(`menu-${i}`)
        .transform({ position: [0, -itemHeight * i, 0] })
        .rigidBody({ kind: `dynamic`, gravityScale: 0, moveToTransform: true })
        .collisionAction({
          collisionTagFilter: `hand`,
          action: `../../${action}` as EntityActionCode,
        })
        .moveRelativeToParent({})
        .addChild(
          ecs
            .entity(`menu-${i}-bullet`)
            .transform({ position: [0, 0, 0] })
            .shape_sphere({ radius: itemHeight * 0.25 })
            .collider({ sensor: true, colliderEvents: true })
            .graphics({ color: 0x00ff00 })
            .build(),
        )
        .addChild(
          ecs
            .entity(`menu-${i}-text`)
            .transform({ position: [itemHeight * 0.5, 0, 0] })
            .shape_text({ text, fontSize: itemHeight * 0.7, alignment: `left`, verticalAlignment: `center` })
            .graphics({ color: 0x00ff00 })
            .moveRelativeToParent({})
            // .collider({ sensor: true })
            .build(),
        )
        .build(),
    );
  });

  menuContainer.addChild(menuScroller.build());
  return menuContainer.build();
};
