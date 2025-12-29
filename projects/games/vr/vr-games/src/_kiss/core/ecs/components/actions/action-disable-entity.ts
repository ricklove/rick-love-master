import { wogger } from '../../../worker/wogger';
import { createComponentFactory } from '../../ecs-component-factory';
import { EntityInstanceUntyped } from '../../ecs-engine';
import { Entity_Actions, EntityInstance_Actions } from './actions';

export type Entity_ActionDisableEntity = {
  actionDisableEntity: {
    actionName: string;
  };
};
export type EntityInstance_ActionDisableEntity = {
  actionDisableEntity: {
    _ready: boolean;
    disable: () => void;
  };
};

export const actionDisableEntityComponentFactory = createComponentFactory<
  Entity_Actions,
  Entity_ActionDisableEntity,
  EntityInstance_Actions,
  EntityInstance_ActionDisableEntity
>()(() => {
  return {
    name: `actionDisableEntity`,
    addComponent: (entity, args: Entity_ActionDisableEntity[`actionDisableEntity`]) => {
      return {
        ...entity,
        actionDisableEntity: {
          ...args,
        },
      };
    },
    setup: (entityInstance) => {
      return {
        ...entityInstance,
        actionDisableEntity: {
          _ready: false,
          disable: () => {
            // not ready yet
          },
        },
      };
    },
    update: (entityInstance) => {
      if (entityInstance.actionDisableEntity._ready) {
        return;
      }

      entityInstance.actionDisableEntity._ready = true;

      const eInstance = entityInstance as unknown as EntityInstanceUntyped;
      const disable = () => {
        wogger.log(`actionDisableEntity action`, { entityInstance });
        eInstance.enabled = false;
      };

      entityInstance.actions.actions[entityInstance.desc.actionDisableEntity.actionName] = disable;
      entityInstance.actionDisableEntity.disable = disable;
    },
  };
});
