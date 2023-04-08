import { wogger } from '../worker/wogger';
import { EntityAction, findEntityInstanceByPath } from './components/actions/parser';
import { EcsComponentFactory } from './ecs-component-factory';

type EcsComponentFactoryUntyped = EcsComponentFactory<
  string,
  EntityDescUntyped,
  EntityDescUntyped,
  {},
  EntityInstanceUntyped,
  EntityInstanceUntyped,
  EntityInstanceUntyped
>;
export type EntityDescUntyped = {
  name: string;
  enabled: boolean;
  components: string[];
  children?: EntityDescUntyped[];
  [field: string]: unknown;
};
export type EntityInstanceUntyped = {
  instanceId: number;
  enabled: boolean;
  _enabledActual: boolean;
  components: Set<string>;
  execute: (action: EntityAction) => void;
  parent: EntityInstanceUntyped;
  children: EntityInstanceUntyped[];
  desc: EntityDescUntyped;
  [field: string]: unknown;
};

let nextInstanceId = 0;
export const createSceneState = () => {
  const factories = [] as EcsComponentFactoryUntyped[];
  const instances = [] as EntityInstanceUntyped[];
  const instanceMap = new Map<number, EntityInstanceUntyped>();

  const createEntityInstance = (entity: EntityDescUntyped, parent: EntityInstanceUntyped) => {
    let instance: EntityInstanceUntyped = {
      instanceId: nextInstanceId++,
      enabled: entity.enabled,
      _enabledActual: true,
      components: new Set(entity.components),
      parent,
      children: [],
      desc: entity,
      execute: (action) => {
        const { entityPath, componentName, actionName, args } = action;
        const foundInstance = findEntityInstanceByPath(instance, entityPath);

        const eInstance = foundInstance as unknown as Record<string, Record<string, (...args: unknown[]) => void>>;
        const actionFn = eInstance?.[componentName]?.[actionName];

        if (!actionFn) {
          wogger.error(`execute action not found`, { foundInstance, componentName, actionName, args, source: entity });
          return;
        }

        wogger.log(`execute action`, { foundInstance, componentName, actionName, args, source: entity });
        actionFn(...args);
      },
    };
    for (const factory of factories) {
      if (!instance.components.has(factory.name)) {
        continue;
      }
      instance = factory.setup(instance, parent);
    }
    instances.push(instance);
    instanceMap.set(instance.instanceId, instance);
    parent.children.push(instance);

    for (const child of entity.children ?? []) {
      createEntityInstance(child, instance);
    }

    return instance;
  };

  const factoryDestroys = factories.filter((factory) => factory.destroy);
  const destroyEntityInstance = (entity: EntityInstanceUntyped) => {
    for (const child of entity.children) {
      destroyEntityInstance(child);
    }

    for (const factory of factoryDestroys) {
      if (!entity.components.has(factory.name)) {
        continue;
      }
      factory.destroy!(entity);
    }

    const iChild = entity.parent.children.findIndex((e) => e.instanceId === entity.instanceId);
    entity.parent.children.splice(iChild, 1);
  };

  /** Find last entity with matching name */
  const findEntityInstance = (name: string) => {
    for (let i = instances.length - 1; i >= 0; i--) {
      if (instances[i].desc.name === name) {
        return instances[i];
      }
    }
    return undefined;
  };

  const findEntityInstanceById = (instanceId: number) => {
    return instanceMap.get(instanceId);
  };

  return {
    factories,
    instances,
    createEntityInstance,
    destroyEntityInstance,
    findEntityInstance,
    findEntityInstanceById,
  };
};

export type EcsSceneState = ReturnType<typeof createSceneState>;

export const createScene = (
  sceneRoot: EntityDescUntyped,
  componentFactories: Record<string, unknown>,
  { sceneState }: { sceneState: EcsSceneState },
) => {
  const { factories, instances } = sceneState;
  Object.values(componentFactories).forEach((factory) => {
    factories.push(factory as EcsComponentFactoryUntyped);
  });

  const setup = () => {
    sceneState.createEntityInstance(sceneRoot, {
      instanceId: nextInstanceId++,
      enabled: true,
      _enabledActual: true,
      components: new Set(),
      parent: null as unknown as EntityInstanceUntyped,
      children: [],
      desc: sceneRoot,
      execute: () => {
        // noop
      },
    });
  };

  const factoryUpdates = factories.filter((factory) => factory.update!);
  const factoryActivates = factories.filter((factory) => factory.activate!);
  const factoryDeactivates = factories.filter((factory) => factory.deactivate!);

  const destroy = () => {
    for (const instance of instances) {
      sceneState.destroyEntityInstance(instance);
    }
  };

  const update = () => {
    for (const instance of instances) {
      if (instance.enabled === instance._enabledActual) {
        continue;
      }

      instance._enabledActual = instance.enabled;

      // update children enabled (which will come after this in the loop)
      for (const child of instance.children) {
        child.enabled = instance.enabled;
      }

      if (instance.enabled) {
        for (const factory of factoryActivates) {
          if (!instance.components.has(factory.name)) {
            continue;
          }
          wogger.log(`entity activating: [${instance.desc.name} ${instance.instanceId}]`, { instance });
          factory.activate!(instance);
        }
      } else {
        for (const factory of factoryDeactivates) {
          if (!instance.components.has(factory.name)) {
            continue;
          }
          wogger.log(`entity deactivating: [${instance.desc.name} ${instance.instanceId}]`, { instance });
          factory.deactivate!(instance);
        }
      }
    }

    // TODO: Performance - Add factory entity registration
    for (const factory of factoryUpdates) {
      for (const instance of instances) {
        if (!instance.components.has(factory.name)) {
          continue;
        }
        factory.update!(instance, instance.parent);
      }
    }
  };

  return {
    setup,
    update,
    destroy,
  };
};
