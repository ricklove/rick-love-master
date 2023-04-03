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
  build: <TEntityFactory extends { _entity: unknown }>(this: TEntityFactory) => TEntityFactory[`_entity`];
};

export const createEntityFactory = <
  TComponentFactories extends Record<string, { name: string; addComponent: unknown }>,
>(
  componentFactories: TComponentFactories,
) => {
  // TODO: Implement entity factory
  return null as unknown as {
    entity: <TEntityName extends string>(
      name: TEntityName,
      enabled?: boolean,
    ) => {
      _entity: { name: TEntityName; enabled: boolean; components: string[] };
    } & EntityFactoryOfComponentFactories<TComponentFactories>;
  };
};
