export type EcsComponentFactory<
  TName extends string,
  TEntityIn,
  TEntityOut,
  TComponentArgs,
  TEntityInstanceIn extends Record<string, unknown>,
  TEntityInstanceOnly extends Record<string, unknown>,
  TEntityInstanceParent extends undefined | Record<string, unknown>,
> = {
  name: TName;
  addComponent: <TEntityInActual extends TEntityIn>(
    entity: TEntityInActual,
    componentArgs: TComponentArgs,
  ) => TEntityInActual & TEntityOut;
  setup: <TEntityInstanceInActual extends TEntityInstanceIn & { desc: TEntityIn & TEntityOut }>(
    entity: TEntityInstanceInActual,
    parent: TEntityInstanceParent,
  ) => TEntityInstanceInActual & TEntityInstanceIn & TEntityInstanceOnly & { desc: TEntityIn & TEntityOut };
  update?: (
    entity: TEntityInstanceIn & TEntityInstanceOnly & { desc: TEntityIn & TEntityOut },
    parent: TEntityInstanceParent,
  ) => void;
  activate?: (entity: TEntityInstanceIn & TEntityInstanceOnly & { desc: TEntityIn & TEntityOut }) => void;
  deactivate?: (entity: TEntityInstanceIn & TEntityInstanceOnly & { desc: TEntityIn & TEntityOut }) => void;
};

export const createComponentFactory = <
  TEntityIn extends Record<string, unknown>,
  TEntityOut extends Record<string, unknown>,
  TEntityInstanceIn extends Record<string, unknown> = {},
  TEntityInstanceOnly extends Record<string, unknown> = {},
  TEntityInstanceParent extends undefined | Record<string, unknown> = undefined,
>() => {
  type TEntityInstance = TEntityInstanceOnly & { desc: TEntityIn & TEntityOut };
  return <TName extends string, TComponentArgs>(
    define: () => EcsComponentFactory<
      TName,
      TEntityIn,
      TEntityOut,
      TComponentArgs,
      TEntityInstanceIn,
      TEntityInstance,
      TEntityInstanceParent
    >,
  ): EcsComponentFactory<
    TName,
    TEntityIn,
    TEntityOut,
    TComponentArgs,
    TEntityInstanceIn,
    TEntityInstance,
    TEntityInstanceParent
  > => {
    return define();
  };
};
