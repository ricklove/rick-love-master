import { EntityAdjustToGround, EntityGround } from './components/ground';
import { EntityGroundView } from './components/ground-view';
import { Entity } from './entity';

const a01 = Entity.create(`a01`).build();

// @ts-expect-error
const a02fail = EntityGround.addComponent(a01, {
  segmentCount: 16,
});

const a02fail2 = EntityGround.addComponent(a01, {
  segmentCount: 16,
  segmentSize: 16,
  minHeight: 0,
  maxHeight: 5,
  // @ts-expect-error
  extra: `shouldFail`,
});

const a02 = EntityGround.addComponent(a01, {
  segmentCount: 16,
  segmentSize: 16,
  minHeight: 0,
  maxHeight: 5,
});
const a03 = EntityAdjustToGround.addComponent(a02, {
  minGroundHeight: 2,
});

// @ts-expect-error
const _1 = null && EntityGround.getWorldHeightAtPoint(a03, 0, 0);

const a04 = EntityGroundView.addComponent(a03, {});
const a04b = EntityGroundView.addComponent(a01, {});

// now it works
const _2 = null && EntityGround.getWorldHeightAtPoint(a04, 0, 0);

// Entity factory
const ground = Entity.create(`ground`)
  .addComponent(EntityGround, {
    segmentCount: 16,
    segmentSize: 16,
    minHeight: 0,
    maxHeight: 5,
  })
  .build();

// @ts-expect-error
const _3 = null && EntityGround.getWorldHeightAtPoint(ground, 0, 0);

const groundView = Entity.create(`ground`).addComponent(EntityGroundView, {}).build();

const groundWithView = Entity.create(`ground`)
  .addComponent(EntityGround, {
    segmentCount: 16,
    segmentSize: 16,
    minHeight: 0,
    maxHeight: 5,
  })
  .addComponent(EntityGroundView, {})
  .build();

// now it works
const _4 = null && EntityGround.getWorldHeightAtPoint(groundWithView, 0, 0);
