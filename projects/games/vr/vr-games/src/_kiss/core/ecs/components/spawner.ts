import { Quaternion } from 'three';
import { createComponentFactory } from '../ecs-component-factory';
import { EcsSceneState, EntityDescUntyped, EntityInstanceUntyped } from '../ecs-engine';
import { Entity_Transform, EntityInstance_Transform } from './transform';

export type Entity_Spawner = {
  spawner: {
    prefab: EntityDescUntyped & Entity_Transform;
    poolSize: number;
  };
};

export type EntityInstance_Spawner = {
  spawner: {
    spawn: (position: [number, number, number], quaternion?: [number, number, number, number]) => void;
    pool: (EntityInstanceUntyped & EntityInstance_Transform)[];
  };
};

export const spawnerComponentFactory = ({ sceneState }: { sceneState: EcsSceneState }) =>
  createComponentFactory<{}, Entity_Spawner, EntityInstance_Transform, EntityInstance_Spawner>()(() => {
    const q = new Quaternion();
    return {
      name: `spawner`,
      addComponent: (entity, args: Entity_Spawner[`spawner`]) => {
        return {
          ...entity,
          spawner: {
            ...args,
          },
        };
      },
      setup: (entityInstance) => {
        const entity = entityInstance.desc;

        const spawn = (position: [number, number, number], quaternion?: [number, number, number, number]) => {
          const inactiveChild = spawner.pool.find((x) => !x.enabled);
          if (inactiveChild) {
            inactiveChild.transform.position = [...position];
            if (quaternion) {
              inactiveChild.transform.quaternion = [...quaternion];
            }
            inactiveChild.enabled = true;
            return;
          }

          entity.spawner.prefab.transform.position = [...position];
          if (quaternion) {
            entity.spawner.prefab.transform.quaternion = [...quaternion];
          }
          const instance = sceneState.createEntityInstance(
            entity.spawner.prefab,
            entityInstance as unknown as EntityInstanceUntyped,
          );
          instance.enabled = true;
        };

        const spawner: EntityInstance_Spawner[`spawner`] = {
          spawn,
          pool: [],
        };

        entity.spawner.prefab.enabled = false;
        for (let i = 0; i < entity.spawner.poolSize; i++) {
          sceneState.createEntityInstance(entity.spawner.prefab, entityInstance as unknown as EntityInstanceUntyped);
        }

        return {
          ...entityInstance,
          spawner,
        };
      },
    };
  });
