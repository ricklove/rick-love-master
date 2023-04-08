import { musicList } from '../../audio/music-list';
import { wogger } from '../../worker/wogger';
import { AudioService } from '../audio-service';
import { createComponentFactory } from '../ecs-component-factory';
import { EcsSceneState, EntityDescUntyped, EntityInstanceUntyped } from '../ecs-engine';
import { EntityActionCode } from './actions/parser';
import { Entity_Game, EntityInstance_Game } from './game';
import { Entity_GameWithWaves, EntityInstance_GameWithWaves, GameWave } from './game-with-waves';
import { MusicSequenceLoader } from './midi-sequence-loader';

export type Entity_GameWithMusicWaves = {
  gameWithMusicWaves: {};
};

export type EntityInstance_GameWithMusicWaves = {
  gameWithMusicWaves: {
    menu?: EntityInstanceUntyped;
    showMenu: () => void;
    hideMenu: () => void;
    loadLevel: (levelIndex: number) => void;
  };
};

export const gameWithMusicWavesComponentFactory = ({
  audioService,
  midiSequenceLoader,
  prefabFactory,
  sceneState,
}: {
  audioService: AudioService;
  midiSequenceLoader: MusicSequenceLoader;
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
    Entity_GameWithMusicWaves,
    EntityInstance_GameWithWaves & EntityInstance_Game,
    EntityInstance_GameWithMusicWaves
  >()(() => {
    return {
      name: `gameWithMusicWaves`,
      addComponent: (entity, args: Entity_GameWithMusicWaves[`gameWithMusicWaves`]) => {
        return {
          ...entity,
          gameWithMusicWaves: {
            ...args,
          },
        };
      },
      setup: (entityInstance) => {
        const getActualEntityInstance = () =>
          sceneState.findEntityInstanceById(entityInstance.instanceId)! as unknown as typeof entityInstance &
            EntityInstanceUntyped;

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
          if (gameWithMusicWaves.menu) {
            gameWithMusicWaves.menu.enabled = true;
            return;
          }

          // hideMenu();

          const menu = prefabFactory.menu({
            position: [-0.1, 1, -0.5],
            items: songs.map((x, i) => ({
              text: x.name,
              action: `../gameWithMusicWaves.loadLevel(${i})` as EntityActionCode,
            })),
          });

          const menuInstance = sceneState.createEntityInstance(menu, getActualEntityInstance());

          gameWithMusicWaves.menu = menuInstance;
        };

        const hideMenu = () => {
          if (!gameWithMusicWaves.menu) {
            return;
          }
          gameWithMusicWaves.menu.enabled = false;

          // sceneState.destroyEntityInstance(gameWithMusicWaves.menu);
          // gameWithMusicWaves.menu = undefined;
        };

        const loadLevel = (levelIndex: number) => {
          const song = songs[levelIndex];
          wogger.log(`loadLevel`, { levelIndex, song, songs });

          if (!song) {
            return;
          }
          const actualEntityInstance = getActualEntityInstance();
          actualEntityInstance.gameWithWaves.setWaves(song.getWaves());
          actualEntityInstance.game.active = true;

          const musicId = Math.floor(musicList.length * Math.random());
          wogger.log(`loadLevel - playMuisc`, { musicList, musicId, audioService });
          audioService.playMusic(musicId);

          hideMenu();
        };

        const gameWithMusicWaves = {
          menu: undefined as undefined | EntityInstanceUntyped,
          showMenu,
          hideMenu,
          loadLevel,
        };

        entityInstance.game.active = false;
        return {
          ...entityInstance,
          gameWithMusicWaves,
        };
      },
      update: (entityInstance) => {
        //TODO: implement

        if (!entityInstance.game.active && !entityInstance.gameWithMusicWaves.menu?.enabled) {
          entityInstance.gameWithMusicWaves.showMenu();
        }
      },
    };
  });
