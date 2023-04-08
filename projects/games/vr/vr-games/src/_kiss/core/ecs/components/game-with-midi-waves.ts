import { wogger } from '../../worker/wogger';
import { createComponentFactory } from '../ecs-component-factory';
import { EcsSceneState, EntityDescUntyped, EntityInstanceUntyped } from '../ecs-engine';
import { EntityActionCode } from './actions/parser';
import { Entity_Game, EntityInstance_Game } from './game';
import { Entity_GameWithWaves, EntityInstance_GameWithWaves, GameWave } from './game-with-waves';
import { MidiSequenceLoader } from './midi-sequence-loader';

export type Entity_GameWithMidiWaves = {
  gameWithMidiWaves: {};
};

export type EntityInstance_GameWithMidiWaves = {
  gameWithMidiWaves: {
    menu?: EntityInstanceUntyped;
    showMenu: () => void;
    hideMenu: () => void;
    loadLevel: (levelIndex: number) => void;
  };
};

export const gameWithMidiWavesComponentFactory = ({
  midiSequenceLoader,
  prefabFactory,
  sceneState,
}: {
  midiSequenceLoader: MidiSequenceLoader;
  prefabFactory: {
    menu: (args: {
      position: [number, number, number];
      items: { text: string; action: EntityActionCode }[];
    }) => EntityDescUntyped;
  };
  sceneState: EcsSceneState;
}) =>
  createComponentFactory<
    Entity_GameWithWaves & Entity_Game,
    Entity_GameWithMidiWaves,
    EntityInstance_GameWithWaves & EntityInstance_Game,
    EntityInstance_GameWithMidiWaves
  >()(() => {
    return {
      name: `gameWithMidiWaves`,
      addComponent: (entity, args: Entity_GameWithMidiWaves[`gameWithMidiWaves`]) => {
        return {
          ...entity,
          gameWithMidiWaves: {
            ...args,
          },
        };
      },
      setup: (entityInstance) => {
        const songs = [`MW`, `g`, `n`, `Song-8`, `Song-9`, `Song-10`].map((song, i) => ({
          name: song,
          getWaves: () =>
            [
              {
                sequence: [
                  {
                    spawnerName: `eggSpawner`,
                    count: i + 1,
                    position: [2, 1, -25],
                    action: `moveToTarget.setTarget([-1, 1, 0], 6)`,
                    timeBeforeSpawnSec: 1,
                  },
                  {
                    spawnerName: `eggSpawner`,
                    count: i + 1,
                    position: [-2, 1, -15],
                    action: `moveToTarget.setTarget([1, 1, 0], 3)`,
                    timeBeforeSpawnSec: 1,
                  },
                  {
                    spawnerName: `eggSpawner`,
                    count: i + 1,
                    position: [0, 0, -25],
                    action: `moveToTarget.setTarget([0, 0, 0], 6)`,
                    timeBeforeSpawnSec: 1,
                  },
                ],
                timeBeforeWaveSec: 3,
              },
            ] as GameWave[],
        }));

        const showMenu = () => {
          if (gameWithMidiWaves.menu) {
            gameWithMidiWaves.menu.enabled = true;
            return;
          }

          // hideMenu();

          const menu = prefabFactory.menu({
            position: [-0.1, 1, -0.5],
            items: songs.map((x, i) => ({
              text: x.name,
              action: `../gameWithMidiWaves.loadLevel(${i})` as EntityActionCode,
            })),
          });

          const menuInstance = sceneState.createEntityInstance(menu, getActualEntityInstance());

          gameWithMidiWaves.menu = menuInstance;
        };

        const hideMenu = () => {
          if (!gameWithMidiWaves.menu) {
            return;
          }
          gameWithMidiWaves.menu.enabled = false;

          // sceneState.destroyEntityInstance(gameWithMidiWaves.menu);
          // gameWithMidiWaves.menu = undefined;
        };

        const getActualEntityInstance = () =>
          sceneState.findEntityInstanceById(entityInstance.instanceId)! as unknown as typeof entityInstance &
            EntityInstanceUntyped;

        const gameWithMidiWaves = {
          menu: undefined as undefined | EntityInstanceUntyped,
          showMenu,
          hideMenu,
          loadLevel: (levelIndex: number) => {
            const song = songs[levelIndex];
            wogger.log(`loadLevel`, { levelIndex, song, songs });

            if (!song) {
              return;
            }
            const actualEntityInstance = getActualEntityInstance();
            actualEntityInstance.gameWithWaves.setWaves(song.getWaves());
            actualEntityInstance.game.active = true;

            hideMenu();
          },
        };

        entityInstance.game.active = false;
        return {
          ...entityInstance,
          gameWithMidiWaves,
        };
      },
      update: (entityInstance) => {
        //TODO: implement

        if (!entityInstance.game.active && !entityInstance.gameWithMidiWaves.menu?.enabled) {
          entityInstance.gameWithMidiWaves.showMenu();
        }
      },
    };
  });
