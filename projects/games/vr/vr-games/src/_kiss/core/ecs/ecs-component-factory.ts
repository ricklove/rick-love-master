export type EcsComponentFactory<
  TName extends string,
  TEntityIn,
  TEntityOut,
  TComponentArgs,
  TEntityInstanceParent extends undefined | Record<string, unknown> = undefined,
  TEntityInstance extends TEntityIn & TEntityOut = TEntityIn & TEntityOut,
> = {
  name: TName;
  addComponent: <TEntityInActual extends TEntityIn>(
    entity: TEntityInActual,
    componentArgs: TComponentArgs,
  ) => TEntityInActual & TEntityOut;
  setup: <TEntityInstanceIn extends TEntityIn & TEntityOut>(
    entity: TEntityInstanceIn,
    parent: TEntityInstanceParent,
  ) => TEntityInstance;
  update?: (entity: TEntityInstance) => void;
  activate?: (entity: TEntityInstance) => void;
  deactivate?: (entity: TEntityInstance) => void;
};

export const createComponentFactory =
  <
    TEntityIn extends Record<string, unknown>,
    TEntityOut extends Record<string, unknown>,
    TEntityInstanceParent extends undefined | Record<string, unknown> = undefined,
    TEntityInstance extends TEntityIn & TEntityOut = TEntityIn & TEntityOut,
  >() =>
  <TName extends string, TComponentArgs>(
    name: TName,
    define: () => {
      addComponent: <TEntityInActual extends TEntityIn>(
        entity: TEntityInActual,
        componentArgs: TComponentArgs,
      ) => TEntityInActual & TEntityOut;
      setup: <TEntityInstanceIn extends TEntityIn & TEntityOut>(
        entity: TEntityInstanceIn,
        parent: TEntityInstanceParent,
      ) => TEntityInstance;
      update?: (entity: TEntityInstance) => void;
      activate?: (entity: TEntityInstance) => void;
      deactivate?: (entity: TEntityInstance) => void;
    },
  ): EcsComponentFactory<TName, TEntityIn, TEntityOut, TComponentArgs, TEntityInstanceParent, TEntityInstance> => {
    const { addComponent, setup, update, activate, deactivate } = define();
    return {
      name,
      addComponent,
      setup,
      update,
      activate,
      deactivate,
    };
  };
