import RAPIER, { ColliderDesc, RigidBody, RigidBodyDesc, World } from '@dimforge/rapier3d-compat';
import { Quaternion, Vector3 } from 'three';
import { postMessageTyped } from './message';

export const createWorkerTestScene = async () => {
  await RAPIER.init();

  const roomSize = 5;
  const roomHeight = 2;
  const boxSize = 0.2;
  const speed = 5;

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
    boxes: Array.from({ length: 100 }, () => ({
      rigidBody: undefined as undefined | RigidBody,
      position: new Vector3(
        roomSize * (0.5 * (1 - 2 * Math.random())),
        roomHeight * (0.25 + 0.5 * Math.random()),
        roomSize * (0.5 * (1 - 2 * Math.random())),
      ),
      scale: new Vector3(
        boxSize * (0.5 + 1.5 * Math.random()),
        boxSize * (0.5 + 1.5 * Math.random()),
        boxSize * (0.5 + 1.5 * Math.random()),
      ),
      quaternion: new Quaternion(Math.random(), Math.random(), Math.random(), Math.random()).normalize(),
    })),
  };

  // Use the RAPIER module here.
  const gravity = { x: 0.0, y: 0, z: 0.0 };
  const world = new World(gravity);
  world.timestep = 1.0 / 30;
  const timestep = world.timestep * 1000;

  // Create the ground
  Object.values(w.room).map((box) => {
    const roomColliderDesc = ColliderDesc.cuboid(
      box.scale.x * 0.5,
      box.scale.y * 0.5,
      box.scale.z * 0.5,
    ).setTranslation(box.position.x, box.position.y, box.position.z);
    world.createCollider(roomColliderDesc);
  });

  w.boxes.map((box) => {
    const boxRigidBodyDesc = RigidBodyDesc.dynamic()
      .setTranslation(box.position.x, box.position.y, box.position.z)
      .setRotation(box.quaternion)
      .setLinvel(speed * (0.5 - Math.random()), speed * (0.5 - Math.random()), speed * (0.5 - Math.random()))
      // Testing constant motion
      .setCanSleep(false);
    const boxRigidBody = world.createRigidBody(boxRigidBodyDesc);

    const boxColliderDesc = ColliderDesc.cuboid(box.scale.x * 0.5, box.scale.y * 0.5, box.scale.z * 0.5);
    world.createCollider(boxColliderDesc, boxRigidBody);

    box.rigidBody = boxRigidBody;
  });

  // TODO: Make efficient
  postMessageTyped({
    kind: `addObjects`,
    boxes: [...Object.values(w.room), ...w.boxes].map((x, i) => ({
      key: String(i),
      position: x.position.toArray(),
      quaternion: x.quaternion.toArray() as [number, number, number, number],
      scale: x.scale.toArray(),
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

    w.boxes.forEach((box) => {
      if (!box.rigidBody) {
        return;
      }
      const position = box.rigidBody.translation();
      box.position.set(position.x, position.y, position.z);
      const quaternion = box.rigidBody.rotation();
      box.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    });

    postMessageTyped({
      kind: `updateObjects`,
      boxes: [...Object.values(w.room), ...w.boxes].map((x, i) => ({
        key: String(i),
        position: x.position.toArray(),
        quaternion: x.quaternion.toArray() as [number, number, number, number],
        scale: x.scale.toArray(),
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
