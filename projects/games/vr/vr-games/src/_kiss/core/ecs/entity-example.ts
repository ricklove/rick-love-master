import { buildEntity, EntityBase } from './entity';

// Testing
const _test = () => {
  const e = buildEntity(`test`)
    .extend((e) => {
      return {
        ...e,
        cool: true,
      };
    })
    .extend((e) => {
      return {
        ...e,
        other: true,
      };
    })
    .extend((e) => {
      return {
        ...e,
        stuff: true,
      };
    })
    .build();

  type EntityReadonlyPosition = EntityBase & {
    readonly position: { readonly x: number; readonly y: number; readonly z: number };
  };
  const follower = (args: { target: EntityReadonlyPosition; distance: number }) => (e: EntityReadonlyPosition) => {
    return {
      ...e,
      follow: {
        distance: args.distance,
        target: args.target.id,
      },
      //   update: () => {
      //     // not allowed
      //   },
    };
  };

  const eTarget = buildEntity(`target`)
    .extend((e) => {
      return {
        ...e,
        position: { x: 0, y: 0, z: 0 },
      };
    })
    .build();

  const eFollower = buildEntity(`follower`)
    .extend((e) => {
      return {
        ...e,
        position: { x: 0, y: 0, z: 0 },
      };
    })
    .extend(follower({ target: eTarget, distance: 2 }))
    .build();
};
