import { createComponentFactory } from '../../ecs-component-factory';

export type Entity_Actions = {
  actions: {};
};
export type EntityInstance_Actions = {
  actions: {
    actions: { [actionName: string]: () => void };
    // execute: (action: EntityAction) => void;
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
          // parseAction: (actionCode: string) => {
          //   const result = parseActionCode(actionCode);
          //   if (!result) {
          //     // throw new Error(`Invalid action code: ${actionCode}`);
          //     console.error(`Invalid action code: ${actionCode}`);
          //     return () => {
          //       // do nothing
          //     };
          //   }
          //   const { componentName, actionName, args } = result;
          //   const e = entityInstance as unknown as Record<string, Record<string, (...args: unknown[]) => void>>;
          //   const action = e[componentName][actionName];

          //   return () => {
          //     action(args);
          //   };
          // },
          // execute: (action: EntityAction) => {
          //   const { componentName, actionName, args } = action;
          //   const e = entityInstance as unknown as Record<string, Record<string, (...args: unknown[]) => void>>;
          //   const actionFn = e[componentName][actionName];

          //   wogger.log(`action`, { componentName, actionName, args, entityInstance });
          //   actionFn(args);
          // },
        },
      };
    },
  };
});
