export type MidiSequenceLoader = {
  getSongs: () => Promise<{ songName: string }[]>;
  loadSong: (songName: string) => Promise<MidiSequenceData>;
};

export type MidiSequenceData = {
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

export const createMidiSequenceLoader = (rootPath: string = `/midi`) => {
  return {
    getSongs: async () => {
      const response = await fetch(`${rootPath}/songList.json`);
      const songs = (await response.json()) as { songName: string }[];
      return songs;
    },
    loadSong: async (songName: string) => {
      const response = await fetch(`${rootPath}/${songName}.json`);
      const song = (await response.json()) as MidiSequenceData;
      return song;
    },
  };
};
