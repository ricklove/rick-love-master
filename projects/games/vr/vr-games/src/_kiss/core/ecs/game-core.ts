import { World } from '@dimforge/rapier3d-compat';
import { Quaternion, Vector3 } from 'three';
import { MessageBufferPool } from '../messages/message-buffer';
import { GameCore } from '../worker/types';
import { createComponentFactories } from './components/_components';
import { createScene, createSceneState } from './ecs-engine';
import { createEntityFactory } from './ecs-entity-factory';
import { GraphicsService } from './graphics-service';

export const createGameCore = async (messageBuffer: MessageBufferPool): Promise<GameCore> => {
  // Batch everything until requestUpdateMessage
  const createGraphicsService = (): GraphicsService => ({
    addObject: (args) => {
      return { id: `0` };
    },
    removeObject: () => {
      // empty
    },
    setVisible: () => {
      // empty
    },
    setTransform: () => {
      // empty
    },
  });

  const global = {
    physicsWorld: new World(new Vector3(0, -9.81, 0)),
    graphicsService: createGraphicsService(),
    sceneState: createSceneState(),
  };

  const componentFactories = createComponentFactories(global);
  const ecs = createEntityFactory(componentFactories);

  const root = ecs.entity(`root`, false).build();

  const scene = createScene(root, componentFactories, global);

  const gameLoop = () => {
    scene.update();
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
      // TODO: send update message
    },
    // TODO: transfer inputs to scene
    inputs: {
      head: {
        position: new Vector3(),
        quaternion: new Quaternion(),
      },
      handJoints: [],
    },
  };
};
