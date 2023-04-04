import { createComponentFactory } from '../ecs-component-factory';
import { EcsSceneState } from '../ecs-engine';

/** Game with waves
 *
 * This handles any type of game with waves:
 *
 * - Tower Defense
 * - Beat Saber
 * - Space Pirate Trainer
 *
 * However, any spawner can be used, and enemy speed can be calculated to arrive at the right time.
 *
 * - Beat Saber + Space Pirate Trainer:
 *   - Spawn enemies with times so that they arrive to hit area on beat time
 *
 */
// generateWaveSequenceFromBeatTimesAndEnemySpeeds

export type Entity_Game = {
  game: {
    active: boolean;
  };
};

export type EntityInstance_Game = {
  game: {
    active: boolean;
    gameResult?: `win` | `lose`;
    startGame?: () => void;
  };
};

export const gameComponentFactory = ({ sceneState }: { sceneState: EcsSceneState }) =>
  createComponentFactory<{}, Entity_Game, EntityInstance_Game, EntityInstance_Game>()(() => {
    return {
      name: `game`,
      addComponent: (entity, args: Entity_Game[`game`]) => {
        return {
          ...entity,
          game: {
            ...args,
          },
        };
      },
      setup: (entityInstance) => {
        return {
          ...entityInstance,
          game: {
            active: entityInstance.desc.game.active,
          },
        };
      },
      update: (entityInstance) => {
        return;
      },
    };
  });
