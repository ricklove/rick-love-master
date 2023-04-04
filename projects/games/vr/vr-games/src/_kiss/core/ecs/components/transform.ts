import { Euler, Quaternion } from 'three';
import { createComponentFactory } from '../ecs-component-factory';

export type Entity_Transform = {
  transform: {
    position: [number, number, number];
    quaternion: [number, number, number, number];
  };
};
export type EntityInstance_Transform = {
  transform: {
    position: [number, number, number];
    quaternion: [number, number, number, number];
  };
};

export const transformComponentFactory = createComponentFactory<{}, Entity_Transform, EntityInstance_Transform>()(
  () => {
    const q = new Quaternion();
    const e = new Euler();
    return {
      name: `transform`,
      addComponent: (
        entity,
        args: {
          position: [number, number, number];
          rotation?: [number, number, number];
        },
      ) => {
        const { rotation: r } = args;
        return {
          ...entity,
          transform: {
            position: args.position,
            quaternion: (r ? q.setFromEuler(e.set(r[0], r[1], r[2])) : q.identity()).toArray() as [
              number,
              number,
              number,
              number,
            ],
          },
        };
      },
      setup: (entity) => {
        return {
          ...entity,
          transform: {
            position: [...entity.desc.transform.position],
            quaternion: [...entity.desc.transform.quaternion],
          },
        };
      },
    };
  },
);
