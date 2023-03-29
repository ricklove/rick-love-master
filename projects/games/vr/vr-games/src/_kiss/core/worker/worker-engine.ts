import RAPIER, { ColliderDesc, EventQueue, RigidBodyDesc, World } from '@dimforge/rapier3d-compat';
import { Quaternion, Vector3 } from 'three';
import { handJointNames } from '../input/hand-joints';
import { postMessageFromWorker } from '../messages/message';
import { MessageBufferPool } from '../messages/message-buffer';
import { postMessageSceneObjectTransforms } from '../messages/messages/message-scene-object-transforms';
import {
  BooleanDefaultTrueOfOptionalField,
  GameEngine,
  GameWorkerCreateEntityArgs,
  GameWorkerEngine,
  PhysicsFieldsObj,
} from './types';
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
  const registeredEntities = [] as ReturnType<typeof createEntity>[];
  const createEntity = <
    TArgs extends GameWorkerCreateEntityArgs,
    TType extends string,
    TUserData extends Record<string, unknown>,
  >(
    args: TArgs & { type: TType; userData?: TUserData },
  ) => {
    // wogger.log(`createEntity`, { data });

    const position = args.position ?? new Vector3();
    const quaternion = args.quaternion ?? new Quaternion();
    const scale =
      args.shape === `sphere`
        ? new Vector3(args.radius, args.radius, args.radius)
        : args.shape === `box`
        ? args.scale
        : new Vector3(1, 1, 1);

    const physics =
      (!(`physics` in args) || args.physics === true) && (args.shape === `sphere` || args.shape === `box`)
        ? (() => {
            const kind = args.kind ?? `dynamic`;

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

            if (args.gravityScale != null) {
              rigidBodyDesc = rigidBodyDesc.setGravityScale(args.gravityScale);
            }

            const rigidBody = world.createRigidBody(rigidBodyDesc);

            if (args.shape === `sphere`) {
              let colliderDesc = ColliderDesc.ball(scale.x);
              if (args.restitution) {
                colliderDesc = colliderDesc.setRestitution(args.restitution);
              }
              if (args.sensor) {
                colliderDesc = colliderDesc.setSensor(true);
              }
              world.createCollider(colliderDesc, rigidBody);
            }
            if (args.shape === `box`) {
              let colliderDesc = ColliderDesc.cuboid(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5);
              if (args.restitution) {
                colliderDesc = colliderDesc.setRestitution(args.restitution);
              }
              if (args.sensor) {
                colliderDesc = colliderDesc.setSensor(true);
              }
              world.createCollider(colliderDesc, rigidBody);
            }
            return { kind, rigidBody };
          })()
        : undefined;

    const id = nextId++;
    const entity = {
      id,
      type: args.type,
      args: args as TArgs,
      userData: args.userData as NonNullable<typeof args[`userData`]>,
      shape: args.shape,
      active: args.active ?? true,

      input: {
        position: args.position.clone(),
        quaternion: quaternion.clone(),
      },
      physics: physics as typeof physics &
        PhysicsFieldsObj<TArgs['shape'], BooleanDefaultTrueOfOptionalField<TArgs, 'physics'>>[`physics`],
      graphics: {
        // id copied here for convenience
        id,
        visible: true,
        hasSentAddMessage: false,
        hasChanged: true,
        position: args.position.clone(),
        quaternion: quaternion.clone(),
        scale: scale.clone(),
        color: args.color ?? Math.random() * 0xffffff,
      },
    };
    registeredEntities.push(entity);

    // wogger.log(`createdEntity`, { entity, data, registeredEntities });
    return entity;
  };
  const createEntityTyped: GameWorkerEngine[`createEntity`] = createEntity as GameWorkerEngine[`createEntity`];

  const jointCount = handJointNames.length * 2;
  const engineEntities = {
    head: createEntity({
      type: `head` as const,
      kind: `kinematicPositionBased` as const,
      shape: `sphere` as const,
      position: new Vector3(0, 1, 0),
      radius: 0.001,
      sensor: true,
    }),
    handJoints: [...new Array(jointCount)]
      .map(() => ({
        type: `handJoint` as const,
        kind: `kinematicPositionBased` as const,
        shape: `sphere` as const,
        position: new Vector3(0, 1, -1),
        radius: 0.02,
        // radius: 0.01,
      }))
      .map(createEntity),
  };

  const sendNewEntityMessage = () => {
    const newEntities = registeredEntities.filter((x) => !x.graphics.hasSentAddMessage);
    if (!newEntities.length) {
      return;
    }
    newEntities.forEach((x) => {
      x.graphics.hasSentAddMessage = true;
    });

    wogger.log(`sendNewEntityMessage`, { newEntities });

    // TODO: Make efficient
    postMessageFromWorker({
      kind: `addObjects`,
      boxes: newEntities
        .filter((x) => x.shape === `box`)
        .map((x) => ({
          id: x.graphics.id,
          position: x.graphics.position.toArray(),
          quaternion: x.graphics.quaternion.toArray() as [number, number, number, number],
          scale: x.graphics.scale.toArray(),
          color: x.graphics.color,
        })),
      spheres: newEntities
        .filter((x) => x.shape === `sphere`)
        .map((x) => ({
          id: x.graphics.id,
          position: x.graphics.position.toArray(),
          radius: x.graphics.scale.x,
          color: x.graphics.color,
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

    // Inputs
    engineEntities.handJoints.forEach((o) => {
      // wogger.log(`Updating hand joint rigidBody position`, { i, o });
      o.physics.rigidBody?.setNextKinematicTranslation(o.input.position);
    });

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
          head: {
            position: engineEntities.head.input.position,
            quaternion: engineEntities.head.input.quaternion,
          },
          hands: {
            left: {
              side: `left` as const,
              position: engineEntities.handJoints[0].input.position,
              quaternion: engineEntities.handJoints[0].input.quaternion,
            },
            right: {
              side: `right` as const,
              position: engineEntities.handJoints[0 + handJointNames.length].input.position,
              quaternion: engineEntities.handJoints[0 + handJointNames.length].input.quaternion,
            },
          },
        },
        eventQueue,
      );
    }

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

      // Update the graphics positions from physics
      registeredEntities.forEach((o) => {
        if (!o.physics?.rigidBody) {
          return;
        }
        if (!o.active) {
          if (o.graphics.visible) {
            o.graphics.visible = false;
            o.graphics.hasChanged = true;
          }
          return;
        }
        if (!o.graphics.visible) {
          o.graphics.visible = true;
          o.graphics.hasChanged = true;
        }

        const position = o.physics.rigidBody.translation();
        const oPosition = o.graphics.position;
        const xPositionDelta = position.x - oPosition.x;
        const yPositionDelta = position.y - oPosition.y;
        const zPositionDelta = position.z - oPosition.z;
        const positionDeltaSq =
          xPositionDelta * xPositionDelta + yPositionDelta * yPositionDelta + zPositionDelta * zPositionDelta;
        oPosition.set(position.x, position.y, position.z);

        const quaternion = o.physics.rigidBody.rotation();
        const oQuaternion = o.graphics.quaternion;
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

        o.graphics.hasChanged = o.graphics.hasChanged || positionDeltaSq > 0.00001 || quaternionDeltaSq > 0.00001;
      });

      sendNewEntityMessage();
      postMessageSceneObjectTransforms(
        registeredEntities.filter((x) => x.graphics.hasChanged).map((x) => x.graphics),
        messageBufferPool,
      );
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
    inputs: {
      head: engineEntities.head.input,
      handJoints: engineEntities.handJoints.map((x) => x.input),
    },
    createEntity: createEntityTyped,
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
