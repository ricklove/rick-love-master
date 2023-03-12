import { Vector3 } from 'three';
import { defineComponent, EntityList, EntityWithChildren } from '../core';
import { EntitySelectable } from './selectable';
import { EntitySpawnable } from './spawnable';

export type EntitySpawner = EntityWithChildren &
  EntitySelectable & {
    spawner: {
      pool: EntitySpawnable[];
      createSpawnable: () => EntitySpawnable;
      batchSize: number;
    };
  };
export const EntitySpawner = defineComponent<EntitySpawner>()
  .with(`children`, () => new EntityList())
  .with(
    `spawner`,
    ({ createSpawnable, batchSize = 10 }: { createSpawnable: () => EntitySpawnable; batchSize?: number }) => ({
      pool: [],
      createSpawnable,
      batchSize,
    }),
  )
  .attach({
    spawn: (entity: EntitySpawner, position: Vector3) => {
      const spawnable = entity.spawner.pool.find((x) => !x.active);
      if (spawnable) {
        EntitySpawnable.spawn(spawnable, position);
        return;
      }

      const newSpawnables = [...new Array(entity.spawner.batchSize)].map((x) => entity.spawner.createSpawnable());
      newSpawnables.forEach((x) => x.active.next(false));
      entity.spawner.pool.push(...newSpawnables);
      entity.children.add(...newSpawnables);
      EntitySpawnable.spawn(newSpawnables[0], position);
    },
  });
