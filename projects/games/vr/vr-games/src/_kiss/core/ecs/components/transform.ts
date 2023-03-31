import { createComponentFactory } from '../ecs-component-factory';

export type Entity_Transform = {
  transform: {
    position: { x: number; y: number; z: number };
    quaternion: { x: number; y: number; z: number; w: number };
  };
};

export const transformComponentFactory = createComponentFactory<{}, Entity_Transform, {}>()(`transform`, () => {
  return {
    addComponent: (
      entity,
      args: {
        position: { x: number; y: number; z: number };
        quaternion?: { x: number; y: number; z: number; w: number };
      },
    ) => {
      return {
        ...entity,
        transform: {
          position: args.position,
          quaternion: args.quaternion ?? { x: 0, y: 0, z: 0, w: 1 },
        },
      };
    },
    setup: (entity) => {
      return entity;
    },
  };
});
