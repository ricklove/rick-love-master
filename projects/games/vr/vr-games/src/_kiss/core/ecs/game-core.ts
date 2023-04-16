import RAPIER, { EventQueue } from '@dimforge/rapier3d-compat';
import { createGamePlayerInputs } from '../input/game-player-inputs';
import { MessageBufferPool } from '../messages/message-buffer';
import { GameCore } from '../worker/types';
import { createAudioService } from './audio-service';
import { createBeatService } from './beat-service';
import { ComponentFactoryGlobals, createComponentFactories } from './components/_components';
import { EntityInstance_Collider } from './components/collider';
import { createMusicSequenceLoader } from './components/music-sequence-loader';
import { EntityInstance_RigidBody } from './components/rigid-body';
import { createScene, createSceneState } from './ecs-engine';
import { createEntityFactory } from './ecs-entity-factory';
import { createGraphicsService } from './graphics-service';
import { createPhysicsService } from './physics-service';
import { createMenu } from './prefabs/menu';
import { createScene_beatSaber } from './scenes/beat-saber';

export const createGameCore = async (messageBuffer: MessageBufferPool): Promise<GameCore> => {
  await RAPIER.init();

  const global = {
    audioService: createAudioService(),
    beatService: createBeatService(),
    physicsService: createPhysicsService(),
    graphicsService: createGraphicsService(messageBuffer),
    sceneState: createSceneState(),
    inputs: createGamePlayerInputs(),
    musicSequenceLoader: createMusicSequenceLoader(),
    prefabFactory: {
      menu: (args) => {
        return createMenu(ecs, args);
      },
    },
  } satisfies ComponentFactoryGlobals;

  const componentFactories = createComponentFactories(global);
  const ecs = createEntityFactory(componentFactories);

  // const root = createScene_test01(ecs);
  const root = createScene_beatSaber(ecs);

  const scene = createScene(root, componentFactories, global);

  let hasRequestedUpdateMessage = false;
  global.physicsService.world.timestep = 1.0 / 120;

  const eventQueue = new EventQueue(true);

  const gameLoop = () => {
    // TODO: physics should be updated inside the scene update
    global.physicsService.world.step(eventQueue);

    // handle collisions
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      if (!started) {
        return;
      }

      const entityId1 = global.physicsService.handleEntityIds.get(handle1);
      const entityId2 = global.physicsService.handleEntityIds.get(handle2);
      const entity1 = entityId1 && global.sceneState.findEntityInstanceById(entityId1);
      const entity2 = entityId2 && global.sceneState.findEntityInstanceById(entityId2);
      const entityCollider1 = entity1 as unknown as undefined | EntityInstance_Collider;
      const entityCollider2 = entity2 as unknown as undefined | EntityInstance_Collider;

      let entityRigidbody1 = entity1 as unknown as undefined | EntityInstance_RigidBody;
      let entityRigidbody2 = entity2 as unknown as undefined | EntityInstance_RigidBody;
      if (entityRigidbody1 && !entityRigidbody1.rigidBody) {
        entityRigidbody1 = (entity1 && entity1.parent) as unknown as undefined | EntityInstance_RigidBody;
      }
      if (entityRigidbody2 && !entityRigidbody2.rigidBody) {
        entityRigidbody2 = (entity2 && entity2.parent) as unknown as undefined | EntityInstance_RigidBody;
      }

      // wogger.log(`collision`, {
      //   started,
      //   er1: `${(entityRigidbody1 as unknown as EntityInstanceUntyped).desc.name} (${entityId1}) ${
      //     (entity1 as unknown as EntityInstanceUntyped).desc.name
      //   } ${(entityRigidbody1 as unknown as EntityInstance_RigidBody).rigidBody.collisionTag ?? ``}`,
      //   er2: `${(entityRigidbody2 as unknown as EntityInstanceUntyped).desc.name} (${entityId2}) ${
      //     (entity2 as unknown as EntityInstanceUntyped).desc.name
      //   } ${(entityRigidbody2 as unknown as EntityInstance_RigidBody).rigidBody.collisionTag ?? ``}`,
      //   onCollision1: entityRigidbody1?.rigidBody.onCollision,
      //   onCollision2: entityRigidbody2?.rigidBody.onCollision,
      //   entityRigidbody1,
      //   entityRigidbody2,
      //   entity1,
      //   entity2,
      //   entityId1,
      //   entityId2,
      //   handle1,
      //   handle2,
      //   global,
      // });

      entityRigidbody1?.rigidBody.onCollision?.(
        entityRigidbody2,
        started,
        entityCollider1 as EntityInstance_Collider,
        entityCollider2,
      );
      entityRigidbody2?.rigidBody.onCollision?.(
        entityRigidbody1,
        started,
        entityCollider2 as EntityInstance_Collider,
        entityCollider1,
      );
    });

    scene.update();
    if (hasRequestedUpdateMessage) {
      hasRequestedUpdateMessage = false;
      global.graphicsService.sendMessages();
    }

    // TODO: time left to achieve target fps
    setTimeout(gameLoop, 1);
  };

  return {
    start: () => {
      scene.setup();
      setTimeout(gameLoop, 0);
    },
    dispose: () => {
      scene.destroy();
    },
    requestUpdateMessage: () => {
      hasRequestedUpdateMessage = true;
    },
    inputs: global.inputs,
  };
};
