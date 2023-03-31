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

type EmptyTupleIfUndefined<T> = T extends undefined ? [] : T;
type AppendTuple<TTuple extends undefined | unknown[], TNext> = [...EmptyTupleIfUndefined<TTuple>, TNext];
type AppendChild<TEntity, TNext> = TEntity extends { children: infer TChildren }
  ? TChildren extends unknown[]
    ? { children: AppendTuple<TChildren, TNext> }
    : [TNext]
  : [TNext];

type EntityFactoryOfComponentFactories<
  TComponentFactories extends Record<string, { name: string; addComponent: unknown }>,
> = EntityFactoryComponentsOfComponentFactories<TComponentFactories> & {
  addChild: <TEntityFactory extends { _entity: unknown }, TEntityChild>(
    this: TEntityFactory,
    child: TEntityChild,
  ) => Omit<TEntityFactory, `_entity`> & {
    _entity: Omit<TEntityFactory[`_entity`], `children`> & {
      children: AppendChild<TEntityFactory[`_entity`], TEntityChild>;
    };
  };
  build: <TEntityFactory extends { _entity: unknown }>(this: TEntityFactory) => TEntityFactory[`_entity`];
};

export const createEntityFactory = <
  TComponentFactories extends Record<string, { name: string; addComponent: unknown }>,
>(
  componentFactories: TComponentFactories,
) => {
  // TODO: Implement
  return null as unknown as {
    entity: <TEntityName extends string>(
      name: TEntityName,
    ) => { _entity: { name: TEntityName } } & EntityFactoryOfComponentFactories<TComponentFactories>;
  };
};
