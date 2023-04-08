export type MusicSequenceLoader = {
  getSongs: () => Promise<{ songName: string }[]>;
  loadSong: (songName: string) => Promise<MusicSequenceData>;
};

export type MusicSequenceData = {
  songName: string;
  bpm: number;
  tracks: {
    notes: {
      time: number;
      duration: number;
      pitch: number;
      velocity: number;
    }[];
  }[];
};

export const createMusicSequenceLoader = (rootPath: string = `/midi`) => {
  return {
    getSongs: async () => {
      const response = await fetch(`${rootPath}/songList.json`);
      const songs = (await response.json()) as { songName: string }[];
      return songs;
    },
    loadSong: async (songName: string) => {
      const response = await fetch(`${rootPath}/${songName}.json`);
      const song = (await response.json()) as MusicSequenceData;
      return song;
    },
  };
};
