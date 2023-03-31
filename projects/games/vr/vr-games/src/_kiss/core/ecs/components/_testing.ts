import { World } from '@dimforge/rapier3d-compat';
import { Vector3 } from 'three';
import { createEntityFactory } from '../ecs-entity-factory';
import { createComponentFactories } from './_components';

const global = {
  world: new World(new Vector3(0, -9.81, 0)),
};

const componentFactories = createComponentFactories(global);
const ecs = createEntityFactory(componentFactories);

// What about behavior?

const e1 = ecs.entity(`test`).build();
const e2 = ecs
  .entity(`test2`)
  .transform({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] })
  .rigidBody({ kind: `dynamic` })
  .build();
const e3 = ecs
  .entity(`test3`)
  .transform({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] })
  .rigidBody({ kind: `dynamic` })
  .shape_sphere({ radius: 1 })
  .collider({ restitution: 0.8, friction: 0.1 })
  .build();

const e4 = ecs
  .entity(`test4`)
  .transform({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] })
  .rigidBody({ kind: `dynamic` })
  .addChild(
    ecs
      .entity(`body`)
      .transform({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] })
      .shape_box({ scale: [1, 1, 1] })
      .collider({ restitution: 0.8, friction: 0.1 })
      .build(),
  )
  .addChild(
    ecs
      .entity(`leg1`)
      .transform({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .build(),
  )
  .addChild(
    ecs
      .entity(`leg2`)
      .transform({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .build(),
  )
  .addChild(
    ecs
      .entity(`leg3`)
      .transform({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .build(),
  )
  .addChild(
    ecs
      .entity(`leg4`)
      .transform({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .build(),
  )
  .build();
