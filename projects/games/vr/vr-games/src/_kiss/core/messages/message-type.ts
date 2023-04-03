export enum MessageBufferKind {
  returnedBuffer = 0,
  userInputTransforms,
  sceneObjectTransforms,
}

export type WorkerMessageToWorker =
  | ArrayBuffer
  | {
      kind: `setup`;
    }
  | {
      kind: `dispose`;
    }
  | {
      kind: `frameSync`;
      time: number;
    }
  | {
      kind: `ping`;
      time: number;
    };

export type WorkerMessageFromWorker =
  | ArrayBuffer
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
        id: number;
        position: [number, number, number];
        quaternion: [number, number, number, number];
        scale: [number, number, number];
        color: number;
      }[];
      spheres: {
        id: number;
        position: [number, number, number];
        radius: number;
        color: number;
      }[];
    }
  | {
      kind: `removeObjects`;
      objectIds: number[];
    }
  | {
      kind: `updateObjects`;
      boxes: {
        id: number;
        position: [number, number, number];
        quaternion: [number, number, number, number];
        scale: [number, number, number];
      }[];
      spheres: {
        id: number;
        position: [number, number, number];
        radius: number;
      }[];
    };

// export type WorkerMessageFromWorkerKind<TKind extends WorkerMessageFromWorker[`kind`]> = Extract<
//   WorkerMessageFromWorker,
//   { kind: TKind }
// >;

// type _Test = WorkerMessageFromWorkerKind<`pong`>;
