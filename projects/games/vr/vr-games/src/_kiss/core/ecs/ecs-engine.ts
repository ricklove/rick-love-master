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
type EntityDescUntyped = {
  enabled: boolean;
  children?: EntityDescUntyped[];
  [field: string]: unknown;
};
type EntityInstanceUntyped = {
  enabled: boolean;
  _enabledActual: boolean;
  parent: EntityInstanceUntyped;
  children: EntityInstanceUntyped[];
  desc: EntityDescUntyped;
  [field: string]: unknown;
};

export const createScene = (sceneRoot: EntityDescUntyped, componentFactories: Record<string, unknown>) => {
  const factories = Object.values(componentFactories) as unknown as EcsComponentFactoryUntyped[];
  const instances = [] as EntityInstanceUntyped[];

  const createEntityInstance = (entity: EntityDescUntyped, parent: EntityInstanceUntyped): EntityInstanceUntyped => {
    let instance: EntityInstanceUntyped = {
      enabled: entity.enabled,
      _enabledActual: false,
      parent,
      children: [],
      desc: entity,
    };
    for (const factory of factories) {
      instance = factory.setup(instance, parent);
    }
    instances.push(instance);

    for (const child of entity.children ?? []) {
      instance.children.push(createEntityInstance(child, instance));
    }

    return instance;
  };

  const setup = () => {
    createEntityInstance(sceneRoot, null as unknown as EntityInstanceUntyped);
  };

  const factoryUpdates = factories.map((factory) => factory.update!).filter((x) => !!x);
  const factoryActivates = factories.map((factory) => factory.activate!).filter((x) => !!x);
  const factoryDeactivates = factories.map((factory) => factory.deactivate!).filter((x) => !!x);
  const factoryDestroys = factories.map((factory) => factory.destroy!).filter((x) => !!x);

  const destroy = () => {
    for (const instance of instances) {
      for (const destroy of factoryDestroys) {
        destroy(instance);
      }
    }
  };

  const update = () => {
    for (const instance of instances) {
      if (instance.enabled === instance._enabledActual) {
        continue;
      }

      if (instance.enabled) {
        for (const activate of factoryActivates) {
          activate(instance);
        }
      } else {
        for (const deactivate of factoryDeactivates) {
          deactivate(instance);
        }
      }
    }

    for (const update of factoryUpdates) {
      for (const instance of instances) {
        update(instance, instance.parent);
      }
    }
  };

  return {
    setup,
    update,
    destroy,
  };
};
