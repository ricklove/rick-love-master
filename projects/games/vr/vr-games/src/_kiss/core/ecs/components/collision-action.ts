import { wogger } from '../../worker/wogger';
import { createComponentFactory } from '../ecs-component-factory';
import { EntityInstanceUntyped } from '../ecs-engine';
import { EntityActionCode, parseActionCode } from './actions/parser';
import { Entity_RigidBody, EntityInstance_RigidBody } from './rigid-body';

export type Entity_CollisionAction = {
  collisionAction: {
    collisionTagFilter: string;
    action: EntityActionCode;
  };
};

export type EntityInstance_CollisionAction = {
  collisionAction: {};
};

export const collisionActionComponentFactory = createComponentFactory<
  Entity_RigidBody,
  Entity_CollisionAction,
  EntityInstance_RigidBody,
  EntityInstance_CollisionAction
>()(() => {
  return {
    name: `collisionAction`,
    addComponent: (entity, args: Entity_CollisionAction[`collisionAction`]) => {
      return {
        ...entity,
        collisionAction: {
          ...args,
        },
      };
    },
    setup: (entityInstance) => {
      const action = parseActionCode(entityInstance.desc.collisionAction.action);

      if (!action) {
        console.error(
          `collisionActionComponentFactory: invalid action code: ${entityInstance.desc.collisionAction.action}`,
        );
        return {
          ...entityInstance,
          collisionAction: {},
        };
      }

      const sleepUntil = Date.now() + 1000;
      entityInstance.rigidBody.onCollision = (other, started) => {
        if (Date.now() < sleepUntil) {
          wogger.log(`collisionActionComponentFactory: onCollision SLEEP - ignoring collision`, { other, started });
          return;
        }

        wogger.log(`collisionActionComponentFactory: onCollision START`, { other, started });
        const hasCollisionTag =
          other?.rigidBody.collisionTag === entityInstance.desc.collisionAction.collisionTagFilter;

        wogger.log(`collisionActionComponentFactory: onCollision action`, {
          hasCollisionTag,
          entityInstance,
          other,
          started,
          action,
        });

        if (!hasCollisionTag) {
          return;
        }

        (entityInstance as unknown as EntityInstanceUntyped).execute(action);
      };

      return {
        ...entityInstance,
        collisionAction: {},
      };
    },
  };
});
