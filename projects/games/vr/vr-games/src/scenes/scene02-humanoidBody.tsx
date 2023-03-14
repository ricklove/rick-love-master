import { Triplet } from '@react-three/cannon';
import { Vector3 } from 'three';
import { EntityGround } from '../entities/components/ground';
import { EntityGroundView } from '../entities/components/ground-view';
import { EntityHumanoidBody } from '../entities/components/humanoid-body/humanoid-body';
import { Entity, SceneDefinition } from '../entities/entity';

const humanoid = Entity.create(`humanoid`)
  .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(0, 0, 0) })
  .build();
const ground = Entity.create(`ground`)
  .addComponent(EntityGround, {
    segmentCount: 16,
    segmentSize: 16,
    minHeight: 0,
    maxHeight: 0,
  })
  .addComponent(EntityGroundView, {})
  .build();

export const scene02: SceneDefinition = { rootEntities: [humanoid, ground], gravity: [0, -0.1, 0] as Triplet };
