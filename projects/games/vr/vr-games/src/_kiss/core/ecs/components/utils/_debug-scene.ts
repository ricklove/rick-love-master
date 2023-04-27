import { wogger } from '../../../worker/wogger';

export type AbstractEcs = { _type: `AbstractEcs` };
export type AbstractEntityDesc = { _type: `AbstractEntityDesc` };
export type DebugSceneResult = {
  getPoints: () => {
    position: [number, number, number];
    color?: number;
    scale?: [number, number, number];
    text?: string;
  }[];
  actions?: {
    [name: string]: {
      execute: () => void;
      intervalTimeMs?: number;
    };
  };
};
type DebugSceneCreateProvider = (getResult: () => DebugSceneResult) => (ecs: AbstractEcs) => AbstractEntityDesc;

export const debugScene = {
  _create: undefined as undefined | DebugSceneCreateProvider,
  setup: (provider: DebugSceneCreateProvider) => {
    debugScene._create = provider;
  },
  create: <TInput extends Record<string, unknown>, TName extends string>({
    name,
    inputs,
    getResult,
  }: {
    name: TName;
    inputs: { [key: string]: TInput };
    getResult: (input: TInput) => DebugSceneResult;
  }) => {
    return {
      key: name,
      createScene: (
        runtimeArgs: AbstractEcs,
        params: { key: string; value: string }[],
        onParamsChanged: (params: { key: string; value: string }[]) => void,
      ) => {
        if (debugScene._create === undefined) {
          throw new Error(`debugScene not setup`);
        }
        const inputKey = params.find((x) => x.key === `input`)?.value;
        const inputsList = Object.values(inputs);
        const input = inputs[inputKey ?? `--empty--`] ?? inputsList[Number(inputKey)];

        wogger.log(`debugScene.createScene`, { name, inputKey, inputsList, input });

        if (!input && inputsList.length) {
          return debugScene._create(() => ({
            getPoints: () => [],
            actions: {
              _back: { execute: () => onParamsChanged([]) },
              ...Object.fromEntries(
                Object.entries(inputs).map(([key, value]) => [
                  key,
                  {
                    execute: () => {
                      onParamsChanged([
                        { key: `scene`, value: name },
                        { key: `input`, value: key },
                      ]);
                    },
                  },
                ]),
              ),
            },
          }))(runtimeArgs);
        }

        const result = getResult(input);
        result.actions = {
          _back: { execute: () => onParamsChanged([{ key: `scene`, value: name }]) },
          ...(result.actions ?? {}),
        };
        return debugScene._create(() => result)(runtimeArgs);
      },
    };
  },
};
