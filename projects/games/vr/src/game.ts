import { EntityGround, EntityKeepAboveGround } from './entities/components/ground';
import { Entity, World } from './entities/entity';

// const groundP = Entity.create().addComponent(EntityGround, {
//   segmentCount: 16,
//   segmentSize: 16,
//   minHeight: 0,
//   maxHeight: 5,
// });

const ground = Entity.create(`ground`)
  .addComponent(EntityGround, {
    segmentCount: 16,
    segmentSize: 16,
    minHeight: 0,
    maxHeight: 5,
  })
  .build();

const ball = Entity.create(`ball`)
  .addComponent(EntityKeepAboveGround, {
    originHeight: 1,
  })
  .build();

const world: World = {
  entities: [ground, ball],
};

export const game = {
  world,
};
