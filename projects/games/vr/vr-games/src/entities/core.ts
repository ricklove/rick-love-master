import { BehaviorSubject } from 'rxjs';
import type { Vector3 as Vector3Three } from 'three';
import { ObservableList } from '../utils/ObservableArray';

export type Vector3 = Vector3Three;
export type EntityBase = {
  active: BehaviorSubject<boolean>;
  ready: BehaviorSubject<boolean>;
  name: string;
  key: string;
  children?: EntityList<EntityBase>;
  // transform: {
  //   position: Vector3;
  // };
  // physics?: {
  //   api: WorkerApi;
  //   mass: number;
  // };
  // view?: {
  //   Component?: (props: { entity: EntityBase }) => JSX.Element;
  //   isBatchComponent?: true;
  //   color?: number;
  // };
};
export type EntityWithChildren = EntityBase & {
  children: EntityList<EntityBase>;
};

export class EntityList<T extends EntityBase> extends ObservableList<T> {
  public constructor(entities: T[] = []) {
    super((x) => x.key, entities);
  }
}

export const calculateAllEntities = <T extends EntityBase>(world: T) => {
  const activeEntities = new EntityList<T>();
  activeEntities.frozen = true;
  const addEntity = (entity: T) => {
    entity.active.subscribe((a) => {
      if (a) {
        activeEntities.add(entity);
        if (!entity.children) {
          return;
        }

        entity.children.items.forEach((c) => {
          addEntity(c as T);
        });
        entity.children.added.subscribe((changes) => {
          changes.forEach((c) => addEntity(c as T));
        });
        entity.children.removed.subscribe((changes) => {
          changes.forEach((c) => removeEntity(c as T));
        });
      } else {
        removeEntity(entity);
      }
    });
  };
  const removeEntity = (entity: T) => {
    activeEntities.remove(entity);
    if (!entity.children) {
      return;
    }
    entity.children.items.forEach((c) => {
      removeEntity(c as T);
    });
  };
  addEntity(world);

  activeEntities.frozen = false;
  return activeEntities;
};

export type Simplify<T> = {} & {
  [K in keyof T]: T[K];
};

export type SimplifyFields<T> = {} & {
  [K in keyof T]: K extends `children` | `active` | `ready` ? T[K] : Simplify<T[K]>;
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
  >(
    this: TComponentFactoryBefore,
    name: TName,
    createComponent: (args: TArgs, e: TEntityWithComponent) => TEntityWithComponent[TName],
  ) {
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
      // call inner first
      if (inner.addComponent) {
        inner.addComponent(e, args);
      }

      // if (e[name]) {
      //   console.log(`Replacing component`, { name, e });
      //   // return entity as TBefore & TAllComponents;
      // }
      e[name] = createComponent(args, e as TEntityWithComponent);

      return entity as SimplifyFields<TBefore & TAllComponents>;
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

export const cloneComponent =
  <TEntityWithComponent extends Record<string, unknown>>() =>
  <TClone>(component: TClone) => {
    const t = defineComponent<TEntityWithComponent>();
    const cloned = { ...component } as TClone & typeof t;

    Object.values(cloned).forEach((f) => {
      if (typeof f === `function`) {
        f.bind(cloned);
      }
    });

    return cloned;
  };

let nextEntityId = 0;
export const defineEntity = <TEntity>() => ({
  create: (name: string) => {
    const result = {
      _type: undefined as unknown as Simplify<TEntity>,
      entity: {
        name,
        active: new BehaviorSubject(true),
        ready: new BehaviorSubject(false),
        key: `${nextEntityId++}`,
      } as EntityBase,
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
  type TEntityAfter = TEntityBefore & ComponentOfComponentFactory<TComponentFactory>;
  const entityAfter = component.addComponent(this.entity, args) as TEntityAfter;
  const result = {
    entity: entityAfter,
    addComponent,
    extend: (callback: (entity: TEntityAfter) => void) => {
      callback(entityAfter);
      return result;
    },
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