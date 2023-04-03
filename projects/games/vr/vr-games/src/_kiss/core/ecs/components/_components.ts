import { World } from '@dimforge/rapier3d-compat';
import { EcsSceneState } from '../ecs-engine';
import { colliderComponentFactory } from './collider';
import { gameWithWavesComponentFactory } from './game-with-waves';
import { graphicsComponentFactory, GraphicsService } from './graphics';
import { rigidBodyComponentFactory } from './rigid-body';
import { shapeBoxComponentFactory } from './shape-box';
import { shapeSphereComponentFactory } from './shape-sphere';
import { spawnerComponentFactory } from './spawner';
import { transformComponentFactory } from './transform';

export const createComponentFactories = (global: {
  physicsWorld: World;
  graphicsService: GraphicsService;
  sceneState: EcsSceneState;
}) => ({
  transformComponentFactory,
  boxComponentFactory: shapeBoxComponentFactory,
  sphereComponentFactory: shapeSphereComponentFactory,
  rigidBodyComponentFactory: rigidBodyComponentFactory(global),
  colliderComponentFactory: colliderComponentFactory(global),
  graphicsComponentFactory: graphicsComponentFactory(global),
  spawnerComponentFactory: spawnerComponentFactory(global),
  gameWithWavesComponentFactory: gameWithWavesComponentFactory(global),
});
