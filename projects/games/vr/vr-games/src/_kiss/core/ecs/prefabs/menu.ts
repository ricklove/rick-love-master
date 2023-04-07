import { Ecs } from '../components/_components';

export const createMenu = (ecs: Ecs, position: [number, number, number], items: string[]) => {
  let x = ecs.entity(`menu`);

  const itemHeight = 0.1;

  items.forEach((text, i) => {
    x = x.addChild(
      ecs
        .entity(`menu-${i}`)
        .transform({ position })
        .rigidBody({ kind: `kinematicPositionBased` })
        .addChild(
          ecs
            .entity(`menu-${i}-bullet`)
            .transform({ position: [0, -itemHeight * i, 0] })
            .shape_sphere({ radius: itemHeight * 0.25 })
            .collider({ restitution: 0, friction: 1 })
            .graphics({ color: 0x00ff00 })
            .build(),
        )
        .addChild(
          ecs
            .entity(`menu-${i}-text`)
            .transform({ position: [itemHeight * 0.5, -itemHeight * i, 0] })
            .shape_text({ text, fontSize: itemHeight * 0.7, alignment: `left`, verticalAlignment: `center` })
            .graphics({ color: 0x00ff00 })
            .moveRelativeToParent({})
            // .collider({ sensor: true })
            .build(),
        )
        .build(),
    );
  });

  return x.build();
};
