import { World } from '@dimforge/rapier3d-compat';
import { Vector3 } from 'three';
import { createEntityFactory } from '../ecs-entity-factory';
import { createComponentFactories } from './_components';

const global = {
  world: new World(new Vector3(0, -9.81, 0)),
};

const componentFactories = createComponentFactories(global);

const childA = {
  stuff: true,
  sphere: { radius: 1 },
};
const root = {};
const childB = componentFactories.sphereColliderComponentFactory.addComponent(childA, {});

const parentA = {
  transform: {
    position: { x: 0, y: 0, z: 0 },
    quaternion: { x: 0, y: 0, z: 0, w: 1 },
  },
};
const parentB = componentFactories.rigidBodyComponentFactory.addComponent(parentA, { kind: `dynamic` });
const parentC = componentFactories.rigidBodyComponentFactory.setup(parentB, root);
componentFactories.sphereColliderComponentFactory.setup(childB, parentC);

const ecs = createEntityFactory(componentFactories);
const e1 = ecs.entity(`test`).build();
const e2 = ecs
  .entity(`test`)
  .transform({ position: { x: 0, y: 0, z: 0 }, quaternion: { x: 0, y: 0, z: 0, w: 1 } })
  .rigidBody({ kind: `dynamic` })
  .build();
const e3 = ecs
  .entity(`test`)
  .transform({ position: { x: 0, y: 0, z: 0 }, quaternion: { x: 0, y: 0, z: 0, w: 1 } })
  .rigidBody({ kind: `dynamic` })
  .sphere({ radius: 1 })
  .sphereCollider({ restitution: 0.8, friction: 0.1 })
  .build();
