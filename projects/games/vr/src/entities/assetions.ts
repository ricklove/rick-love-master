import { EntityGround, EntityKeepAboveGround } from './components/ground';
import { Vector3 } from './core';
import { Entity } from './entity';

const a01 = Entity.create(`a01`).build();
const a02 = EntityGround.addComponent(a01, {
  segmentCount: 16,
  segmentSize: 16,
  minHeight: 0,
  maxHeight: 5,
});
const a03 = EntityKeepAboveGround.addComponent(a02, {
  originHeight: 2,
});

// @ts-expect-error
const _1 = null && EntityGround.getHeightAtPoint(a03, 0, 0);

const a04 = {
  ...a03,
  transform: {
    position: null as unknown as Vector3,
  },
};

// now it works
const _2 = null && EntityGround.getHeightAtPoint(a04, 0, 0);

const ground = Entity.create(`ground`)
  .addComponent(EntityGround, {
    segmentCount: 16,
    segmentSize: 16,
    minHeight: 0,
    maxHeight: 5,
  })
  .build();

// @ts-expect-error
const _3 = null && EntityGround.getHeightAtPoint(ground, 0, 0);
