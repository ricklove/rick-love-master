import { delay } from '@ricklove/utils-core';
import { musicList } from '../../audio/music-list';
import { wogger } from '../../worker/wogger';
import { AudioService } from '../audio-service';
import { createComponentFactory } from '../ecs-component-factory';
import { EcsSceneState, EntityDescUntyped, EntityInstanceUntyped } from '../ecs-engine';
import { EntityActionCode } from './actions/parser';
import { Entity_Game, EntityInstance_Game } from './game';
import { Entity_GameWithWaves, EntityInstance_GameWithWaves, GameWave } from './game-with-waves';
import { MusicSequenceLoader } from './music-sequence-loader';

export type Entity_GameWithMusicWaves = {
  gameWithMusicWaves: {};
};

export type EntityInstance_GameWithMusicWaves = {
  gameWithMusicWaves: {
    menu?: EntityInstanceUntyped;
    loading: boolean;
    showMenu: () => void;
    hideMenu: () => void;
    loadLevel: (levelIndex: number) => void;
  };
};

export const gameWithMusicWavesComponentFactory = ({
  audioService,
  musicSequenceLoader,
  prefabFactory,
  sceneState,
}: {
  audioService: AudioService;
  musicSequenceLoader: MusicSequenceLoader;
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

        const timeToMoveSec = 3.5;

        // load songs
        const songsIndexState = {
          loading: false,
          songs: undefined as
            | undefined
            | {
                key: string;
                title: string;
                loading: boolean;
                waves?: GameWave[];
              }[],
        };
        const getOrLoadSongs = async () => {
          while (songsIndexState.loading) {
            await delay(10);
          }
          if (songsIndexState.songs) {
            return songsIndexState.songs;
          }
          songsIndexState.loading = true;
          const songs = await musicSequenceLoader.getSongs();
          // eslint-disable-next-line require-atomic-updates
          songsIndexState.songs = songs.map((x) => ({
            key: x.key,
            title: `${x.songName} - ${x.difficulty}`,
            loading: false,
            waves: undefined,
          }));
          // eslint-disable-next-line require-atomic-updates
          songsIndexState.loading = false;
          return songsIndexState.songs;
        };
        const getOrLoadSong = async (index: number) => {
          const songData = (await getOrLoadSongs())[index];

          while (songData.loading) {
            await delay(10);
          }
          if (songData.waves) {
            return {
              key: songData.key,
              title: songData.title,
              waves: songData.waves,
            };
          }
          songData.loading = true;
          const songDataRaw = await musicSequenceLoader.loadSong(songData.key);
          const waves: GameWave[] = songDataRaw.notes.map((x) => ({
            timeBeforeWaveSec: x.timeBeforeSec,
            sequence: [
              {
                ...getEnemyKind(x.kind, timeToMoveSec, x.sameKindIndex),
                timeBeforeSpawnSec: 0,
                count: 1,
              },
            ],
          }));

          // eslint-disable-next-line require-atomic-updates
          songData.waves = waves;
          // eslint-disable-next-line require-atomic-updates
          songData.loading = false;
          return {
            key: songData.key,
            title: songData.title,
            waves,
          };
        };

        // const songs = [`MW`, `g`, `n`, `Song-8`, `Song-9`, `Song-10`].map((song, i) => ({
        //   name: song,
        //   getWaves: () =>
        //     [
        //       {
        //         sequence: [
        //           {
        //             spawnerName: `eggSpawner`,
        //             count: i + 1,
        //             position: [2, 1, -25],
        //             action: `moveToTarget.setTarget([-1, 1, 0], 6)`,
        //             timeBeforeSpawnSec: 1,
        //           },
        //           {
        //             spawnerName: `eggSpawner`,
        //             count: i + 1,
        //             position: [-2, 1, -15],
        //             action: `moveToTarget.setTarget([1, 1, 0], 3)`,
        //             timeBeforeSpawnSec: 1,
        //           },
        //           {
        //             spawnerName: `eggSpawner`,
        //             count: i + 1,
        //             position: [0, 0, -25],
        //             action: `moveToTarget.setTarget([0, 0, 0], 6)`,
        //             timeBeforeSpawnSec: 1,
        //           },
        //         ],
        //         timeBeforeWaveSec: 3,
        //       },
        //     ] as GameWave[],
        // }));

        const showMenu = () => {
          if (gameWithMusicWaves.menu) {
            gameWithMusicWaves.menu.enabled = true;
            return;
          }

          gameWithMusicWaves.loading = true;
          // TODO: show loading

          setTimeout(() => {
            (async () => {
              const songs = await getOrLoadSongs();
              const menu = prefabFactory.menu({
                position: [-0.1, 1, -0.5],
                items: songs
                  // TEMP
                  .slice(0, 20)
                  .map((x, i) => ({
                    text: x.title,
                    action: `../gameWithMusicWaves.loadLevel(${i})` as EntityActionCode,
                  })),
              });

              const menuInstance = sceneState.createEntityInstance(menu, getActualEntityInstance());

              gameWithMusicWaves.menu = menuInstance;
              gameWithMusicWaves.loading = false;
            })();
          }, 100);
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
          gameWithMusicWaves.loading = true;
          hideMenu();
          // TODO: show loading

          (async () => {
            const song = await getOrLoadSong(levelIndex);
            wogger.log(`loadLevel`, { levelIndex, song });

            if (!song) {
              return;
            }
            const actualEntityInstance = getActualEntityInstance();
            // TODO: make sure waves stay in sync with music
            actualEntityInstance.gameWithWaves.setWaves(song.waves);
            actualEntityInstance.game.active = true;
            gameWithMusicWaves.loading = false;

            const musicId = levelIndex;
            wogger.log(`loadLevel - loadMusic`, { musicList, musicId, audioService });
            audioService.loadMusic(musicId);

            setTimeout(() => {
              wogger.log(`loadLevel - playMusic`, { musicList, musicId, audioService });
              audioService.playMusic(musicId);
            }, (timeToMoveSec - 0.5) * 1000);
          })();
        };

        const gameWithMusicWaves = {
          menu: undefined as undefined | EntityInstanceUntyped,
          loading: false,
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

        if (
          !entityInstance.game.active &&
          !entityInstance.gameWithMusicWaves.menu?.enabled &&
          !entityInstance.gameWithMusicWaves.loading
        ) {
          entityInstance.gameWithMusicWaves.showMenu();
        }
      },
    };
  });

const getEnemyKind = (kind: number, timeToMoveSec: number, sameKindIndex: number) => {
  const yTargetCenter = 1;
  const yTargetRadius = 0.5;
  const xTargetCenter = 0;
  const xTargetRadius = 0.5;
  const xOffset = Math.sin((sameKindIndex * Math.PI * 2) / 11);
  const yOffset = Math.sin((sameKindIndex * Math.PI * 2) / 13);

  const xTarget = xTargetCenter + ((xTargetRadius * ((-3 + ((kind + 3) % 7)) / 3 + xOffset)) % 1);
  const yTarget = yTargetCenter + ((yTargetRadius * ((-1 + ((kind + 1) % 3)) / 1 + yOffset)) % 1);

  const xStart = -2 + ((2 + kind) % 5) + xOffset;
  const yStart = (kind % 3) + yOffset;
  const zStart = -25;

  return {
    spawnerName: `eggSpawner`,
    position: [xStart, yStart, zStart] as [number, number, number],
    action: `moveToTarget.setTarget([${xTarget}, ${yTarget}, 0], ${timeToMoveSec})` as EntityActionCode,
  };
};
