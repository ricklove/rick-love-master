export type AbstractEcs = { _type: `AbstractEcs` };
export type AbstractEntityDesc = { _type: `AbstractEntityDesc` };
type DebugSceneCreateProvider = (
  getPoints: () => {
    points: {
      position: [number, number, number];
      color?: number;
      scale?: [number, number, number];
    }[];
  },
) => (ecs: AbstractEcs) => AbstractEntityDesc;

export const debugScene = {
  _create: undefined as undefined | DebugSceneCreateProvider,
  setup: (provider: DebugSceneCreateProvider) => {
    debugScene._create = provider;
  },
  create: <TInput extends Record<string, unknown>, TName extends string>({
    name,
    inputs,
    getPoints,
  }: {
    name: TName;
    inputs: { [key: string]: TInput };
    getPoints: (input: TInput) => {
      points: {
        position: [number, number, number];
        color?: number;
        scale?: [number, number, number];
      }[];
    };
  }) => {
    return {
      key: name,
      createScene: (runtimeArgs: AbstractEcs, params: { key: string; value: string }[]) => {
        if (debugScene._create === undefined) {
          throw new Error(`debugScene not setup`);
        }
        const inputKey = params.find((x) => x.key === `input`)?.value ?? 0;
        const inputsList = Object.values(inputs);
        const input = inputs[inputKey] ?? inputsList[Number(inputKey)] ?? inputsList[0];
        const points = getPoints(input);
        return debugScene._create(() => points)(runtimeArgs);
      },
    };
  },
};
