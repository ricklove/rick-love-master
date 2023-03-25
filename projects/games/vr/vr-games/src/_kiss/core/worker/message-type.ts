export type WorkerMessageToWorker =
  | ArrayBuffer
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

export type WorkerMessageFromWorker =
  | {
      kind: `pong`;
      time: number;
      timeActual: number;
      pingTime: number;
      timeOffset: number;
    }
  | {
      kind: `addObjects`;
      boxes: {
        key: string;
        position: [number, number, number];
        quaternion: [number, number, number, number];
        scale: [number, number, number];
      }[];
      spheres: {
        key: string;
        position: [number, number, number];
        radius: number;
      }[];
    }
  | {
      kind: `updateObjects`;
      boxes: {
        key: string;
        position: [number, number, number];
        quaternion: [number, number, number, number];
        scale: [number, number, number];
      }[];
      spheres: {
        key: string;
        position: [number, number, number];
        radius: number;
      }[];
    };
