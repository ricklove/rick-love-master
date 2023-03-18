import { Triplet } from '@react-three/cannon';
import { EntityAdjustToGround, EntityGround } from '../components/ground';
import { EntityGroundView } from '../components/ground-view';
import { EntityPhysicsViewSphere } from '../components/physics-view-sphere';
import { EntityPlayer } from '../components/player';
import { EntityPlayerPhysicsGloves } from '../components/player-physics-gloves';
import { Entity, SceneDefinition } from '../entity';

const player = Entity.create(`player`)
  .addComponent(EntityPlayer, {})
  .addComponent(EntityPlayerPhysicsGloves, {})
  // .addComponent(EntityHumanoidBody, { scale: 10, offset: new Vector3(0, 5, 0) })
  .addComponent(EntityAdjustToGround, {
    minGroundHeight: 0,
    maxGroundHeight: 0,
  })
  .extend((p) => {
    p.frameTrigger.subscribe(() => {
      if (!p.player.gestures) {
        return;
      }
      p.transform.position.add(p.player.gestures.body.moving._velocity.clone().multiplyScalar((0.5 * 1) / 60));
    });
  })
  .build();

const ball = Entity.create(`ball`)
  .addComponent(EntityPhysicsViewSphere, {
    mass: 1000,
    radius: 0.2,
    debugColorRgba: ((0xffffff * Math.random()) << 8) + 0xff,
    startPosition: [10, 5, -10],
  })
  .build();

const ball2 = Entity.create(`ball`)
  .addComponent(EntityPhysicsViewSphere, {
    mass: 1000,
    radius: 1,
    debugColorRgba: ((0xffffff * Math.random()) << 8) + 0xff,
    startPosition: [-10, 5, -10],
  })
  .build();

// dynamic scenes is not yet supported: it breaks batch physics
// setTimeout(() => {
//   player.children.add(ball2);
// }, 10 * 1000);

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
    maxHeight: 0.1,
    shape: `bowl`,
  })
  .addComponent(EntityGroundView, {})
  .build();

export const scene02: SceneDefinition = {
  debugPhysics: true,
  iterations: 15,
  rootEntities: [
    player,
    // humanoid,
    // humanoidOffset,
    // humanoidMovement,
    ground,
    ball,
    ball2,
    // mouseInput,
    // mouseRaycastSelector,
    // ball3,
    // ball4,
  ],
  gravity: [0, 1 * -9.8, 0] as Triplet,
  // gravity: [0, 0, 0] as Triplet,
};
