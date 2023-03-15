import { Triplet } from '@react-three/cannon';
import { Vector3 } from 'three';
import { EntityGround } from '../entities/components/ground';
import { EntityGroundView } from '../entities/components/ground-view';
import { EntityHumanoidBody } from '../entities/components/humanoid-body/humanoid-body';
import { EntityHumanoidBodyMoverGroovy } from '../entities/components/humanoid-body/mover-groovy';
import { EntityPhysicsViewSphere } from '../entities/components/physics-view-sphere';
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
const rows = 4;
const cols = 4;
const humanoids = [...new Array(rows * cols)].map((_, i) =>
  Entity.create(`humanoid-${i}`)
    .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(i % rows, 0, Math.floor(i / rows)) })
    .addComponent(EntityHumanoidBodyMoverGroovy, {
      direction: new Vector3(-1, 0, 1),
      speed: 0.5 + 10 * Math.random(),
      yRatio: 2,
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
            // logger.log(`change direction`, { newDir, newSpeed });
          }
        }
      });
    })
    .build(),
);

const ball = Entity.create(`ball`)
  .addComponent(EntityPhysicsViewSphere, {
    mass: 1000,
    radius: 1,
    debugColorRgba: ((0xffffff * Math.random()) << 8) + 0xff,
    startPosition: [40, 5, -40],
  })
  .build();

const ball2 = Entity.create(`ball`)
  .addComponent(EntityPhysicsViewSphere, {
    mass: 1000,
    radius: 1,
    debugColorRgba: ((0xffffff * Math.random()) << 8) + 0xff,
    startPosition: [-60, 5, -60],
  })
  .build();

// const ball3 = Entity.create(`ball`)
//   .addComponent(EntityPhysicsViewSphere, {
//     mass: 1000,
//     radius: 1,
//     debugColorRgba: ((0xffffff * Math.random()) << 8) + 0xff,
//     startPosition: [-40, 5, 0],
//   })
//   .build();

// const ball4 = Entity.create(`ball`)
//   .addComponent(EntityPhysicsViewSphere, {
//     mass: 1000,
//     radius: 1,
//     debugColorRgba: ((0xffffff * Math.random()) << 8) + 0xff,
//     startPosition: [0, 5, -30],
//   })
//   .build();

const ground = Entity.create(`ground`)
  .addComponent(EntityGround, {
    segmentCount: 16,
    segmentSize: 16,
    // Physics needs ground to have some height
    minHeight: 0,
    maxHeight: 10,
    shape: `bowl`,
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
    ball,
    ball2,
    // ball3,
    // ball4,
  ],
  gravity: [0, 1 * -9.8, 0] as Triplet,
  // gravity: [0, 0, 0] as Triplet,
};
