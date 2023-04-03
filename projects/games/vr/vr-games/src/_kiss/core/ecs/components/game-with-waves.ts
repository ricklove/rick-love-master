import { createComponentFactory } from '../ecs-component-factory';
import { EcsSceneState } from '../ecs-engine';
import { EntityInstance_Spawner } from './spawner';

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

export type Entity_GameWithWaves = {
  gameWithWaves: {
    waves: GameWave[];
  };
};

type GameWave = {
  timeBeforeWaveSec: number;
  sequence: GameWaveSequence[];
};
type GameWaveSequence = {
  timeBeforeSequenceSec: number;
  spawnerName: string;
  count: number;
  position: [number, number, number];
};

export type EntityInstance_Game = {
  game: {
    active: boolean;
    gameResult?: `win` | `lose`;
    startGame?: () => void;
  };
};

export type EntityInstance_GameWithWaves = {
  gameWithWaves: {
    waveIndex?: number;
    sequenceIndex: number;
    sequenceSentCount: number;
    timeNextWave?: number;
    timeNextSpawn?: number;
    spawners: Record<string, EntityInstance_Spawner>;
  };
};

export const gameWithWavesComponentFactory = ({ sceneState }: { sceneState: EcsSceneState }) =>
  createComponentFactory<{}, Entity_GameWithWaves, EntityInstance_Game, EntityInstance_GameWithWaves>()(() => {
    return {
      name: `gameWithWaves`,
      addComponent: (entity, args: Entity_GameWithWaves[`gameWithWaves`]) => {
        return {
          ...entity,
          gameWithWaves: {
            ...args,
          },
        };
      },
      setup: (entityInstance) => {
        const entity = entityInstance.desc;

        const allSpawnerNames = entity.gameWithWaves.waves.flatMap((x) => x.sequence.map((y) => y.spawnerName));
        const spawnerNames = [...new Set(allSpawnerNames)];

        const spawners = Object.fromEntries(
          spawnerNames.map((x) => [x, sceneState.findEntityInstance(x) as unknown as EntityInstance_Spawner]),
        );

        const gameWithWaves: EntityInstance_GameWithWaves[`gameWithWaves`] = {
          waveIndex: undefined,
          sequenceIndex: 0,
          sequenceSentCount: 0,
          timeNextWave: undefined,
          timeNextSpawn: undefined,
          spawners,
        };

        return {
          ...entityInstance,
          game: {
            ...entityInstance.game,
            startGame: () => {
              entityInstance.game.active = true;
              entityInstance.game.gameResult = undefined;
              gameWithWaves.waveIndex = undefined;
            },
          },
          gameWithWaves,
        };
      },
      update: (entityInstance) => {
        // send a wave sequence

        if (!entityInstance.game.active) {
          return;
        }

        const game = entityInstance.gameWithWaves;
        const desc = entityInstance.desc.gameWithWaves;

        if (game.waveIndex === undefined) {
          // start first wave
          game.waveIndex = 0;
          game.sequenceIndex = 0;
          game.sequenceSentCount = 0;
          game.timeNextWave = Date.now() + desc.waves[0].timeBeforeWaveSec * 1000;
          game.timeNextSpawn = undefined;
        }

        // waiting for wave
        if (game.timeNextWave) {
          if (Date.now() < game.timeNextWave) {
            return;
          }

          game.timeNextWave = undefined;
          return;
        }

        // wave
        const wave = desc.waves[game.waveIndex];

        // game over?
        if (!wave) {
          entityInstance.game.active = false;
          entityInstance.game.gameResult = `win`;
          return;
        }

        // sequence
        const sequence = wave.sequence[game.sequenceIndex];

        // wave done
        if (!sequence) {
          game.sequenceIndex = 0;
          game.waveIndex++;
          game.timeNextWave = Date.now() + desc.waves[game.waveIndex].timeBeforeWaveSec * 1000;
          return;
        }

        // sequence done
        if (game.sequenceSentCount >= sequence.count) {
          game.sequenceIndex++;
          game.sequenceSentCount = 0;
          return;
        }

        // wait for next spawn
        if (!game.timeNextSpawn) {
          game.timeNextSpawn = Date.now() + sequence.timeBeforeSequenceSec * 1000;
        }
        if (Date.now() < game.timeNextSpawn) {
          return;
        }

        // spawn
        const spawner = game.spawners[sequence.spawnerName];
        spawner.spawner.spawn(sequence.position);
        game.sequenceSentCount++;
        game.timeNextSpawn = undefined;

        return;
      },
    };
  });
