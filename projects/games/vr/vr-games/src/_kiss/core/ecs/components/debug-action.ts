import { createComponentFactory } from '../ecs-component-factory';
import { EcsSceneState, EntityInstanceUntyped } from '../ecs-engine';

export type Entity_DebugAction = {
  debugAction: {
    callback: (entityInstance: EntityInstanceUntyped) => void;
  };
};

export type EntityInstance_DebugAction = {
  debugAction: {
    callback: () => void;
  };
};

export const debugActionComponentFactory = ({ sceneState }: { sceneState: EcsSceneState }) =>
  createComponentFactory<{}, Entity_DebugAction, {}, EntityInstance_DebugAction>()(() => {
    return {
      name: `debugAction`,
      addComponent: (entity, args: Entity_DebugAction[`debugAction`]) => {
        return {
          ...entity,
          debugAction: {
            ...args,
          },
        };
      },
      setup: (entityInstance) => {
        const getActualEntityInstance = () =>
          sceneState.findEntityInstanceById(entityInstance.instanceId)! as unknown as typeof entityInstance &
            EntityInstanceUntyped;

        return {
          ...entityInstance,
          debugAction: {
            callback: () => entityInstance.desc.debugAction.callback(getActualEntityInstance()),
          },
        };
      },
    };
  });
