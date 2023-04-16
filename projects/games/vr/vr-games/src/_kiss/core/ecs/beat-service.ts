import { Subject } from 'rxjs';

export type BeatService = {
  beat: Subject<number>;
};

export const createBeatService = (): BeatService => {
  return {
    beat: new Subject(),
  };
};
