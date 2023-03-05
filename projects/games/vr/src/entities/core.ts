import type { Vector3 as Vector3Three } from 'three';

export type Vector3 = Vector3Three;
export type EntityBase = {
  active: boolean;
  name: string;
  key: string;
  //position: Vector3;
};

export type Simplify<T> = {} & {
  [K in keyof T]: T[K];
};

export type SimplifyFields<T> = {} & {
  [K in keyof T]: Simplify<T[K]>;
};

type UnionToIntersection<T> = (T extends unknown ? (k: T) => void : never) extends (k: infer I) => void ? I : never;
type UnionToPartial<T> = Partial<UnionToIntersection<T>>;
export type SimplifyEntity<TEntity> = SimplifyFields<EntityBase & Exclude<UnionToPartial<TEntity>, EntityBase>>;

function attach<
  TBefore extends { _componentType: unknown; attach: unknown },
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

export const defineComponent = <TEntityWithComponent extends Record<string, unknown>>() => {
  function _with<
    TName extends keyof TEntityWithComponent,
    TComponentFactoryBefore extends {
      _componentType: {};
      _argsType: {};
    },
    TArgs = {},
  >(this: TComponentFactoryBefore, name: TName, createComponent: (args: TArgs) => TEntityWithComponent[TName]) {
    type TAllComponents = Pick<TEntityWithComponent, TName> & TComponentFactoryBefore[`_componentType`];
    type TAllArgs = TArgs & TComponentFactoryBefore[`_argsType`];

    const inner = this as {
      addComponent?: <TBeforeInner, TArgsInner>(entity: TBeforeInner, args: TArgsInner) => unknown;
    };
    const addComponent = <TBefore extends EntityBase>(
      entity: TBefore,
      args: TAllArgs,
    ): SimplifyFields<TBefore & TAllComponents> => {
      const e = entity as unknown as TAllComponents;
      if (e[name]) {
        return entity as TBefore & TAllComponents;
      }
      e[name] = createComponent(args);

      // call inner
      if (inner.addComponent) {
        inner.addComponent(e, args);
      }

      return entity as TBefore & TAllComponents;
    };

    const result = {
      _componentType: undefined as unknown as Simplify<TAllComponents>,
      _argsType: undefined as unknown as Simplify<TAllArgs>,
      addComponent,
      attach,
      with: _with,
    };
    result.attach.bind(result);
    result.with.bind(result);
    return result;
  }

  const cf = {
    _componentType: undefined as unknown as {},
    _argsType: undefined as unknown as {},
    with: _with,
  };
  cf.with.bind(cf);
  return cf;
};

let nextEntityId = 0;
export const defineEntity = <TEntity>() => ({
  create: (name: string) => {
    const result = {
      _type: undefined as unknown as Simplify<TEntity>,
      entity: {
        name,
        active: true,
        key: `${nextEntityId++}`,
      },
      addComponent,
      build,
    };
    result.addComponent.bind(result);
    result.build.bind(result);
    return result;
  },
});

type ComponentOfComponentFactory<T> = T extends {
  _componentType: infer U;
}
  ? U
  : never;

type ArgsOfComponentFactory<T> = T extends {
  _argsType: infer U;
}
  ? U
  : never;

type EntityOfEntityFactory<T> = T extends {
  entity: infer U;
}
  ? U
  : never;

function addComponent<
  TEntityFactory extends { entity: EntityBase },
  TComponentFactory extends {
    addComponent: (entity: EntityBase, args: ArgsOfComponentFactory<TComponentFactory>) => unknown;
  },
>(this: TEntityFactory, component: TComponentFactory, args: ArgsOfComponentFactory<TComponentFactory>) {
  type TEntityBefore = EntityOfEntityFactory<TEntityFactory>;

  const result = {
    entity: component.addComponent(this.entity, args) as TEntityBefore & ComponentOfComponentFactory<TComponentFactory>,
    addComponent,
    build,
  };
  result.addComponent.bind(result);
  result.build.bind(result);
  return result as Omit<typeof result, `entity`> & {
    entity: SimplifyFields<TEntityBefore & ComponentOfComponentFactory<TComponentFactory>>;
  };
}

function build<TEntity extends EntityBase>(this: { entity: TEntity }) {
  return this.entity as Simplify<TEntity>;
}
