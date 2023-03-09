import { WorkerApi } from '@react-three/cannon';
import { defineComponent } from '../core';

export type EntityForce = {
  physics: {
    api: WorkerApi;
  };
  force: {};
};
export const EntityForce = defineComponent<EntityForce>().with(`force`, () => ({}));
