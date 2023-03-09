import { WorkerApi } from '@react-three/cannon';
import { Vector3 } from 'three';
import { defineComponent } from '../core';
import { EntitySelectable, SelectionState } from './selectable';

export type EntityForce = EntitySelectable & {
  transform: {
    position: Vector3;
  };
  physics: {
    api: WorkerApi;
  };
  force: {};
};
export const EntityForce = defineComponent<EntityForce>()
  .with(`force`, () => ({}))
  .attach({
    impulseUp: (entity: EntityForce, selectionFilter: SelectionState) => {
      if (entity.selectable.state !== selectionFilter) {
        return;
      }
      const api = entity.physics.api;
      api.applyImpulse([0, 10, 0], entity.transform.position.toArray());
    },
  });
