import { Triplet } from '@react-three/cannon';
import { Vector3 } from 'three';
import { EntityGround } from '../entities/components/ground';
import { EntityGroundView } from '../entities/components/ground-view';
import { EntityHumanoidBody } from '../entities/components/humanoid-body/humanoid-body';
import { EntityHumanoidBodyMoverGroovy } from '../entities/components/humanoid-body/mover-groovy';
import { EntityPhysicsViewSphere } from '../entities/components/physics-view-sphere';
import { EntityTextView } from '../entities/components/text-view';
import { Entity, SceneDefinition } from '../entities/entity';
import { logger } from '../utils/logger';

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

const MAX_DISTANCE = 5;
const rows = 7;
const cols = 2;
const humanoids = [...new Array(rows * cols)].map((_, i) =>
  Entity.create(`humanoid-${i}`)
    .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(i % cols, 0, Math.floor(i / cols)) })
    .addComponent(EntityHumanoidBodyMoverGroovy, { direction: new Vector3(-1, 0, -1), speed: 0.5 + 10 * Math.random() })
    .addComponent(EntityPhysicsViewSphere, {
      enablePhysics: false,
      radius: 0.01,
    })
    .addComponent(EntityTextView, {
      defaultText: `Happy Birthday Emily!`,
      offset: new Vector3(0, 0.5, 0),
      color: 0xffffff * Math.random(),
      fontSize: 0.2,
    })
    .extend((e) => {
      const posFuture = new Vector3();
      const newDir = new Vector3();

      const mainPart = e.humanoidBody.parts.find((x) => x.part === `upper-torso`);

      mainPart?.entity.frameTrigger.subscribe(() => {
        const pos = mainPart?.entity.transform.position;
        if (!pos) {
          return;
        }

        e.transform.position.copy(mainPart.entity.transform.position);

        // Change random direction back towards center if outside zone
        const posLengthSq = pos.lengthSq();
        // logger.log(`change direction ? `, { posLengthSq });

        if (posLengthSq > MAX_DISTANCE * MAX_DISTANCE) {
          // only change direciton is current direction is not back toward center
          const posFutureLengthSq = posFuture
            .copy(e.humanoidBodyMoverGroovy.direction)
            .normalize()
            .multiplyScalar(pos.length())
            .add(pos)
            .lengthSq();
          // logger.log(`change direction ? `, {
          //   c: posFutureLengthSq >= posLengthSq,
          //   posLength: Math.sqrt(posLengthSq),
          //   posFutureLength: Math.sqrt(posFutureLengthSq),
          // });

          if (posFutureLengthSq >= MAX_DISTANCE * MAX_DISTANCE) {
            newDir
              .randomDirection()
              .setY(0)
              .normalize()
              .multiplyScalar(MAX_DISTANCE * 0.5)
              .sub(pos)
              .setY(0)
              .normalize();
            const newSpeed = 0.5 + 10 * Math.random();
            EntityHumanoidBodyMoverGroovy.setMovement(e, newDir, newSpeed);
            logger.log(`change direction`, { newDir, newSpeed });
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
