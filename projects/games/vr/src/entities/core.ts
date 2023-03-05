import type { Vector3 as Vector3Three } from 'three';

export type Vector3 = Vector3Three;
export type EntityBase = {
  active: boolean;
  name: string;
  //position: Vector3;
};

export type Simplify<T> = {} & {
  [K in keyof T]: T[K];
};

function attach<
  TBefore extends { _type: unknown; attach: unknown },
  TAfter extends Simplify<Omit<TBefore, `addComponent` | `attach`> & TMethods & TBefore>,
  TMethods extends Record<string, unknown>,
>(this: TBefore, methods: TMethods): TAfter {
  const result = {
    ...this,
    ...methods,
    attach,
  };
  result.attach.bind(result);
  return result as TAfter;
}

export const defineComponent = <TEntityWithComponent extends { [K in string]: unknown }>() => {
  const _with = <
    TName extends string & keyof Omit<TEntityWithComponent, keyof EntityBase>,
    TArgs extends Record<string, unknown>,
  >(
    name: TName,
    createComponent: (args: TArgs) => TEntityWithComponent[TName],
  ) => {
    const addComponent = <TBefore extends EntityBase>(
      entity: TBefore,
      args: TArgs,
    ): Simplify<TBefore & Pick<TEntityWithComponent, TName>> => {
      const e = entity as TEntityWithComponent;
      if (e[name]) {
        return entity as TBefore & TEntityWithComponent;
      }
      e[name] = createComponent(args);
      return entity as TBefore & TEntityWithComponent;
    };

    const result = {
      _type: undefined as unknown as Pick<Simplify<TEntityWithComponent>, TName>,
      _argsType: undefined as unknown as TArgs,
      addComponent,
      attach,
      //   with: _with,
    };
    result.attach.bind(result);
    return result;
  };

  return { with: _with };
};

export const defineEntity = <TEntity>() => ({
  create: (name: string) => {
    const result = {
      _type: undefined as unknown as Simplify<TEntity>,
      entity: {
        name,
        active: true,
      },
      addComponent,
      build,
    };
    result.addComponent.bind(result);
    result.build.bind(result);
    return result;
  },
});

type EntityOfComponentFactory<T> = T extends {
  _type: infer U;
}
  ? U
  : never;

type ArgsOfComponentFactory<T> = T extends {
  _argsType: infer U;
}
  ? U
  : never;

function addComponent<
  TEntityFactory extends { entity: TBefore },
  TBefore extends EntityBase,
  TComponentFactory extends {
    addComponent: (entity: TBefore, args: ArgsOfComponentFactory<TComponentFactory>) => unknown;
  },
>(this: TEntityFactory, component: TComponentFactory, args: ArgsOfComponentFactory<TComponentFactory>) {
  const result = {
    entity: component.addComponent(this.entity, args) as Simplify<
      TBefore & EntityOfComponentFactory<TComponentFactory>
    >,
    addComponent,
    build,
  };
  result.addComponent.bind(result);
  result.build.bind(result);
  return result;
}

function build<TEntity extends EntityBase>(this: { entity: TEntity }) {
  return this.entity as Simplify<TEntity>;
}
