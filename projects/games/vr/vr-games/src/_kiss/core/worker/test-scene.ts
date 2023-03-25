import { ColliderDesc, RigidBody, RigidBodyDesc, World } from '@dimforge/rapier3d-compat';
import { Quaternion, Vector3 } from 'three';
import { postMessageTyped } from './message';
import { wogger } from './wogger';

export const createWorkerTestScene = () => {
  const w = {
    ground: { position: new Vector3(10.0, 0.1, 10.0) },
    boxes: Array.from({ length: 10 }, () => ({
      rigidBody: undefined as undefined | RigidBody,
      position: new Vector3(10 * (2 - Math.random()), 2 + 10 * Math.random(), 10 * (2 - Math.random())),
      scale: new Vector3(0.5 + 1.5 * Math.random(), 0.5 + 1.5 * Math.random(), 0.5 + 1.5 * Math.random()),
      quaternion: new Quaternion(Math.random(), Math.random(), Math.random(), Math.random()).normalize(),
    })),
  };

  // Use the RAPIER module here.
  const gravity = { x: 0.0, y: -9.81, z: 0.0 };
  const world = new World(gravity);

  // Create the ground
  const groundColliderDesc = ColliderDesc.cuboid(...w.ground.position.toArray());
  world.createCollider(groundColliderDesc);

  w.boxes.map((box) => {
    const boxRigidBodyDesc = RigidBodyDesc.dynamic()
      .setTranslation(box.position.x, box.position.y, box.position.z)
      .setRotation(box.quaternion);
    const boxRigidBody = world.createRigidBody(boxRigidBodyDesc);

    const boxColliderDesc = ColliderDesc.cuboid(box.scale.x * 0.5, box.scale.y * 0.5, box.scale.z * 0.5);
    world.createCollider(boxColliderDesc, boxRigidBody);

    box.rigidBody = boxRigidBody;
  });

  // TODO: Make efficient
  postMessageTyped({
    kind: `addObjects`,
    boxes: w.boxes.map((x, i) => ({
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
    wogger.log(`Game loop`);
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
      boxes: w.boxes.map((x, i) => ({
        key: String(i),
        position: x.position.toArray(),
        quaternion: x.quaternion.toArray() as [number, number, number, number],
        scale: x.scale.toArray(),
      })),
    });

    gameLoopTimerId = setTimeout(gameLoop, 16);
  };

  gameLoop();

  return {
    ...w,
    dispose: () => {
      clearTimeout(gameLoopTimerId);
    },
  };
};
