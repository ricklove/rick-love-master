import { createComponentFactory } from '../ecs-component-factory';

export type Entity_ShapeBox = {
  shape: { kind: `box`; scale: [number, number, number] };
};

export const shapeBoxComponentFactory = createComponentFactory<{}, Entity_ShapeBox>()(`shape_box`, () => {
  return {
    addComponent: (
      entity,
      {
        scale,
      }: {
        scale: [number, number, number];
      },
    ) => {
      return {
        ...entity,
        shape: {
          kind: `box`,
          scale,
        },
      };
    },
    setup: (entity) => {
      return entity;
    },
  };
});
