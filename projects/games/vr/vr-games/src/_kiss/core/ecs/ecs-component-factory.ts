export type EcsComponentFactory<
  TName extends string,
  TEntityIn,
  TEntityOut,
  TComponentArgs,
  TEntityInstance extends { desc: TEntityIn & TEntityOut } = { desc: TEntityIn & TEntityOut },
  TEntityInstanceParent extends undefined | Record<string, unknown> = undefined,
> = {
  name: TName;
  addComponent: <TEntityInActual extends TEntityIn>(
    entity: TEntityInActual,
    componentArgs: TComponentArgs,
  ) => TEntityInActual & TEntityOut;
  setup: <TEntityInstanceIn extends { desc: TEntityIn & TEntityOut }>(
    entity: TEntityInstanceIn,
    parent: TEntityInstanceParent,
  ) => TEntityInstanceIn & TEntityInstance;
  update?: (entity: TEntityInstance) => void;
  activate?: (entity: TEntityInstance) => void;
  deactivate?: (entity: TEntityInstance) => void;
};

export const createComponentFactory = <
  TEntityIn extends Record<string, unknown>,
  TEntityOut extends Record<string, unknown>,
  TEntityInstanceOnly extends Record<string, unknown> = {},
  TEntityInstanceParent extends undefined | Record<string, unknown> = undefined,
>() => {
  type TEntityInstance = TEntityInstanceOnly & { desc: TEntityIn & TEntityOut };
  return <TName extends string, TComponentArgs>(
    name: TName,
    define: () => Omit<
      EcsComponentFactory<TName, TEntityIn, TEntityOut, TComponentArgs, TEntityInstance, TEntityInstanceParent>,
      `name`
    >,
  ): EcsComponentFactory<TName, TEntityIn, TEntityOut, TComponentArgs, TEntityInstance, TEntityInstanceParent> => {
    const d = define();
    return {
      name,
      ...d,
    };
  };
};
