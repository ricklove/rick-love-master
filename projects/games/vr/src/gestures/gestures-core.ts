/* eslint-disable no-bitwise */
import { XRHandJoints, XRHandSpace, XRJointSpace } from 'three';

export const defineHandGesture = <
  TKey extends string,
  TResult extends Record<string, unknown>,
  TDeps extends Record<string, { optionsFilter: (o: Record<string, boolean>) => boolean }>,
>(definition: {
  key: TKey;
  deps?: TDeps;
  createResult: () => TResult;
  calculate: (
    hand: XRHandSpace | undefined,
    isRightHand: boolean,
    options: { [k in TKey]: boolean },
    joints: Partial<XRHandJoints>,
    wrist: XRJointSpace,
    out: ResultsOf<TDeps> & {
      [k in TKey]: TResult;
    },
  ) => void;
}) => {
  const key = definition.key;
  if (definition.deps) {
    Object.values(definition.deps).forEach((d) => {
      const orig = d.optionsFilter;
      d.optionsFilter = (o) => orig(o) || !!o[key];
    });
  }
  return {
    ...definition,
    optionsFilter: (o: Record<string, boolean>) => !!o[key],
  };
};

export type ResultsOf<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends { createResult: () => infer UResult } ? UResult : unknown;
};
export type OptionsOf<T extends Record<string, unknown>> = {
  [K in keyof T]: boolean;
};
