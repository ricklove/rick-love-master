import { delay } from '@ricklove/utils-core';

export type MusicSequenceLoader = {
  getSongs: () => Promise<{ key: string; songName: string; difficulty: string }[]>;
  loadSong: (key: string) => Promise<MusicSequenceData>;
};

export type MusicSequenceData = {
  songName: string;
  musicFilePath: string;
  notes: {
    kind: number;
    timeBeforeSec: number;
  }[];
};

export const createMusicSequenceLoader = (rootPath: string = `/ddr`) => {
  const state = {
    loading: false,
    songs: undefined as
      | undefined
      | {
          key: string;
          songName: string;
          difficulty: string;
          songGameDataPath: string;
        }[],
  };
  const service = {
    getSongs: async () => {
      while (state.loading) {
        await delay(10);
      }

      if (state.songs) {
        return state.songs;
      }
      state.loading = true;

      const response = await fetch(`${rootPath}/game-data-index.json`);
      const songsDoc = (await response.json()) as GameDataIndexDocument;
      const songs = songsDoc.flatMap((songDoc) => {
        return songDoc.songs.flatMap((song) =>
          song.difficulties
            .filter((x) => x.startsWith(`single`))
            .map((d) => ({
              key: `${song.title}-${d}`,
              songName: song.title,
              difficulty: d.replace(`single-`, ``),
              songGameDataPath: `${rootPath}/${songDoc.pack}/${song.titleDir}/game-data.json`,
            })),
        );
      });

      // eslint-disable-next-line require-atomic-updates
      state.songs = songs;
      // eslint-disable-next-line require-atomic-updates
      state.loading = false;
      return songs;
    },
    loadSong: async (key: string) => {
      const songs = await service.getSongs();
      const songsPath = songs.find((x) => x.key === key)?.songGameDataPath;
      if (!songsPath) {
        throw new Error(`Song not found: ${key}`);
      }
      const response = await fetch(songsPath);
      const songDoc = (await response.json()) as GameDataSongDocument;
      const song: MusicSequenceData = {
        songName: songDoc.title,
        musicFilePath: `${rootPath}/${songDoc.packDirName}/${songDoc.titleDirName}/${songDoc.musicFileName}`,
        notes: songDoc.charts[0].notes.map((x, i) => ({
          kind: x.positions.reduce((acc, x) => acc + x.position + x.kind.charCodeAt(0), 0),
          timeBeforeSec: x.timeStart - songDoc.charts[0].notes[i - 1]?.timeStart || 0,
        })),
      };
      return song;
    },
  };

  return service;
};

type GameDataIndexDocument = {
  pack: string;
  songs: {
    title: string;
    titleDir: string;
    musicFileName: string;
    artist: string;
    image: string;
    displayBpm: string;
    minMeter: number;
    maxMeter: number;
    difficulties: string[];
  }[];
}[];

type GameDataSongDocument = {
  packDirName: string;
  titleDirName: string;
  title: string;
  musicFileName: string;
  jacketImageFileName: string;
  artist: string;
  displayBpm: string;
  availableTypes: {
    slug: string;
    mode: string;
    difficulty: string;
    meter: 5;
  }[];
  charts: {
    difficulty: string;
    bpmRanges: [
      {
        bpm: number;
        startBeat: number;
        startTime: number;
      },
    ];
    finalBeatTime: number;
    stops: [
      {
        beat: number;
        durationTime: number;
      },
    ];
    notesCode: string;
    notes: {
      positions: [
        {
          kind: SimFileNoteKind;
          position: number;
        },
      ];
      beat: number;
      duration: number;
      beatGap: number;
      timeStart: number;
    }[];
  }[];
};

enum SimFileNoteKind {
  Tap_1 = `T`,
  HoldHead_2 = `S`,
  HoldRollEnd_3 = `E`,
  RollHead_4 = `R`,
  Mine_M = `M`,
  Lift_L = `L`,
  Fake_F = `F`,
  AutoKeysound_K = `K`,
  Freeze = `Z`,
  Unknown = `U`,
}
