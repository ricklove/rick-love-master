import { wogger } from '../../worker/wogger';
import { createComponentFactory } from '../ecs-component-factory';
import { EntityInstanceUntyped } from '../ecs-engine';
import { EntityInstance_Actions } from './actions/actions';
import { parseActionCode } from './actions/parser';
import { Entity_RigidBody, EntityInstance_RigidBody } from './rigid-body';

export type Entity_CollisionAction = {
  collisionAction: {
    collisionTagFilter: string;
    /** action code */
    action: string;
  };
};

export type EntityInstance_CollisionAction = {
  collisionAction: {};
};

export const collisionActionComponentFactory = createComponentFactory<
  Entity_RigidBody,
  Entity_CollisionAction,
  EntityInstance_RigidBody & EntityInstance_Actions,
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

      entityInstance.rigidBody.onCollision = (other) => {
        if (other?.rigidBody.collisionTag !== entityInstance.desc.collisionAction.collisionTagFilter) {
          return;
        }

        wogger.log(`collisionActionComponentFactory: onCollision action`, {
          entityInstance,
          other,
          actions: entityInstance.actions.actions,
          action,
        });
        (entityInstance as unknown as EntityInstanceUntyped).execute(action);
      };

      return {
        ...entityInstance,
        collisionAction: {},
      };
    },
  };
});
