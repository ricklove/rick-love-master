import { createComponentFactory } from '../ecs-component-factory';

export type Entity_Transform = {
  transform: {
    position: [number, number, number];
    quaternion: [number, number, number, number];
  };
};

export const transformComponentFactory = createComponentFactory<{}, Entity_Transform, {}>()(`transform`, () => {
  return {
    addComponent: (
      entity,
      args: {
        position: [number, number, number];
        quaternion?: [number, number, number, number];
      },
    ) => {
      return {
        ...entity,
        transform: {
          position: args.position,
          quaternion: args.quaternion ?? [0, 0, 0, 1],
        },
      };
    },
    setup: (entity) => {
      return entity;
    },
  };
});
