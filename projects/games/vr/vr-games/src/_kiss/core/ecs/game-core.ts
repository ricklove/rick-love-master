import RAPIER, { EventQueue, World } from '@dimforge/rapier3d-compat';
import { Vector3 } from 'three';
import { createGamePlayerInputs } from '../input/game-player-inputs';
import { MessageBufferPool } from '../messages/message-buffer';
import { GameCore } from '../worker/types';
import { wogger } from '../worker/wogger';
import { createComponentFactories } from './components/_components';
import { createScene, createSceneState } from './ecs-engine';
import { createEntityFactory } from './ecs-entity-factory';
import { createGraphicsService } from './graphics-service';
import { createHands } from './prefabs/hands';

export const createGameCore = async (messageBuffer: MessageBufferPool): Promise<GameCore> => {
  await RAPIER.init();

  const global = {
    physicsWorld: new World(new Vector3(0, -9.81, 0)),
    graphicsService: createGraphicsService(messageBuffer),
    sceneState: createSceneState(),
    inputs: createGamePlayerInputs(),
  };

  const componentFactories = createComponentFactories(global);
  const ecs = createEntityFactory(componentFactories);

  const hands = createHands(ecs);

  // temp
  const root = ecs
    .entity(`root`, false)
    .addChild(
      ecs
        .entity(`ground`)
        .transform({ position: [0, -0.5, 0] })
        .rigidBody({ kind: `fixed` })
        .addChild(
          ecs
            .entity(`ground-collider`)
            .transform({ position: [0, 0, 0] })
            .shape_box({ scale: [100, 1, 100] })
            .collider({ restitution: 0.8, friction: 0.1 })
            .graphics({ color: 0x333333 })
            .build(),
        )
        .build(),
    )
    // .addChild(createAlienEgg(ecs, [-2, 2, -5]))
    .addChild(
      ecs
        .entity(`ball`)
        .transform({ position: [0, 2, -5] })
        .rigidBody({ kind: `dynamic` })
        .addChild(
          ecs
            .entity(`ball-collider`)
            .transform({ position: [0, 0, 0] })
            .shape_sphere({ radius: 0.5 })
            .collider({ restitution: 0.8, friction: 0.1, colliderEvents: true, sensor: true })
            .graphics({ color: 0x0000ff })
            .build(),
        )
        .build(),
    )
    // .addChild(
    //   ecs
    //     .entity(`ball2`)
    //     .transform({ position: [0, 3, -5] })
    //     .rigidBody({ kind: `dynamic` })
    //     .addChild(
    //       ecs
    //         .entity(`ball-collider`)
    //         .transform({ position: [0, 0, 0] })
    //         .shape_sphere({ radius: 0.5 })
    //         .collider({ restitution: 0.8, friction: 0.1 })
    //         .graphics({ color: 0x550055 })
    //         .build(),
    //     )
    //     .build(),
    // )
    // .addChild(hands.hands.left)
    // .addChild(hands.hands.right)
    .build();

  const scene = createScene(root, componentFactories, global);

  let hasRequestedUpdateMessage = false;
  global.physicsWorld.timestep = 1.0 / 60;

  const eventQueue = new EventQueue(true);

  const gameLoop = () => {
    // TODO: physics should be updated inside the scene update
    global.physicsWorld.step(eventQueue);

    // handle collisions
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      if (!started) {
        return;
      }

      wogger.log(`collision`, { started, handle1, handle2 });

      // const entity1 = entityHandleMap.get(handle1);
      // const entity2 = entityHandleMap.get(handle2);
      // if (!entity1 || !entity2) return;
      // if (!entity1.active || !entity2.active) return;

      // if (
      //   (entity1.type === `bullet` && entity2.type === `enemy`) ||
      //   (entity1.type === `enemy` && entity2.type === `bullet`)
      // ) {
      //   hideEntity(entity1);
      //   hideEntity(entity2);
      // }
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
