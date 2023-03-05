import React from 'react';
import { useFrame } from '@react-three/fiber';
import { EntityGravity } from './entities/components/gravity';
import { EntityAdjustToGround, EntityGround } from './entities/components/ground';
import { EntityGroundView } from './entities/components/ground-view';
import { EntitySphereView } from './entities/components/sphere-view';
import { Entity, World } from './entities/entity';

const ground = Entity.create(`ground`)
  .addComponent(EntityGround, {
    segmentCount: 16,
    segmentSize: 16,
    minHeight: 0,
    maxHeight: 5,
  })
  .addComponent(EntityGroundView, {})
  .build();

const ball = Entity.create(`ball`)
  .addComponent(EntitySphereView, {
    radius: 3,
    color: 0xff0055,
    startPosition: [-2, 10, -5],
  })
  .addComponent(EntityAdjustToGround, {
    minGroundHeight: 10,
  })
  .build();

const balls = [...new Array(100)].map(() => {
  const radius = 3 * Math.random();
  return Entity.create(`ball`)
    .addComponent(EntitySphereView, {
      radius,
      color: 0xffffff * Math.random(),
      startPosition: [50 - 100 * Math.random(), 100 * Math.random(), 50 - 100 * Math.random()],
    })
    .addComponent(EntityAdjustToGround, {
      minGroundHeight: radius,
    })
    .addComponent(EntityGravity, {})
    .build();
});

const world: World = {
  entities: [ground, ball, ...balls],
};

export const game = {
  world,
};

export const WorldContainer = ({}: {}) => {
  useFrame(() => {
    const ground = world.entities.find((x) => x.ground) as EntityGround;
    for (const e of world.entities) {
      if (e.gravity) {
        EntityGravity.fall(e as EntityGravity);
      }
      if (e.adjustToGround) {
        EntityAdjustToGround.adjustToGround(e as EntityAdjustToGround, ground);
      }
    }
  });

  return (
    <>
      {world.entities.map((x) => (
        <React.Fragment key={x.key}>{x.active && x.view && <x.view.Component entity={x} />}</React.Fragment>
      ))}
    </>
  );
};
