type EntityId = number & { _type: EntityId };

type EntityCore = {
  id: EntityId;
  name: string;
  children: EntityCore[];
};
type Flat = {
  [key: string]: string | boolean | number;
};
type Shallow = {
  [key: string]: string | boolean | number | Flat;
};

export type EntityBase = EntityCore & Shallow;

type EntityFactoryBase = {};

type EntityFactoryBuilder<TEntityFactory extends EntityFactoryBase> = {
  extend: <TEntityFactoryOut extends EntityFactoryBase>(
    extender: (e: TEntityFactory) => TEntityFactoryOut,
  ) => EntityFactoryBuilder<TEntityFactoryOut>;
  build: () => TEntityFactory;
};

type EntityFactoryOutOfExtender<TExtender> = TExtender extends (e: infer UEnttiyFactoryIn) => infer UEntityFactoryOut
  ? UEntityFactoryOut
  : unknown;

export const buildEntityFactory = () => {
  const state = {
    entityFactory: {} as EntityFactoryBase,
  };
  const builder: EntityFactoryBuilder<EntityFactoryBase> = {
    extend: (extender) => {
      const outEntityFactory = extender(state.entityFactory);
      state.entityFactory = outEntityFactory;
      return builder as EntityFactoryBuilder<EntityFactoryOutOfExtender<typeof extender>>;
    },
    build: () => {
      return state.entityFactory;
    },
  };

  return builder;
};

// type EntityFactoryTransform<TIn, TOut> = {
//   [K in keyof TOut]: TOut[K] extends (...args: infer UArgs) => TIn
//     ? (...args: UArgs) => EntityFactoryTransform<TIn, TOut>
//     : TOut[K];
// };

// const ecs = buildEntityFactory()
//   .extend((f) => {
//     let nextId = 0;
//     const assemblyLine = {
//       entity: {},
//     };
//     const result = {
//       ...f,
//       assemblyLine,
//       entity: (name: string): typeof f => {
//         assemblyLine.entity = {
//           id: nextId++ as EntityId,
//           name,
//         };
//         return f;
//       },
//     };
//     return result as EntityFactoryTransform<typeof f, typeof result>;
//   })
//   .extend((f) => {
//     const result = {
//       ...f,
//       addChild: (entity: EntityBase): typeof f => {
//         f.assemblyLine.entity.children.push(entity);
//         return f;
//       },
//     };

//     return result as EntityFactoryTransform<typeof f, typeof result>;
//   })
//   .extend((f) => {
//     const result = {
//       ...f,
//       build: () => {
//         return f.assemblyLine.entity;
//       },
//     };

//     return result as EntityFactoryTransform<typeof f, typeof result>;
//   })
//   //   .extend((f) => {
//   //     return {
//   //       ...f,
//   //       addChild: <TEntityIn, TEntityOut>() => {},
//   //     };
//   //   })

//   .build();

// const e = ecs.entity(`test`).build();
