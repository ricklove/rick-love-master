import { createComponentFactory } from '../ecs-component-factory';

export type Entity_Box = {
  box: { scale: [number, number, number] };
};

export const boxComponentFactory = createComponentFactory<{}, Entity_Box>()(`box`, () => {
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
        box: {
          scale,
        },
      };
    },
    setup: (entity) => {
      return entity;
    },
  };
});
