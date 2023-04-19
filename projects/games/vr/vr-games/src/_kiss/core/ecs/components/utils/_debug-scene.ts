type RuntimeEcs = unknown;
type DebugSceneCreateProvider = (
  getPoints: () => {
    points: {
      position: [number, number, number];
      color?: number;
      scale?: [number, number, number];
    }[];
  },
) => (ecs: RuntimeEcs) => unknown;

export const debugScene = {
  _create: undefined as undefined | DebugSceneCreateProvider,
  setup: (provider: DebugSceneCreateProvider) => {
    debugScene._create = provider;
  },
  create: (
    getPoints: () => {
      points: {
        position: [number, number, number];
        color?: number;
        scale?: [number, number, number];
      }[];
    },
  ) => {
    return (runtimeArgs: RuntimeEcs) => {
      if (debugScene._create === undefined) {
        throw new Error(`debugScene not setup`);
      }
      return debugScene._create(getPoints)(runtimeArgs);
    };
  },
};
