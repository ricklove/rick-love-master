import { World } from '@dimforge/rapier3d-compat';
import { colliderComponentFactory } from './collider';
import { graphicsComponentFactory, GraphicsService } from './graphics';
import { rigidBodyComponentFactory } from './rigid-body';
import { shapeBoxComponentFactory } from './shape-box';
import { shapeSphereComponentFactory } from './shape-sphere';
import { transformComponentFactory } from './transform';

export const createComponentFactories = (global: { physicsWorld: World; graphicsService: GraphicsService }) => ({
  transformComponentFactory,
  boxComponentFactory: shapeBoxComponentFactory,
  sphereComponentFactory: shapeSphereComponentFactory,
  rigidBodyComponentFactory: rigidBodyComponentFactory(global),
  colliderComponentFactory: colliderComponentFactory(global),
  graphicsComponentFactory: graphicsComponentFactory(global),
});
