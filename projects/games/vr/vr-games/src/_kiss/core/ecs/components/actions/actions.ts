import { createComponentFactory } from '../../ecs-component-factory';

export type Entity_Actions = {
  actions: {};
};
export type EntityInstance_Actions = {
  actions: {
    actions: { [actionName: string]: () => void };
  };
};

export const actionsComponentFactory = createComponentFactory<{}, Entity_Actions, {}, EntityInstance_Actions>()(() => {
  return {
    name: `actions`,
    addComponent: (entity, args: Entity_Actions[`actions`]) => {
      return {
        ...entity,
        actions: {
          ...args,
        },
      };
    },
    setup: (entityInstance) => {
      return {
        ...entityInstance,
        actions: {
          actions: {},
        },
      };
    },
  };
});
