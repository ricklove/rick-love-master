import RAPIER, { ColliderDesc, EventQueue, RigidBodyDesc, World } from '@dimforge/rapier3d-compat';
import { Quaternion, Vector3 } from 'three';
import { handJointNames } from '../input/hand-joints';
import { postMessageFromWorker } from '../messages/message';
import { MessageBufferPool } from '../messages/message-buffer';
import { postMessageSceneObjectTransforms } from '../messages/messages/message-scene-object-transforms';
import { GameEngine, GameWorkerEngine } from './types';
import { wogger } from './wogger';

export const createWorkerEngine = async (
  messageBufferPool: MessageBufferPool,
  gravity: RAPIER.Vector = { x: 0.0, y: -9.8, z: 0.0 },
): Promise<GameWorkerEngine> => {
  await RAPIER.init();

  const maxFps = 144;
  const minFpsViaSlowMotion = 72;
  const ADJUST_TIME_STEP = true;

  const world = new World(gravity);
  world.timestep = 1.0 / minFpsViaSlowMotion;
  wogger.log(`world iterations`, {
    maxVelocityIterations: world.maxVelocityIterations,
    maxStabilizationIterations: world.maxStabilizationIterations,
    maxVelocityFrictionIterations: world.maxVelocityFrictionIterations,
  });

  let nextId = 0;
  const registeredEntities = [] as ReturnType<GameWorkerEngine[`createEntity`]>[];
  const createEntity: GameWorkerEngine[`createEntity`] = (data) => {
    // wogger.log(`createEntity`, { data });

    const position = data.position ?? new Vector3();
    const quaternion = data.quaternion ?? new Quaternion();
    const scale = data.scale
      ? data.scale
      : data.radius
      ? new Vector3(data.radius, data.radius, data.radius)
      : new Vector3(1, 1, 1);
    const kind = data.kind ?? `dynamic`;

    let rigidBodyDesc = (
      kind === `fixed`
        ? RigidBodyDesc.fixed()
        : kind === `kinematicPositionBased`
        ? RigidBodyDesc.kinematicPositionBased()
        : kind === `kinematicVelocityBased`
        ? RigidBodyDesc.kinematicVelocityBased()
        : RigidBodyDesc.dynamic()
    )
      .setTranslation(position.x, position.y, position.z)
      .setRotation(quaternion);

    if (data.gravityScale != null) {
      rigidBodyDesc = rigidBodyDesc.setGravityScale(data.gravityScale);
    }

    const rigidBody = world.createRigidBody(rigidBodyDesc);

    if (data.shape === `sphere`) {
      let colliderDesc = ColliderDesc.ball(scale.x);
      if (data.restitution) {
        colliderDesc = colliderDesc.setRestitution(data.restitution);
      }
      if (data.sensor) {
        colliderDesc = colliderDesc.setSensor(true);
      }
      world.createCollider(colliderDesc, rigidBody);
    }
    if (data.shape === `box`) {
      let colliderDesc = ColliderDesc.cuboid(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5);
      if (data.restitution) {
        colliderDesc = colliderDesc.setRestitution(data.restitution);
      }
      if (data.sensor) {
        colliderDesc = colliderDesc.setSensor(true);
      }
      world.createCollider(colliderDesc, rigidBody);
    }

    const id = nextId++;
    const entity = {
      type: data.type,
      startData: data,
      userData: data.userData as NonNullable<typeof data[`userData`]>,
      shape: data.shape,
      active: data.active ?? true,
      id,
      rigidBody,

      engine: {
        id,
        kind,
        position: data.position.clone(),
        quaternion: quaternion.clone(),
        scale: scale.clone(),
        hasSentAddMessage: false,
        hasMoved: true,
      },
    };
    registeredEntities.push(entity);

    // wogger.log(`createdEntity`, { entity, data, registeredEntities });
    return entity;
  };

  const jointCount = handJointNames.length * 2;
  const engineEntities = {
    handJoints: [...new Array(jointCount)]
      .map(() => ({
        type: `handJoint` as const,
        kind: `kinematicPositionBased` as const,
        shape: `sphere` as const,
        position: new Vector3(0, 1, -2),
        radius: 0.02,
        // radius: 0.01,
      }))
      .map(createEntity),
  };

  const sendNewEntityMessage = () => {
    const newEntities = registeredEntities.filter((x) => !x.engine.hasSentAddMessage);
    if (!newEntities.length) {
      return;
    }
    newEntities.forEach((x) => {
      x.engine.hasSentAddMessage = true;
    });

    wogger.log(`sendNewEntityMessage`, { newEntities });

    // TODO: Make efficient
    postMessageFromWorker({
      kind: `addObjects`,
      boxes: newEntities
        .filter((x) => x.shape === `box`)
        .map((x) => ({
          id: x.id,
          position: x.engine.position.toArray(),
          quaternion: x.engine.quaternion.toArray() as [number, number, number, number],
          scale: x.engine.scale.toArray(),
        })),
      spheres: newEntities
        .filter((x) => x.shape === `sphere`)
        .map((x, i) => ({
          id: x.id,
          position: x.engine.position.toArray(),
          radius: x.engine.scale.x,
        })),
    });
  };

  // game loop
  const state = {
    gameEngine: undefined as undefined | GameEngine,
  };

  let gameLoopTimerId = setTimeout(() => {
    //empty
  }, 0);

  let frameCount = 0;
  let lastTime = performance.now();
  let runningDeltaTime = 1000 / minFpsViaSlowMotion;
  const minDeltaTime = 1000 / maxFps;
  const maxDeltaTime = 1000 / minFpsViaSlowMotion;

  const gameEngineLoop = () => {
    const time = performance.now();
    const deltaTime = time - lastTime;
    lastTime = time;

    runningDeltaTime = runningDeltaTime * 0.9 + deltaTime * 0.1;
    const constrainedDeltaTime = Math.max(minDeltaTime, Math.min(maxDeltaTime, runningDeltaTime));

    const timestepActual = 0.001 * constrainedDeltaTime;
    const timestepDiff = timestepActual - world.timestep;
    const timestepDiffRatio = timestepDiff / timestepActual;
    if (ADJUST_TIME_STEP && Math.abs(timestepDiffRatio) > 0.1) {
      wogger.log(`Timestep changed`, {
        timestepDiffRatio,
        timestepDiff,
        timestepActual,
        worldTimestep: world.timestep,
      });
      world.timestep = timestepActual;
    }
    const fps = 1000 / runningDeltaTime;
    const fpsConstrained = 1000 / constrainedDeltaTime;
    const timeWarpRatio = constrainedDeltaTime / runningDeltaTime;

    // wogger.log(`Game loop`);
    // Step the simulation forward.
    const eventQueue = new EventQueue(true);
    world.step(eventQueue);

    if (state.gameEngine) {
      state.gameEngine.update(
        deltaTime * 0.001,
        {
          // TODO: Fix this
          origin: {
            position: new Vector3(0, 0, 0),
          },
          camera: {
            position: new Vector3(0, 0, 0),
            quaternion: new Quaternion(),
          },
          hands: {
            left: {
              side: `left` as const,
              position: engineEntities.handJoints[0].engine.position,
              quaternion: engineEntities.handJoints[0].engine.quaternion,
            },
            right: {
              side: `right` as const,
              position: engineEntities.handJoints[0 + handJointNames.length].engine.position,
              quaternion: engineEntities.handJoints[0 + handJointNames.length].engine.quaternion,
            },
          },
        },
        eventQueue,
      );
    }

    // Update the entity positions
    registeredEntities.forEach((o) => {
      if (!o.rigidBody) {
        return;
      }
      if (!o.active) {
        return;
      }
      if (o.engine.kind !== `dynamic`) {
        return;
      }

      const position = o.rigidBody.translation();
      const oPosition = o.engine.position;
      const xPositionDelta = position.x - oPosition.x;
      const yPositionDelta = position.y - oPosition.y;
      const zPositionDelta = position.z - oPosition.z;
      const positionDeltaSq =
        xPositionDelta * xPositionDelta + yPositionDelta * yPositionDelta + zPositionDelta * zPositionDelta;
      oPosition.set(position.x, position.y, position.z);

      const quaternion = o.rigidBody.rotation();
      const oQuaternion = o.engine.quaternion;
      oQuaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
      const xQuaternionDelta = quaternion.x - oQuaternion.x;
      const yQuaternionDelta = quaternion.y - oQuaternion.y;
      const zQuaternionDelta = quaternion.z - oQuaternion.z;
      const wQuaternionDelta = quaternion.w - oQuaternion.w;
      const quaternionDeltaSq =
        xQuaternionDelta * xQuaternionDelta +
        yQuaternionDelta * yQuaternionDelta +
        zQuaternionDelta * zQuaternionDelta +
        wQuaternionDelta * wQuaternionDelta;

      o.engine.hasMoved = positionDeltaSq > 0.00001 || quaternionDeltaSq > 0.00001;
      // TEMP: Disable hasMoved
      o.engine.hasMoved = true;
    });

    // Copy joint positions to rigid bodies
    engineEntities.handJoints.forEach((o, i) => {
      // wogger.log(`Updating hand joint rigidBody position`, { i, o });
      o.rigidBody?.setNextKinematicTranslation(o.engine.position);
    });

    // w.joints.forEach((o) => {
    //   if (!o.rigidBody) {
    //     return;
    //   }
    //   const position = o.rigidBody.translation();
    //   o.position.set(position.x, position.y, position.z);
    // });

    if (gameWorkerEngine.updateMessageRequested) {
      gameWorkerEngine.updateMessageRequested = false;
      // wogger.log(`Sending update message`);

      sendNewEntityMessage();

      const USE_ARRAY_BUFFER = true;
      if (!USE_ARRAY_BUFFER) {
        postMessageFromWorker({
          kind: `updateObjects`,
          boxes: registeredEntities
            .filter((x) => x.shape === `box` && x.active && x.engine.hasMoved)
            .map((x) => ({
              id: x.id,
              position: x.engine.position.toArray(),
              quaternion: x.engine.quaternion.toArray() as [number, number, number, number],
              scale: x.engine.scale.toArray(),
            })),
          spheres: registeredEntities
            .filter((x) => x.shape === `sphere` && x.active && x.engine.hasMoved)
            .map((x) => ({
              id: x.id,
              position: x.engine.position.toArray(),
              radius: x.engine.scale.x,
            })),
        });
      } else {
        postMessageSceneObjectTransforms(
          registeredEntities.filter((x) => x.shape === `box` && x.active && x.engine.hasMoved).map((x) => x.engine),
          registeredEntities.filter((x) => x.shape === `sphere` && x.active && x.engine.hasMoved).map((x) => x.engine),
          messageBufferPool,
        );
      }
    }

    const timeElapsed = performance.now() - time;
    const timeRemaining = world.timestep * 1000 - timeElapsed;
    // const timeRemaining = minDeltaTime - timeElapsed;
    const timeUntilNextFrame = Math.max(0, timeRemaining * 0.85);
    if (frameCount % maxFps === 0) {
      wogger.log(`gameLoop time`, {
        timeWarpRatio,
        fps,
        fpsConstrained,
        timeElapsed,
        timeRemaining,
        timeUntilNextFrame,
        runningDeltaTime,
        constrainedDeltaTime,
        deltaTime,
        lastTime,
        time,
        minDeltaTime,
      });
    }

    frameCount++;
    gameLoopTimerId = setTimeout(gameEngineLoop, timeUntilNextFrame);
  };

  const gameWorkerEngine = {
    // ...sceneData,
    handJoints: engineEntities.handJoints.map((x) => x.engine),
    createEntity,
    updateMessageRequested: false,
    dispose: () => {
      clearTimeout(gameLoopTimerId);
    },
    start: (gameEngine: GameEngine) => {
      state.gameEngine = gameEngine;
      sendNewEntityMessage();
      setTimeout(gameEngineLoop, 100);
    },
    setGravity: (gravity: Vector3) => {
      world.gravity.x = gravity.x;
      world.gravity.y = gravity.y;
      world.gravity.z = gravity.z;
    },
  };
  //   physicsLoop();

  return gameWorkerEngine;
};
