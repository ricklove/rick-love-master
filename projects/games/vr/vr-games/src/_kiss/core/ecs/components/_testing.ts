import { World } from '@dimforge/rapier3d-compat';
import { Vector3 } from 'three';
import { createEntityFactory } from '../ecs-entity-factory';
import { createComponentFactories } from './_components';
import { GraphicsService } from './graphics';

const graphicsService: GraphicsService = {
  addObject: (args) => {
    return { id: `0` };
  },
  setVisible: () => {
    // empty
  },
  setTransform: () => {
    // empty
  },
};
const global = {
  world: new World(new Vector3(0, -9.81, 0)),
  graphicsService,
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
  .graphics({ color: 0xff0000 })
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
      .graphics({ color: 0x00ff00 })
      .build(),
  )
  .addChild(
    ecs
      .entity(`leg1`)
      .transform({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .graphics({ color: 0x0000ff })
      .build(),
  )
  .addChild(
    ecs
      .entity(`leg2`)
      .transform({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .graphics({ color: 0xff0000 })
      .build(),
  )
  .addChild(
    ecs
      .entity(`leg3`)
      .transform({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .graphics({ color: 0x0000ff })
      .build(),
  )
  .addChild(
    ecs
      .entity(`leg4`)
      .transform({ position: [0, 0, 0], quaternion: [0, 0, 0, 1] })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .graphics({ color: 0xff0000 })
      .build(),
  )
  .build();
