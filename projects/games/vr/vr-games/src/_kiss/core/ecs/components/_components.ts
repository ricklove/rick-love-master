import { World } from '@dimforge/rapier3d-compat';
import { colliderComponentFactory } from './collider';
import { rigidBodyComponentFactory } from './rigid-body';
import { shapeBoxComponentFactory } from './shape-box';
import { shapeSphereComponentFactory } from './shape-sphere';
import { transformComponentFactory } from './transform';

export const createComponentFactories = (global: { world: World }) => ({
  transformComponentFactory,
  rigidBodyComponentFactory: rigidBodyComponentFactory(global),
  boxComponentFactory: shapeBoxComponentFactory,
  sphereComponentFactory: shapeSphereComponentFactory,
  colliderComponentFactory: colliderComponentFactory(global),
});
