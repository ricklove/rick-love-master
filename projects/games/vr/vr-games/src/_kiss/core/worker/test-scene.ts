import RAPIER, { ColliderDesc, RigidBody, RigidBodyDesc, World } from '@dimforge/rapier3d-compat';
import { Quaternion, Vector3 } from 'three';
import { handJointNames } from '../input-data';
import { postMessageTyped } from './message';

export const createWorkerTestScene = async () => {
  await RAPIER.init();

  const roomSize = 5;
  const roomHeight = 2;
  const boxSize = 0.3;
  const slotSize = 0.5;
  const cols = roomHeight / slotSize;
  const speed = 5;
  const jointCoint = handJointNames.length * 2;
  const boxCount = 1000;
  const fps = 120;

  const w = {
    room: {
      ground: {
        position: new Vector3(0, 0, 0),
        scale: new Vector3(roomSize, 0.1, roomSize),
        quaternion: new Quaternion(),
      },
      ceiling: {
        position: new Vector3(0, roomHeight, 0),
        scale: new Vector3(roomSize, 0.1, roomSize),
        quaternion: new Quaternion(),
      },
      wallW: {
        position: new Vector3(-roomSize * 0.5, roomHeight * 0.5, 0),
        scale: new Vector3(0.1, roomHeight, roomSize),
        quaternion: new Quaternion(),
      },
      wallE: {
        position: new Vector3(roomSize * 0.5, roomHeight * 0.5, 0),
        scale: new Vector3(0.1, roomHeight, roomSize),
        quaternion: new Quaternion(),
      },
      wallN: {
        position: new Vector3(0, roomHeight * 0.5, -roomSize * 0.5),
        scale: new Vector3(roomSize, roomHeight, 0.1),
        quaternion: new Quaternion(),
      },
      wallS: {
        position: new Vector3(0, roomHeight * 0.5, roomSize * 0.5),
        scale: new Vector3(roomSize, roomHeight, 0.1),
        quaternion: new Quaternion(),
      },
    },
    boxes: Array.from({ length: boxCount }, (_, i) => ({
      rigidBody: undefined as undefined | RigidBody,
      // position: new Vector3(
      //   slotSize * (0.5 * cols - (i % cols)),
      //   slotSize * (1 + (Math.floor(i / cols) % cols)),
      //   -slotSize * (1 + Math.floor(i / cols / cols)),
      // ),
      position: new Vector3(
        roomSize * (0.5 * (1 - 2 * Math.random())),
        roomHeight * (0.25 + 0.5 * Math.random()),
        roomSize * (0.5 * (1 - 2 * Math.random())),
      ),
      scale: new Vector3(
        boxSize * (0.1 + 0.75 * Math.random()),
        boxSize * (0.1 + 0.75 * Math.random()),
        boxSize * (0.1 + 0.75 * Math.random()),
      ),
      quaternion: new Quaternion(Math.random(), Math.random(), Math.random(), Math.random()).normalize(),
    })),
    joints: Array.from({ length: jointCoint }, () => ({
      rigidBody: undefined as undefined | RigidBody,
      position: new Vector3(0, -10, 0),
      radius: 0.01,
    })),
  };

  // Use the RAPIER module here.
  const world = new World({ x: 0.0, y: -9.8, z: 0.0 });
  world.timestep = 1.0 / fps;
  const timestep = world.timestep * 1000;

  // Create the ground
  Object.values(w.room).map((o) => {
    const colliderDesc = ColliderDesc.cuboid(o.scale.x * 0.5, o.scale.y * 0.5, o.scale.z * 0.5).setTranslation(
      o.position.x,
      o.position.y,
      o.position.z,
    );
    world.createCollider(colliderDesc);
  });

  w.joints.map((o) => {
    const rigidBodyDesc = RigidBodyDesc.kinematicPositionBased().setTranslation(
      o.position.x,
      o.position.y,
      o.position.z,
    );
    const rigidBody = world.createRigidBody(rigidBodyDesc);

    const colliderDesc = ColliderDesc.ball(o.radius);
    world.createCollider(colliderDesc, rigidBody);

    o.rigidBody = rigidBody;
  });

  w.boxes.map((o) => {
    const rigidBodyDesc = RigidBodyDesc.dynamic()
      .setTranslation(o.position.x, o.position.y, o.position.z)
      .setRotation(o.quaternion)
      .setLinvel(speed * (0.5 - Math.random()), speed * (0.5 - Math.random()), speed * (0.5 - Math.random()));
    // Testing constant motion
    // .setCanSleep(false);
    const rigidBody = world.createRigidBody(rigidBodyDesc);

    const colliderDesc = ColliderDesc.cuboid(o.scale.x * 0.5, o.scale.y * 0.5, o.scale.z * 0.5);
    world.createCollider(colliderDesc, rigidBody);

    o.rigidBody = rigidBody;
  });

  // TODO: Make efficient
  postMessageTyped({
    kind: `addObjects`,
    boxes: [...Object.values(w.room), ...w.boxes].map((x, i) => ({
      key: `box-${i}`,
      position: x.position.toArray(),
      quaternion: x.quaternion.toArray() as [number, number, number, number],
      scale: x.scale.toArray(),
    })),
    spheres: [...w.joints].map((x, i) => ({
      key: `sphere-${i}`,
      position: x.position.toArray(),
      radius: x.radius,
    })),
  });

  // TODO: Game loop. Replace by your own game loop system.
  let gameLoopTimerId = setTimeout(() => {
    //empty
  }, 0);
  const gameLoop = () => {
    // wogger.log(`Game loop`);
    // Step the simulation forward.
    world.step();

    // Update the box positions
    // const position = rigidBody.translation();
    // console.log(`Rigid-body position: `, position.x, position.y, position.z);

    w.boxes.forEach((o) => {
      if (!o.rigidBody) {
        return;
      }
      const position = o.rigidBody.translation();
      o.position.set(position.x, position.y, position.z);
      const quaternion = o.rigidBody.rotation();
      o.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);

      // // apply random force to wake up
      // if (o.rigidBody.isSleeping()) {
      //   o.rigidBody.setTranslation(
      //     {
      //       x: roomSize * (0.5 * (1 - 2 * Math.random())),
      //       y: roomHeight * (0.25 + 0.5 * Math.random()),
      //       z: roomSize * (0.5 * (1 - 2 * Math.random())),
      //     },
      //     true,
      //   );
      //   o.rigidBody.setLinvel(
      //     {
      //       x: speed * (0.5 - Math.random()),
      //       y: speed * (0.5 - Math.random()),
      //       z: speed * (0.5 - Math.random()),
      //     },
      //     true,
      //   );
      // }
    });

    // Copy joint positions to rigid bodies
    w.joints.forEach((o, i) => {
      o.rigidBody?.setNextKinematicTranslation(o.position);
    });

    // w.joints.forEach((o) => {
    //   if (!o.rigidBody) {
    //     return;
    //   }
    //   const position = o.rigidBody.translation();
    //   o.position.set(position.x, position.y, position.z);
    // });

    postMessageTyped({
      kind: `updateObjects`,
      boxes: [...Object.values(w.room), ...w.boxes].map((x, i) => ({
        key: `box-${i}`,
        position: x.position.toArray(),
        quaternion: x.quaternion.toArray() as [number, number, number, number],
        scale: x.scale.toArray(),
      })),
      spheres: [...w.joints].map((x, i) => ({
        key: `sphere-${i}`,
        position: x.position.toArray(),
        radius: x.radius,
      })),
    });

    gameLoopTimerId = setTimeout(gameLoop, timestep);
  };

  gameLoop();

  return {
    ...w,
    dispose: () => {
      clearTimeout(gameLoopTimerId);
    },
  };
};
