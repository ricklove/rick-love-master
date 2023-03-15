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

const MAX_DISTANCE = 10;
const rows = 7;
const cols = 2;
const humanoids = [...new Array(rows * cols)].map((_, i) =>
  Entity.create(`humanoid-${i}`)
    .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(i % cols, 0, Math.floor(i / cols)) })
    .addComponent(EntityHumanoidBodyMoverGroovy, { direction: new Vector3(-1, 0, 1), speed: 0.5 + 10 * Math.random() })
    .extend((e) => {
      const posFuture = new Vector3();
      const newDir = new Vector3();

      e.frameTrigger.subscribe(() => {
        const mainPart = e.humanoidBody.parts.find((x) => x.part === `upper-torso`);
        const pos = mainPart?.entity.transform.position;
        if (!pos) {
          return;
        }

        // Change random direction back towards center if outside zone
        const posLengthSq = pos.lengthSq();
        if (posLengthSq > MAX_DISTANCE * MAX_DISTANCE) {
          // only change direciton is current direction is not back toward center
          if (posFuture.copy(pos).add(e.humanoidBodyMoverGroovy.direction).lengthSq() >= posLengthSq) {
            newDir.randomDirection().setY(0).normalize();
            EntityHumanoidBodyMoverGroovy.setMovement(e, newDir, 0.5 + 10 * Math.random());
          }
        }
      });
    })
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

export const scene03: SceneDefinition = {
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
