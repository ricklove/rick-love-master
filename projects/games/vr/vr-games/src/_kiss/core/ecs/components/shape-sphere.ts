import { createComponentFactory } from '../ecs-component-factory';

export type Entity_ShapeSphere = {
  shape: { kind: `sphere`; radius: number };
};

export const shapeSphereComponentFactory = createComponentFactory<{}, Entity_ShapeSphere>()(() => {
  return {
    name: `shape_sphere`,
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
        shape: {
          kind: `sphere`,
          radius,
        },
      };
    },
    setup: (entity) => {
      return entity;
    },
  };
});
