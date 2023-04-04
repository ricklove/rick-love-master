import { wogger } from '../worker/wogger';

type AddComponentSimplified<TAddComponent, TComponentName extends string> = TAddComponent extends (
  entity: infer TEntityIn,
  args: infer TComponentArgs,
) => infer TEntityOut
  ? <TEntityFactoryIn extends { _entity: TEntityIn }>(
      this: TEntityFactoryIn,
      args: TComponentArgs,
    ) => Omit<TEntityFactoryIn, TComponentName> & { _entity: TEntityIn & TEntityOut }
  : never;

type EntityFactoryComponentsOfComponentFactories<
  TComponentFactories extends Record<string, { name: string; addComponent: unknown }>,
> = {
  [K in keyof TComponentFactories as TComponentFactories[K]['name']]: AddComponentSimplified<
    TComponentFactories[K][`addComponent`],
    TComponentFactories[K]['name']
  >;
};

// type EmptyTupleIfUndefined<T> = T extends undefined ? [] : T;
// type AppendTuple<TTuple extends undefined | unknown[], TNext> = [...EmptyTupleIfUndefined<TTuple>, TNext];
// type AppendChild<TEntity, TNext> = TEntity extends { children: infer TChildren }
//   ? TChildren extends unknown[]
//     ? AppendTuple<TChildren, TNext>
//     : [TNext]
//   : [TNext];

type AppendChildToEntityFactory<TEntityFactory, TEntityChild> = {
  [K in keyof TEntityFactory]: K extends `_entity`
    ? TEntityFactory[K] extends { children: unknown[] }
      ? Simplify<Omit<TEntityFactory[K], `children`> & { children: [...TEntityFactory[K][`children`], TEntityChild] }>
      : TEntityFactory[K] & { children: [TEntityChild] }
    : TEntityFactory[K];
};
type AppendChildrenToEntityFactory<TEntityFactory, TEntityChildren extends unknown[]> = {
  [K in keyof TEntityFactory]: K extends `_entity`
    ? TEntityFactory[K] extends { children: unknown[] }
      ? Simplify<
          Omit<TEntityFactory[K], `children`> & { children: [...TEntityFactory[K][`children`], ...TEntityChildren] }
        >
      : TEntityFactory[K] & { children: [...TEntityChildren] }
    : TEntityFactory[K];
};

type Simplify<T> = {} & {
  [K in keyof T]: T[K];
};

type EntityFactoryOfComponentFactories<
  TComponentFactories extends Record<string, { name: string; addComponent: unknown }>,
> = EntityFactoryComponentsOfComponentFactories<TComponentFactories> & {
  addChild: <TEntityFactory extends { _entity: unknown }, TEntityChild>(
    this: TEntityFactory,
    child: TEntityChild,
  ) => AppendChildToEntityFactory<TEntityFactory, TEntityChild>;
  addChildren: <TEntityFactory extends { _entity: unknown }, TEntityChildren extends unknown[]>(
    this: TEntityFactory,
    children: TEntityChildren,
  ) => AppendChildrenToEntityFactory<TEntityFactory, TEntityChildren>;
  build: <TEntityFactory extends { _entity: unknown }>(this: TEntityFactory) => TEntityFactory[`_entity`];
};

export const createEntityFactory = <
  TComponentFactories extends Record<string, { name: string; addComponent: unknown }>,
>(
  componentFactories: TComponentFactories,
) => {
  const createEntity = <TEntityName extends string>(name: TEntityName, enabled = true) => {
    const state = {
      entity: {
        name,
        enabled,
        components: [] as string[],
        children: [] as unknown[],
      },
    };
    const entityFactory = {
      addChild: (child: unknown) => {
        state.entity.children.push(child);
        return entityFactory;
      },
      addChildren: (children: unknown[]) => {
        state.entity.children.push(...children);
        wogger.log(`entityFactory addChildren: [${state.entity.name}]`, { entity: state.entity, children });
        return entityFactory;
      },
      build: () => {
        wogger.log(`entity build: [${state.entity.name}]`, { state });
        return state.entity;
      },
    };

    const entityFactoryWithComponents = entityFactory as Record<string, unknown>;

    Object.entries(componentFactories).forEach(([componentKey, componentFactory]) => {
      const componentName = componentFactory.name as keyof typeof entityFactoryWithComponents;
      entityFactoryWithComponents[componentName] = (args: unknown) => {
        const addComponent = componentFactory.addComponent as (
          e: typeof state.entity,
          args: unknown,
        ) => typeof state.entity;
        state.entity = addComponent(state.entity, args);
        state.entity.components.push(componentName);
        return entityFactory;
      };
    });

    // console.log(`entityFactory`, { entityFactory });
    return { state, entityFactory };
  };
  const f = {
    entity: <TEntityName extends string>(name: TEntityName, enabled = true) => {
      return createEntity(name, enabled).entityFactory;
    },
    copy: <TEntityName extends string>(entity: unknown, name: TEntityName, enabled = true) => {
      const { state, entityFactory } = createEntity(name, enabled);
      state.entity = entity as typeof state.entity;
      state.entity.name = name;
      state.entity.enabled = enabled;
      return entityFactory;
    },
  };

  return f as unknown as {
    entity: <TEntityName extends string>(
      name: TEntityName,
      enabled?: boolean,
    ) => {
      _entity: { name: TEntityName; enabled: boolean; components: string[] };
    } & EntityFactoryOfComponentFactories<TComponentFactories>;
    copy: <TEntityName extends string, TEntityIn>(
      entity: TEntityIn,
      name: TEntityName,
      enabled?: boolean,
    ) => {
      _entity: TEntityIn;
    } & EntityFactoryOfComponentFactories<TComponentFactories>;
  };
};
