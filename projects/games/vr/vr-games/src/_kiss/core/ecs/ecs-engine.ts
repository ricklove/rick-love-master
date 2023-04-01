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
  enabled: boolean;
  children?: EntityDescUntyped[];
  [field: string]: unknown;
};
export type EntityInstanceUntyped = {
  enabled: boolean;
  _enabledActual: boolean;
  parent: EntityInstanceUntyped;
  children: EntityInstanceUntyped[];
  desc: EntityDescUntyped;
  [field: string]: unknown;
};

export const createSceneState = () => {
  const factories = [] as EcsComponentFactoryUntyped[];
  const instances = [] as EntityInstanceUntyped[];

  const createEntityInstance = (entity: EntityDescUntyped, parent: EntityInstanceUntyped) => {
    let instance: EntityInstanceUntyped = {
      enabled: entity.enabled,
      _enabledActual: false,
      parent,
      children: [],
      desc: entity,
    };
    for (const factory of factories) {
      if (!entity[factory.name]) {
        continue;
      }
      instance = factory.setup(instance, parent);
    }
    instances.push(instance);
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
      if (!entity[factory.name]) {
        continue;
      }
      factory.destroy!(entity);
    }
  };

  return {
    factories,
    instances,
    createEntityInstance,
    destroyEntityInstance,
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
      enabled: true,
      _enabledActual: true,
      parent: null as unknown as EntityInstanceUntyped,
      children: [],
      desc: sceneRoot,
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

      if (instance.enabled) {
        for (const factory of factoryActivates) {
          if (!instance.desc[factory.name]) {
            continue;
          }
          factory.activate!(instance);
        }
      } else {
        for (const factory of factoryDeactivates) {
          if (!instance.desc[factory.name]) {
            continue;
          }
          factory.deactivate!(instance);
        }
      }
    }

    // TODO: Add factory entity registration
    for (const factory of factoryUpdates) {
      for (const instance of instances) {
        if (!instance.desc[factory.name]) {
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
