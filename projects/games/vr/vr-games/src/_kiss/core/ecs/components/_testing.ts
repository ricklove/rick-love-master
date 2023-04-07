import { createGamePlayerInputs } from '../../input/game-player-inputs';
import { createScene, createSceneState } from '../ecs-engine';
import { createEntityFactory } from '../ecs-entity-factory';
import { GraphicsService } from '../graphics-service';
import { createPhysicsService } from '../physics-service';
import { ComponentFactoryGlobals, createComponentFactories } from './_components';
import { createMidiSequenceLoader } from './midi-sequence-loader';

const createGraphicsService = (): GraphicsService => ({
  addObject: (args) => {
    return { id: 0 };
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
  physicsService: createPhysicsService(),
  graphicsService: createGraphicsService(),
  sceneState: createSceneState(),
  inputs: createGamePlayerInputs(),
  midiSequenceLoader: createMidiSequenceLoader(),
  prefabFactory: {
    menu: () => {
      return ecs.entity(`placeholder`).build();
    },
  },
} satisfies ComponentFactoryGlobals;

const componentFactories = createComponentFactories(global);
const ecs = createEntityFactory(componentFactories);

// What about behavior?

const alienEgg = ecs
  .entity(`alienEgg`)
  .transform({ position: [0, 0, 0] })
  .rigidBody({ kind: `dynamic` })
  .addChild(
    ecs
      .entity(`body`)
      .transform({ position: [0, 0, 0] })
      .shape_box({ scale: [1, 1, 1] })
      .collider({ restitution: 0.8, friction: 0.1 })
      .graphics({ color: 0x00ff00 })
      .build(),
  )
  .addChild(
    ecs
      .entity(`leg1`)
      .transform({ position: [0, 0, 0] })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .graphics({ color: 0x0000ff })
      .build(),
  )
  .addChild(
    ecs
      .entity(`leg2`)
      .transform({ position: [0, 0, 0] })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .graphics({ color: 0xff0000 })
      .build(),
  )
  .addChild(
    ecs
      .entity(`leg3`)
      .transform({ position: [0, 0, 0] })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .graphics({ color: 0x0000ff })
      .build(),
  )
  .addChild(
    ecs
      .entity(`leg4`)
      .transform({ position: [0, 0, 0] })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .graphics({ color: 0xff0000 })
      .build(),
  )
  .build();

const root = ecs
  .entity(`root`, false)
  .addChild(ecs.entity(`test`).build())
  .addChild(
    ecs
      .entity(`test2`)
      .transform({ position: [0, 0, 0] })
      .rigidBody({ kind: `dynamic` })
      .build(),
  )
  .addChild(
    ecs
      .entity(`test3`)
      .transform({ position: [0, 0, 0] })
      .rigidBody({ kind: `dynamic` })
      .shape_sphere({ radius: 1 })
      .collider({ restitution: 0.8, friction: 0.1 })
      .graphics({ color: 0xff0000 })
      .build(),
  )
  .addChild(
    ecs
      .entity(`alienEggSpawner`)
      .spawner({
        prefab: alienEgg,
        poolSize: 10,
      })
      .build(),
  )
  .addChild(
    ecs
      .entity(`game`)
      .game({
        active: true,
      })
      .gameWithWaves({
        waves: [
          {
            timeBeforeWaveSec: 3000,
            sequence: [{ timeBeforeSpawnSec: 0, count: 1, spawnerName: `alienEggSpawner`, position: [0, 0, 0] }],
          },
        ],
      })
      .build(),
  )
  .build();

const scene = createScene(root, componentFactories, global);
