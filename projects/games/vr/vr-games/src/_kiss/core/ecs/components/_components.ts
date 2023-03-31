import { World } from '@dimforge/rapier3d-compat';
import { boxComponentFactory } from './box';
import { boxColliderComponentFactory } from './box-collider';
import { rigidBodyComponentFactory } from './rigid-body';
import { sphereComponentFactory } from './sphere';
import { sphereColliderComponentFactory } from './sphere-collider';
import { transformComponentFactory } from './transform';

export const createComponentFactories = (global: { world: World }) => ({
  transformComponentFactory,
  rigidBodyComponentFactory: rigidBodyComponentFactory(global),
  boxComponentFactory,
  boxColliderComponentFactory: boxColliderComponentFactory(global),
  sphereComponentFactory,
  sphereColliderComponentFactory: sphereColliderComponentFactory(global),
});
