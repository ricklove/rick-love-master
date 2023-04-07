import { GamePlayerInputs } from '../../input/game-player-inputs';
import { EcsSceneState } from '../ecs-engine';
import { createEntityFactory } from '../ecs-entity-factory';
import { GraphicsService } from '../graphics-service';
import { PhysicsService } from '../physics-service';
import { actionDisableEntityComponentFactory } from './actions/action-disable-entity';
import { actionsComponentFactory } from './actions/actions';
import { EntityActionCode } from './actions/parser';
import { colliderComponentFactory } from './collider';
import { collisionActionComponentFactory } from './collision-action';
import { gameComponentFactory } from './game';
import { gameWithMidiWavesComponentFactory } from './game-with-midi-waves';
import { gameWithWavesComponentFactory } from './game-with-waves';
import { graphicsComponentFactory } from './graphics';
import { inputHandAttachableComponentFactory } from './input-hand-attachable';
import { inputHandJointComponentFactory } from './input-hand-joint';
import { inputMouseComponentFactory } from './input-mouse';
import { MidiSequenceLoader } from './midi-sequence-loader';
import { moveRelativeToParentComponentFactory } from './move-relative-to-parent';
import { moveToTargetComponentFactory } from './move-to-target';
import { rigidBodyComponentFactory } from './rigid-body';
import { shapeBoxComponentFactory } from './shape-box';
import { shapeSphereComponentFactory } from './shape-sphere';
import { shapeTextComponentFactory } from './shape-text';
import { spawnerComponentFactory } from './spawner';
import { transformComponentFactory } from './transform';

export type ComponentFactoryGlobals = {
  physicsService: PhysicsService;
  graphicsService: GraphicsService;
  sceneState: EcsSceneState;
  inputs: GamePlayerInputs;
  midiSequenceLoader: MidiSequenceLoader;
  prefabFactory: {
    menu: (args: { position: [number, number, number]; items: { text: string; action: EntityActionCode }[] }) => {
      enabled: boolean;
    };
  };
};

export const createComponentFactories = (global: ComponentFactoryGlobals) => ({
  // update order

  // inputs
  inputHandJointComponentFactory: inputHandJointComponentFactory(global),
  inputHandAttachableComponentFactory: inputHandAttachableComponentFactory(global),
  inputMouseComponentFactory: inputMouseComponentFactory(global),

  // misc
  transformComponentFactory,
  boxComponentFactory: shapeBoxComponentFactory,
  sphereComponentFactory: shapeSphereComponentFactory,
  shapeTextComponentFactory: shapeTextComponentFactory,
  spawnerComponentFactory: spawnerComponentFactory(global),

  // physics
  rigidBodyComponentFactory: rigidBodyComponentFactory(global),
  colliderComponentFactory: colliderComponentFactory(global),
  moveToTargetComponentFactory: moveToTargetComponentFactory(global),
  moveRelativeToParentComponentFactory: moveRelativeToParentComponentFactory,

  // game logic
  gameComponentFactory: gameComponentFactory(global),
  gameWithWavesComponentFactory: gameWithWavesComponentFactory(global),
  gameWithMidiWavesComponentFactory: gameWithMidiWavesComponentFactory(global),

  actionsComponentFactory: actionsComponentFactory,
  actionDisableEntityComponentFactory: actionDisableEntityComponentFactory,
  collisionActionComponentFactory: collisionActionComponentFactory,

  // graphics
  graphicsComponentFactory: graphicsComponentFactory(global),
});

const _ecs = (componentFactories: ReturnType<typeof createComponentFactories>) =>
  createEntityFactory(componentFactories);
export type Ecs = ReturnType<typeof _ecs>;
