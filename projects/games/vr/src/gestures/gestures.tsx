/* eslint-disable no-bitwise */
import React, { createContext, useRef } from 'react';
import { useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { useController } from '@react-three/xr';
import { XRHandJoints, XRHandSpace } from 'three';
import { OptionsOf, ResultsOf } from './gestures-core';
import { gestures, handGestures } from './gestures-list';

export const GesturesProvider = ({ children, options }: { children: JSX.Element[]; options: GestureOptions }) => {
  const gestures = useGesturesInstance(options);
  return <gesturesContext.Provider value={gestures}>{children}</gesturesContext.Provider>;
};
export const useGestures = () => {
  return useContext(gesturesContext) as Gestures;
};

type Gestures = ReturnType<typeof useGesturesInstance>;
const gesturesContext = createContext<undefined | Gestures>(undefined);

const useGesturesInstance = (options: GestureOptions) => {
  const controllerL = useController(`left`);
  const controllerR = useController(`right`);

  const gestureResultL = useRef(createHandGestureResult());
  const gestureResultR = useRef(createHandGestureResult());

  useFrame(() => {
    calculateHandGestures(controllerL?.hand, false, options, gestureResultL.current);
    calculateHandGestures(controllerR?.hand, true, options, gestureResultR.current);
  });

  return {
    left: gestureResultL.current,
    right: gestureResultR.current,
  };
};

// Gestures

const handGesturesArray = [...Object.values(handGestures)];
type Clean<T> = {} & {
  [K in keyof T]: T[K];
};

export type GestureOptions = Clean<OptionsOf<typeof gestures>>;
export const GestureOptions = {
  all: Object.fromEntries([...Object.keys(gestures)].map((k) => [k, true])) as GestureOptions,
};

const createHandGestureResult = () => {
  const createResults = <T extends Record<string, { createResult: () => unknown }>>(g: T): ResultsOf<T> => {
    return Object.fromEntries([...Object.entries(g)].map(([k, v]) => [k, v.createResult()])) as ResultsOf<T>;
  };

  return {
    _joints: {} as Partial<XRHandJoints>,
    kind: 0,
    ...createResults(handGestures),
  };
};
export type HandGestureResult = ReturnType<typeof createHandGestureResult>;

const resetHandGestureResult = (result: HandGestureResult, hand: XRHandSpace | undefined) => {
  result.kind = 0;
  // eslint-disable-next-line guard-for-in
  for (const k in result) {
    const o = result[k as keyof HandGestureResult] as { active?: boolean };
    if (!o?.active) {
      continue;
    }
    o.active = false;
  }

  // setup joints - keep last joint obj in case it is temporarily lost
  const joints = hand?.joints;
  if (!joints) {
    return;
  }
  // eslint-disable-next-line guard-for-in
  for (const kRaw in joints) {
    const k = kRaw as keyof typeof joints;
    const v = joints[k];
    if (!v) {
      return;
    }
    result._joints[k] = v;
  }
};

const calculateHandGestures = (
  hand: XRHandSpace | undefined,
  isRightHand: boolean,
  options: GestureOptions,
  out: HandGestureResult,
) => {
  resetHandGestureResult(out, hand);
  const joints = out?._joints;
  if (!joints) {
    return out;
  }

  const wrist = joints.wrist;
  if (!wrist) {
    // disable if wrist is missing
    return out;
  }

  for (const g of handGesturesArray) {
    if (g.optionsFilter(options)) {
      g.calculate(hand, isRightHand, options, joints, wrist, out);
    }
  }
  return out;
};
