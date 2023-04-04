import { World } from '@dimforge/rapier3d-compat';
import { GamePlayerInputs } from '../../input/game-player-inputs';
import { EcsSceneState } from '../ecs-engine';
import { createEntityFactory } from '../ecs-entity-factory';
import { GraphicsService } from '../graphics-service';
import { colliderComponentFactory } from './collider';
import { gameWithWavesComponentFactory } from './game-with-waves';
import { graphicsComponentFactory } from './graphics';
import { inputHandAttachableComponentFactory } from './input-hand-attachable';
import { inputHandJointComponentFactory } from './input-hand-joint';
import { rigidBodyComponentFactory } from './rigid-body';
import { shapeBoxComponentFactory } from './shape-box';
import { shapeSphereComponentFactory } from './shape-sphere';
import { spawnerComponentFactory } from './spawner';
import { transformComponentFactory } from './transform';

export const createComponentFactories = (global: {
  physicsWorld: World;
  graphicsService: GraphicsService;
  sceneState: EcsSceneState;
  inputs: GamePlayerInputs;
}) => ({
  // update order

  // inputs
  inputHandJointComponentFactory: inputHandJointComponentFactory(global),
  inputHandAttachableComponentFactory: inputHandAttachableComponentFactory(global),

  // misc
  transformComponentFactory,
  boxComponentFactory: shapeBoxComponentFactory,
  sphereComponentFactory: shapeSphereComponentFactory,
  spawnerComponentFactory: spawnerComponentFactory(global),

  // physics
  rigidBodyComponentFactory: rigidBodyComponentFactory(global),
  colliderComponentFactory: colliderComponentFactory(global),

  // game logic
  gameWithWavesComponentFactory: gameWithWavesComponentFactory(global),

  // graphics
  graphicsComponentFactory: graphicsComponentFactory(global),
});

const _ecs = (componentFactories: ReturnType<typeof createComponentFactories>) =>
  createEntityFactory(componentFactories);
export type Ecs = ReturnType<typeof _ecs>;
