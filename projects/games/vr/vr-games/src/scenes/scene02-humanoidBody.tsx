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
    const partsToMove = [`head`, `neck`, `upper-torso`, `lower-torso`, `upper-arm`, `upper-leg`]
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
      setTimeout(() => {
        partsToMove.forEach((p) => {
          p.entity.physics.api.position.subscribe((pos) => {
            p.entity.physics.api.applyImpulse([0, 1.0 / p.entity.physics.mass, -0.0001 / p.entity.physics.mass], pos);
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
  gravity: [0, -9.8, 0] as Triplet,
  // gravity: [0, 0, 0] as Triplet,
};
