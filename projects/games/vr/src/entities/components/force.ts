import { WorkerApi } from '@react-three/cannon';
import { Observable } from 'rxjs';
import { Vector3 } from 'three';
import { defineComponent } from '../core';
import { EntitySelectable } from './selectable';

export type EntityForce = EntitySelectable & {
  transform: {
    position: Vector3;
  };
  physics: {
    api: WorkerApi;
  };
  force: {
    isActiveEffect: boolean[];
    activeEffects: ((entity: EntityForce, api: WorkerApi) => void)[];
  };
};
export const EntityForce = defineComponent<EntityForce>()
  .with(`force`, () => ({
    isActiveEffect: [],
    activeEffects: [],
  }))
  .attach({
    register: (
      entity: EntityForce,
      condition: Observable<boolean>,
      effect: (entity: EntityForce, api: WorkerApi) => void,
    ) => {
      const { activeEffects, isActiveEffect } = entity.force;
      const id = isActiveEffect.length;
      isActiveEffect[id] = false;

      condition.subscribe((active) => {
        const hasEffect = isActiveEffect[id];
        if (active && !hasEffect) {
          // logger.log(`force effect active`, { id, key: entity.key });
          activeEffects.push(effect);
          isActiveEffect[id] = true;
        }
        if (!active && hasEffect) {
          // logger.log(`force effect NOT active`, { id, key: entity.key });
          activeEffects.splice(activeEffects.indexOf(effect), 1);
          isActiveEffect[id] = false;
        }
      });
    },
    applyForces: (entity: EntityForce) => {
      const { api } = entity.physics;
      const { activeEffects } = entity.force;
      activeEffects.forEach((x) => x(entity, api));
    },
  });

type EntityForceEffect<TName extends string, TArgs extends Record<string, unknown>> = EntityForce & {
  [key in TName]: TArgs;
};
const defineForce = <TName extends string, TArgs extends Record<string, unknown>>(
  name: TName,
  effect: (args: TArgs) => (entity: EntityForce, api: WorkerApi) => void,
) => {
  return defineComponent<EntityForceEffect<TName, TArgs>>().with(
    name,
    ({ condition, args }: { condition: (e: EntityForce) => Observable<boolean>; args: TArgs }, entity) => {
      EntityForce.register(entity as EntityForce, condition(entity as EntityForce), (e, api) => effect(args)(e, api));
      return args as EntityForceEffect<TName, TArgs>[TName];
    },
  );
};

export const EntityForceImpulseUp = defineForce(
  `forceImpuseUp`,
  ({ strength }: { strength: number }) =>
    (entity, api) => {
      api.applyImpulse([0, strength, 0], entity.transform.position.toArray());
    },
);

// export const EntityForceImpulseUp = defineComponent<EntityForce & { forceImpuseUp: { strength: number } }>().with(
//   `forceImpuseUp`,
//   ({ condition, args }: { condition: Observable<void>; args: { strength: number } }, entity) => {
//     EntityForce.register(entity as EntityForce, condition, (e, api) =>
//       api.applyImpulse([0, args.strength, 0], e.transform.position.toArray()),
//     );
//     return { ...args };
//   },
// );