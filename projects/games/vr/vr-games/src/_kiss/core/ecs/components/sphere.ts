import { createComponentFactory } from '../ecs-component-factory';

export type Entity_Sphere = {
  sphere: { radius: number };
};

export const sphereComponentFactory = createComponentFactory<{}, Entity_Sphere>()(`sphere`, () => {
  return {
    addComponent: (
      entity,
      {
        radius,
      }: {
        radius: number;
      },
    ) => {
      return {
        ...entity,
        sphere: {
          radius,
        },
      };
    },
    setup: (entity) => {
      return entity;
    },
  };
});
