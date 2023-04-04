import { wogger } from '../../worker/wogger';
import { createComponentFactory } from '../ecs-component-factory';
import { Entity_Actions, EntityInstance_Actions } from './actions/actions';
import { Entity_RigidBody, EntityInstance_RigidBody } from './rigid-body';

export type Entity_CollisionAction = {
  collisionAction: {
    collisionTagFilter: string;
    action: string;
  };
};

export type EntityInstance_CollisionAction = {
  collisionAction: {};
};

export const collisionActionComponentFactory = createComponentFactory<
  Entity_RigidBody & Entity_Actions,
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
      entityInstance.rigidBody.onCollision = (other) => {
        if (other?.rigidBody.collisionTag !== entityInstance.desc.collisionAction.collisionTagFilter) {
          return;
        }

        // wogger.log(`collisionActionComponentFactory: onCollision START`, {
        //   entityInstance,
        //   other,
        //   actions: entityInstance.actions.actions,
        // });

        const action = entityInstance.actions.actions[entityInstance.desc.collisionAction.action];
        // wogger.log(`collisionActionComponentFactory: onCollision`, {
        //   entityInstance,
        //   other,
        //   actions: entityInstance.actions.actions,
        //   action,
        // });

        if (!action) {
          wogger.error(`collisionActionComponentFactory: action not found`, { entityInstance, other });
          return;
        }

        action();
      };

      return {
        ...entityInstance,
        collisionAction: {},
      };
    },
  };
});
