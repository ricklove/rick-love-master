import { postMessageFromWorker } from '../messages/message';
import { wogger } from '../worker/wogger';

export type AudioService = {
  loadMusic: (id: number) => void;
  playMusic: (id: number) => void;
};

// Batch everything until requestUpdateMessage
export const createAudioService = (): AudioService => {
  return {
    loadMusic: (musicId: number) => {
      postMessageFromWorker({
        kind: `loadMusic`,
        musicId,
      });
    },
    playMusic: (musicId: number) => {
      wogger.log(`playMusic`, musicId);
      postMessageFromWorker({
        kind: `playMusic`,
        musicId,
      });
    },
  };
};
