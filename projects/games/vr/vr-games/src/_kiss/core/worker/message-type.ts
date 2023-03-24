export type WorkerMessageToWorker =
  | {
      kind: `setup`;
    }
  | {
      kind: `dispose`;
    }
  | {
      kind: `ping`;
      time: number;
    };

export type WorkerMessageFromWorker = {
  kind: `pong`;
  time: number;
  timeActual: number;
  pingTime: number;
  timeOffset: number;
};
