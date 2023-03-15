import { Triplet } from '@react-three/cannon';
import { Vector3 } from 'three';
import { EntityGround } from '../entities/components/ground';
import { EntityGroundView } from '../entities/components/ground-view';
import { EntityHumanoidBody } from '../entities/components/humanoid-body/humanoid-body';
import { EntityHumanoidBodyMoverGroovy } from '../entities/components/humanoid-body/mover-groovy';
import { Entity, SceneDefinition } from '../entities/entity';

const humanoid = Entity.create(`humanoid`)
  .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(0, 0, 0) })
  .build();

const humanoidOffset = Entity.create(`humanoid`)
  .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(1, 0, 0) })
  .build();

const humanoidMovement = Entity.create(`humanoid`)
  .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(1, 0, 0) })
  .addComponent(EntityHumanoidBodyMoverGroovy, { direction: new Vector3(-1, 0, 1) })
  .build();

const rows = 4;
const cols = 4;
const humanoids = [...new Array(rows * cols)].map((_, i) =>
  Entity.create(`humanoid-${i}`)
    .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(i % rows, 0, Math.floor(i / rows)) })
    .addComponent(EntityHumanoidBodyMoverGroovy, { direction: new Vector3(-1, 0, 1), speed: 0.5 + 10 * Math.random() })
    .build(),
);

const ground = Entity.create(`ground`)
  .addComponent(EntityGround, {
    segmentCount: 16,
    segmentSize: 16,
    // Physics needs ground to have some height
    minHeight: -0.1,
    maxHeight: 0,
  })
  .addComponent(EntityGroundView, {})
  .build();

export const scene02: SceneDefinition = {
  debugPhysics: true,
  iterations: 15,
  rootEntities: [
    // humanoid,
    // humanoidOffset,
    // humanoidMovement,
    ...humanoids,
    ground,
  ],
  gravity: [0, 0.1 * -9.8, 0] as Triplet,
  // gravity: [0, 0, 0] as Triplet,
};
