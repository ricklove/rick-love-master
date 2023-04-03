import { World } from '@dimforge/rapier3d-compat';
import { Vector3 } from 'three';
import { MessageBufferPool } from '../messages/message-buffer';
import { GameCore } from '../worker/types';
import { createComponentFactories } from './components/_components';
import { createScene, createSceneState } from './ecs-engine';
import { createEntityFactory } from './ecs-entity-factory';
import { createGamePlayerInputs } from './game-player-inputs';
import { createGraphicsService } from './graphics-service';

export const createGameCore = async (messageBuffer: MessageBufferPool): Promise<GameCore> => {
  const global = {
    physicsWorld: new World(new Vector3(0, -9.81, 0)),
    graphicsService: createGraphicsService(messageBuffer),
    sceneState: createSceneState(),
    inputs: createGamePlayerInputs(),
  };

  const componentFactories = createComponentFactories(global);
  const ecs = createEntityFactory(componentFactories);

  const root = ecs.entity(`root`, false).build();

  const scene = createScene(root, componentFactories, global);

  let hasRequestedUpdateMessage = false;
  const gameLoop = () => {
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
