import { wogger } from '../../worker/wogger';
import { createComponentFactory } from '../ecs-component-factory';
import { EcsSceneState } from '../ecs-engine';
import { EntityAction, EntityActionCode, parseActionCode } from './actions/parser';
import { Entity_Game, EntityInstance_Game } from './game';
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
    waves?: GameWave[];
  };
};

export type GameWave = {
  timeBeforeWaveSec: number;
  sequence: GameWaveSequence[];
};
type GameWaveSequence = {
  timeBeforeSpawnSec: number;
  spawnerName: string;
  count: number;
  position: [number, number, number];
  rotation: [number, number, number];
  /** actionCode */
  action?: EntityActionCode;
};

export type EntityInstance_GameWithWaves = {
  gameWithWaves: {
    waves: GameWave[];
    actions: { [actionCode: string]: EntityAction };
    waveIndex?: number;
    sequenceIndex: number;
    sequenceSentCount: number;
    timeNextWave?: number;
    timeNextSpawn?: number;
    spawners: Record<string, EntityInstance_Spawner>;
    setWaves: (waves: GameWave[]) => void;
  };
};

export const gameWithWavesComponentFactory = ({ sceneState }: { sceneState: EcsSceneState }) =>
  createComponentFactory<Entity_Game, Entity_GameWithWaves, EntityInstance_Game, EntityInstance_GameWithWaves>()(() => {
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

        const setWaves = (waves: GameWave[]) => {
          entityInstance.game.gameResult = undefined;

          const allSpawnerNames = waves.flatMap((x) => x.sequence.map((y) => y.spawnerName));
          const spawnerNames = [...new Set(allSpawnerNames)];

          const spawners = Object.fromEntries(
            spawnerNames.map((x) => [x, sceneState.findEntityInstance(x) as unknown as EntityInstance_Spawner]),
          );

          const actionsCodes = [
            ...new Set(
              waves
                .flatMap((x) => x.sequence)
                .map((x) => x.action!)
                .filter((x) => x),
            ),
          ];
          const actions = actionsCodes
            .map((x) => {
              const action = parseActionCode(x);
              return {
                actionCode: x,
                action: action!,
              };
            })
            .filter((x) => x.action)
            .reduce((acc, x) => {
              acc[x.actionCode] = x.action;
              return acc;
            }, {} as Record<string, EntityAction>);
          wogger.log(`gameWithWaves setup - parsed actions`, { actionsCodes, actions });

          gameWithWaves.waves = waves;
          gameWithWaves.waveIndex = undefined;
          gameWithWaves.actions = actions;
          gameWithWaves.spawners = spawners;
        };

        const gameWithWaves: EntityInstance_GameWithWaves[`gameWithWaves`] = {
          waves: [],
          actions: {},
          waveIndex: undefined,
          sequenceIndex: 0,
          sequenceSentCount: 0,
          timeNextWave: undefined,
          timeNextSpawn: undefined,
          spawners: {},
          setWaves,
        };

        if (entity.gameWithWaves.waves) {
          setWaves(entity.gameWithWaves.waves);
        }

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
        const waves = game.waves;

        if (!waves.length) {
          return;
        }

        if (game.waveIndex === undefined) {
          // start first wave
          game.waveIndex = 0;
          game.sequenceIndex = 0;
          game.sequenceSentCount = 0;
          game.timeNextWave = Date.now() + waves[0].timeBeforeWaveSec * 1000;
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
        const wave = waves[game.waveIndex];

        // game over?
        if (!wave) {
          entityInstance.game.active = false;
          entityInstance.game.gameResult = `win`;
          console.log(`gameWithWaves waves finished`, { entityInstance });
          return;
        }

        // sequence
        const sequence = wave.sequence[game.sequenceIndex];

        // wave done
        if (!sequence) {
          game.sequenceIndex = 0;
          game.waveIndex++;
          const nextWave = waves[game.waveIndex];
          game.timeNextWave = !nextWave ? undefined : Date.now() + nextWave.timeBeforeWaveSec * 1000;
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
          game.timeNextSpawn = Date.now() + sequence.timeBeforeSpawnSec * 1000;
        }
        if (Date.now() < game.timeNextSpawn) {
          return;
        }

        // spawn
        const spawner = game.spawners[sequence.spawnerName];
        const action = sequence.action ? game.actions[sequence.action] : undefined;
        spawner.spawner.spawn(sequence.position, sequence.rotation, action);
        game.sequenceSentCount++;
        game.timeNextSpawn = undefined;

        return;
      },
    };
  });
