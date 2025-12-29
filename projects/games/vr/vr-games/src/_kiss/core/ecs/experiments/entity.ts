type EntityId = number & { _type: EntityId };

type EntityCore = {
  id: EntityId;
  name: string;
};
type Flat = {
  [key: string]: string | boolean | number;
};
type Shallow = {
  [key: string]: string | boolean | number | Flat;
};

export type EntityBase = EntityCore & Shallow;

type EntityFactory<TEntity extends EntityBase> = {
  extend: <TEntityOut extends EntityBase>(addComponent: (e: TEntity) => TEntityOut) => EntityFactory<TEntityOut>;
  build: () => TEntity;
};

// type EntityInOfAddComponent<TAddComponent> = TAddComponent extends (e: infer UEnttiyIn) => infer UEnttiyInOut
//   ? UEnttiyIn
//   : unknown;
type EntityOutOfAddComponent<TAddComponent> = TAddComponent extends (e: infer UEnttiyIn) => infer UEnttiyInOut
  ? UEnttiyInOut
  : unknown;

let nextId = 0;

/** Build a data-only entity
 *
 * Entities have no logic and a shallow object tree. They are serializable and should be composable.
 */
export const buildEntity = (name: string) => {
  const state = {
    entity: {
      id: nextId++,
      name,
    } as EntityBase,
  };
  const factory: EntityFactory<EntityBase> = {
    extend: (addComponent) => {
      const outEntity = addComponent(state.entity);
      state.entity = outEntity;
      return factory as EntityFactory<EntityOutOfAddComponent<typeof addComponent>>;
    },
    build: () => {
      return state.entity;
    },
  };

  return factory;
};
