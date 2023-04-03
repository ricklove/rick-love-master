import RAPIER, { World } from '@dimforge/rapier3d-compat';
import { Vector3 } from 'three';
import { createGamePlayerInputs } from '../input/game-player-inputs';
import { MessageBufferPool } from '../messages/message-buffer';
import { GameCore } from '../worker/types';
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
            .collider({})
            .graphics({ color: 0x333333 })
            .build(),
        )
        .build(),
    )
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
            .collider({ restitution: 0.8, friction: 0.1 })
            .graphics({ color: 0x0000ff })
            .build(),
        )
        .build(),
    )
    .addChild(hands.hands.left)
    .addChild(hands.hands.right)
    .build();

  const scene = createScene(root, componentFactories, global);

  let hasRequestedUpdateMessage = false;
  const gameLoop = () => {
    // TODO: physics should be updated inside the scene update
    global.physicsWorld.step();
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
