import { Triplet } from '@react-three/cannon';
import { Vector3 } from 'three';
import { EntityGround } from '../entities/components/ground';
import { EntityGroundView } from '../entities/components/ground-view';
import { EntityHumanoidBody } from '../entities/components/humanoid-body/humanoid-body';
import { Entity, SceneDefinition } from '../entities/entity';

const humanoid = Entity.create(`humanoid`)
  .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(0, 0, 0) })
  .build();

const humanoidOffset = Entity.create(`humanoid`)
  .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(1, 0, 0) })
  .build();

const humanoidStaticChest = Entity.create(`humanoid`)
  .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(1, 0, 0) })
  .extend((e) => {
    // Make the check static
    const mainPart = e.humanoidBody.parts.find((x) => x.part === `upper-torso`)!;
    const partsToMove = [`upper-torso`]
      // const partsToMove = [`neck`, `upper-torso`, `lower-torso`]
      .flatMap((partName) => e.humanoidBody.parts.filter((x) => x.part === partName)!)
      .filter((x) => !!x);
    mainPart.entity.ready.subscribe((r) => {
      if (!r) {
        return;
      }
      // const api = mainPart.entity.physics.api;
      // api.applyForce([0, 100, -10], e.humanoidBody.upperTorso.transform.position.toArray());
      // setInterval(() => {
      //   api.applyImpulse([0, 10, -10], e.humanoidBody.upperTorso.transform.position.toArray());
      // }, 1000);
      const dir = new Vector3(-1, 0, 1);
      const dirAngle = new Vector3(0, 0, -1).angleTo(dir);
      const up = new Vector3(0, 1, 0);
      const vel = new Vector3();
      const rot = new Vector3();

      const step = 0;

      setTimeout(() => {
        partsToMove.forEach((p, iPart) => {
          // p.entity.physics.api.mass.set(100000);
          // p.entity.physics.api.mass.set(0);

          p.entity.physics.api.position.subscribe((pos) => {
            if (step % partsToMove.length !== iPart) {
              return;
            }

            // p.entity.physics.api.position.set(pos[0], 0.7, pos[2] - 0.01);
            const speed = 1;
            const cycleSpeed = 1;

            const yTarget = 0.9;
            const yDelta = yTarget * (0.8 + 0.2 * Math.sin(((1 / 0.3) * cycleSpeed * Date.now()) / 1000)) - pos[1];
            const yDeltaRatio = yDelta / yTarget;
            const yStrength = 1 - Math.pow(yDeltaRatio, 3);
            const yVel = 0.05 + yDelta * yStrength;
            const zVel = speed * -0.3 * (0.6 + 0.4 * Math.sin(((1 / 0.7) * cycleSpeed * Date.now()) / 1000));
            const angle = Math.PI * 0.25 * Math.sin(((1 / 3) * cycleSpeed * Date.now()) / 1000);
            vel.set(0, yVel, zVel).applyAxisAngle(up, dirAngle);
            rot.set(angle * 0.7, dirAngle + angle, angle * 0.3);

            p.entity.physics.api.velocity.set(vel.x, vel.y, vel.z);
            p.entity.physics.api.rotation.set(rot.x, rot.y, rot.z);
            p.entity.physics.api.angularVelocity.set(0, 0, 0);

            // p.entity.physics.api.applyImpulse([0, 1000, -10], [pos[0], pos[1] + 0.2, pos[2]]);
            // p.entity.physics.api.angularVelocity.set(0, 0, 0);
          });
        });
      }, 100);

      // mainPart.entity.physics.api.applyImpulse([0, 10, -1], mainPart.entity.transform.position.toArray());
      // }, 50);
    });
  })
  .build();

const rows = 4;
const cols = 4;
const humanoids = [...new Array(rows * cols)].map((_, i) =>
  Entity.create(`humanoid-${i}`)
    .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(i % rows, 0, Math.floor(i / rows)) })
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
    humanoidStaticChest,
    // ...humanoids,
    ground,
  ],
  gravity: [0, 0.1 * -9.8, 0] as Triplet,
  // gravity: [0, 0, 0] as Triplet,
};
