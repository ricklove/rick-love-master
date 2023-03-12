import { Vector3 } from 'three';
import { defineComponent } from '../core';
import { EntitySelectable } from './selectable';

export type EntitySpawnable = EntitySelectable & {
  spawnable: {
    doSpawn: (entity: EntitySpawnable, position: Vector3) => void;
  };
};
export const EntitySpawnable = defineComponent<EntitySpawnable>()
  .with(`spawnable`, ({ doSpawn }: { doSpawn: (entity: EntitySpawnable, position: Vector3) => void }) => ({
    doSpawn,
  }))
  .attach({
    spawn: (entity: EntitySpawnable, position: Vector3) => {
      entity.spawnable.doSpawn(entity, position);
      entity.active.next(true);
    },
  });
