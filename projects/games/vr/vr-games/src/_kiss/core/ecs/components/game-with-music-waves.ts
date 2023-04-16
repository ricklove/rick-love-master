import { delay } from '@ricklove/utils-core';
import { musicList } from '../../audio/music-list';
import { wogger } from '../../worker/wogger';
import { AudioService } from '../audio-service';
import { BeatService } from '../beat-service';
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
    beatTimesMs: number[];
    iNextBeatTime: number;
    musicId: number;
    showMenu: () => void;
    hideMenu: () => void;
    loadLevel: (levelIndex: number) => void;
  };
};

export const gameWithMusicWavesComponentFactory = ({
  audioService,
  beatService,
  musicSequenceLoader,
  prefabFactory,
  sceneState,
}: {
  audioService: AudioService;
  beatService: BeatService;
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

        const timeToArriveOnBeatSec = 0;
        const timeToMoveExtraSec = 3.5;

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
          const loadTimeMs = 1000;
          const timeExactSongStartMs = Date.now() + timeToArriveOnBeatSec * 1000 + loadTimeMs;

          // while (songData.loading) {
          //   await delay(10);
          // }
          // if (songData.waves) {
          //   return {
          //     key: songData.key,
          //     title: songData.title,
          //     waves: songData.waves,
          //     beatTimesMs,
          //   };
          // }
          songData.loading = true;
          const songDataRaw = await musicSequenceLoader.loadSong(songData.key);
          const beatTimesMs = [] as number[];

          songDataRaw.bpmRanges.forEach((beatRange, i) => {
            const finalBeatTimeMs = (songDataRaw.bpmRanges[i + 1]?.startTime || songDataRaw.finalBeatTime) * 1000;
            const bpm = beatRange.bpm;
            const msPerBeat = 60000 / bpm;
            const lastBeatTimeMs = beatTimesMs[beatTimesMs.length - 1] || timeExactSongStartMs;
            let nextBeatTime = lastBeatTimeMs + msPerBeat;
            while (nextBeatTime < timeExactSongStartMs + finalBeatTimeMs) {
              beatTimesMs.push(nextBeatTime);
              nextBeatTime += msPerBeat;
            }
          });

          // songDataRaw.notes.forEach((x) => {
          //   const lastBeatTimeMs = beatTimesMs[beatTimesMs.length - 1] || timeExactSongStartMs;
          //   beatTimesMs.push(lastBeatTimeMs + x.timeBeforeSec * 1000);
          // });

          let timeExactSec = timeExactSongStartMs / 1000 - timeToArriveOnBeatSec;
          const waves: GameWave[] = songDataRaw.notes.map((x, i) => {
            const DOUBLE = true;
            if (!DOUBLE) {
              return {
                timeBeforeWaveSec: 0,
                sequence: [
                  {
                    ...getEnemyKind(x.kind, timeToArriveOnBeatSec + timeToMoveExtraSec, x.sameKindIndex, i),
                    timeBeforeSpawnSec: x.timeBeforeSec,
                    timeExactSpawnSec: (timeExactSec = timeExactSec + x.timeBeforeSec),
                    count: 1,
                  },
                ],
              };
            }
            return {
              timeBeforeWaveSec: 0,
              sequence: [
                {
                  ...getEnemyKind(x.kind, timeToArriveOnBeatSec + timeToMoveExtraSec, x.sameKindIndex * 2, i * 2),
                  timeBeforeSpawnSec: x.timeBeforeSec * 0.5,
                  timeExactSpawnSec: (timeExactSec = timeExactSec + x.timeBeforeSec),
                  count: 1,
                },
                {
                  ...getEnemyKind(
                    x.kind,
                    timeToArriveOnBeatSec + timeToMoveExtraSec,
                    x.sameKindIndex * 2 + 1,
                    i * 2 + 1,
                  ),
                  timeBeforeSpawnSec: x.timeBeforeSec * 0.5,
                  timeExactSpawnSec: (timeExactSec = timeExactSec + x.timeBeforeSec * 0.5),
                  count: 1,
                },
              ],
            };
          });

          // wogger.log(`timings`, {
          //   timeExactSongStartMs,
          //   firstSpawnArriveTimeMs: (timeToMoveSec + (waves[0]?.sequence[0]?.timeExactSpawnSec ?? 0)) * 1000,
          // });

          // eslint-disable-next-line require-atomic-updates
          songData.waves = waves;
          // eslint-disable-next-line require-atomic-updates
          songData.loading = false;
          return {
            key: songData.key,
            title: songData.title,
            waves,
            beatTimesMs,
            timeExactSongStartMs,
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

            gameWithMusicWaves.beatTimesMs = song.beatTimesMs;
            gameWithMusicWaves.iNextBeatTime = 0;
            gameWithMusicWaves.loading = false;
            gameWithMusicWaves.musicId = levelIndex;

            const musicId = levelIndex;
            wogger.log(`loadLevel - loadMusic`, { musicList, musicId, audioService });
            audioService.loadMusic(musicId);
          })();
        };

        const gameWithMusicWaves: EntityInstance_GameWithMusicWaves[`gameWithMusicWaves`] = {
          menu: undefined as undefined | EntityInstanceUntyped,
          loading: false,
          beatTimesMs: [] as number[],
          iNextBeatTime: 0,
          musicId: 0,
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
        if (
          !entityInstance.game.active &&
          !entityInstance.gameWithMusicWaves.menu?.enabled &&
          !entityInstance.gameWithMusicWaves.loading
        ) {
          entityInstance.gameWithMusicWaves.showMenu();
          return;
        }

        const g = entityInstance.gameWithMusicWaves;
        while (Date.now() > g.beatTimesMs[g.iNextBeatTime] ?? Number.MAX_SAFE_INTEGER) {
          if (g.iNextBeatTime === 0) {
            wogger.log(`loadLevel - playMusic`, { musicId: g.musicId });
            audioService.playMusic(g.musicId);
          }

          // wogger.log(`beat`, {
          //   now: Date.now(),
          //   nextBeatTime: g.beatTimesMs[g.iNextBeatTime],
          //   iNextBeatTime: g.iNextBeatTime,
          //   beatTimesMs: g.beatTimesMs,
          // });
          beatService.beat.next(g.iNextBeatTime);
          g.iNextBeatTime++;
        }
      },
    };
  });

const getEnemyKind = (kind: number, timeToMoveSec: number, sameKindIndex: number, index: number) => {
  const yTargetCenter = 1;
  const yTargetRadius = 0.8;
  const xTargetCenter = 0;
  const xTargetRadius = 1;
  const zTarget = 0;
  const xOffset = Math.sin((sameKindIndex * Math.PI * 2) / 11);
  const yOffset = Math.sin((sameKindIndex * Math.PI * 2) / 13);

  const xTarget = xTargetCenter + ((xTargetRadius * ((-3 + ((kind + 3) % 7)) / 3 + xOffset)) % 1);
  const yTarget = yTargetCenter + ((yTargetRadius * ((-1 + ((kind + 1) % 3)) / 1 + yOffset)) % 1);

  const xStart = -2 + ((2 + kind) % 5) + xOffset;
  const yStart = (kind % 3) + yOffset;
  const zStart = -25;

  const side = index % 2 === 0 ? `left` : `right`;
  // const rotation = [(Math.PI / 8) * kind, 0, (Math.PI / 5) * kind] as [number, number, number];
  const rotation = (side === `left` ? [0, 0, Math.PI * 0.3] : [0, 0, -Math.PI * 0.3]) as [number, number, number];

  return {
    spawnerName: `eggSpawner-${side}`,
    position: [xStart, yStart, zStart] as [number, number, number],
    rotation,
    action: `moveToTarget.setTarget([${xTarget}, ${yTarget}, ${zTarget}], ${timeToMoveSec})` as EntityActionCode,
  };
};
