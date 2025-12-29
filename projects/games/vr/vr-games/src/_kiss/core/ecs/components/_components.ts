import { GamePlayerInputs } from '../../input/game-player-inputs';
import { AudioService } from '../audio-service';
import { BeatService } from '../beat-service';
import { EcsSceneState, EntityDescUntyped } from '../ecs-engine';
import { createEntityFactory } from '../ecs-entity-factory';
import { GraphicsService } from '../graphics-service';
import { PhysicsService } from '../physics-service';
import { actionDisableEntityComponentFactory } from './actions/action-disable-entity';
import { actionsComponentFactory } from './actions/actions';
import { EntityActionCode } from './actions/parser';
import { colliderComponentFactory } from './collider';
import { collisionActionComponentFactory } from './collision-action';
import { debugActionComponentFactory } from './debug-action';
import { gameComponentFactory } from './game';
import { gameWithMusicWavesComponentFactory } from './game-with-music-waves';
import { gameWithWavesComponentFactory } from './game-with-waves';
import { graphicsComponentFactory } from './graphics';
import { graphicsWithBeatComponentFactory } from './graphics-with-beat';
import { inputControllerComponentFactory } from './input-controller';
import { inputHandAttachableComponentFactory } from './input-hand-attachable';
import { inputHandJointComponentFactory } from './input-hand-joint';
import { inputMouseComponentFactory } from './input-mouse';
import { menuComponentFactory } from './menu';
import { moveRelativeToParentComponentFactory } from './move-relative-to-parent';
import { moveToTargetComponentFactory } from './move-to-target';
import { MusicSequenceLoader } from './music-sequence-loader';
import { rigidBodyComponentFactory } from './rigid-body';
import { shapeBoxComponentFactory } from './shape-box';
import { shapeSphereComponentFactory } from './shape-sphere';
import { shapeTextComponentFactory } from './shape-text';
import { spawnerComponentFactory } from './spawner';
import { transformComponentFactory } from './transform';

export type ComponentFactoryGlobals = {
  audioService: AudioService;
  beatService: BeatService;
  physicsService: PhysicsService;
  graphicsService: GraphicsService;
  sceneState: EcsSceneState;
  inputs: GamePlayerInputs;
  musicSequenceLoader: MusicSequenceLoader;
  prefabFactory: {
    menu: (args: {
      position: [number, number, number];
      items: { text: string; action: EntityActionCode }[];
    }) => EntityDescUntyped;
  };
};

export const createComponentFactories = (global: ComponentFactoryGlobals) => ({
  // update order

  debugActionComponentFactory: debugActionComponentFactory(global),

  // inputs
  inputHandJointComponentFactory: inputHandJointComponentFactory(global),
  inputControllerComponentFactory: inputControllerComponentFactory(global),
  inputHandAttachableComponentFactory: inputHandAttachableComponentFactory(global),
  inputMouseComponentFactory: inputMouseComponentFactory(global),

  // misc
  transformComponentFactory,
  boxComponentFactory: shapeBoxComponentFactory,
  sphereComponentFactory: shapeSphereComponentFactory,
  shapeTextComponentFactory: shapeTextComponentFactory,
  spawnerComponentFactory: spawnerComponentFactory(global),
  menuComponentFactory: menuComponentFactory(global),

  // physics
  rigidBodyComponentFactory: rigidBodyComponentFactory(global),
  colliderComponentFactory: colliderComponentFactory(global),
  moveToTargetComponentFactory: moveToTargetComponentFactory(global),
  moveRelativeToParentComponentFactory: moveRelativeToParentComponentFactory,

  // game logic
  gameComponentFactory: gameComponentFactory(global),
  gameWithWavesComponentFactory: gameWithWavesComponentFactory(global),
  gameWithMusicWavesComponentFactory: gameWithMusicWavesComponentFactory(global),

  actionsComponentFactory: actionsComponentFactory,
  actionDisableEntityComponentFactory: actionDisableEntityComponentFactory,
  collisionActionComponentFactory: collisionActionComponentFactory,

  // graphics
  graphicsWithBeatComponentFactory: graphicsWithBeatComponentFactory(global),
  graphicsComponentFactory: graphicsComponentFactory(global),
});

const _ecs = (componentFactories: ReturnType<typeof createComponentFactories>) =>
  createEntityFactory(componentFactories);
export type Ecs = ReturnType<typeof _ecs>;
