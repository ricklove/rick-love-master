/* eslint-disable no-bitwise */
import React, { createContext, useRef } from 'react';
import { useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { useController } from '@react-three/xr';
import { Object3D, Vector3, XRHandJoints, XRHandSpace } from 'three';
import { useCamera, usePlayer } from '../components/camera';
import { OptionsOf, ResultsOf } from './gestures-core';
import { bodyGestures, gestures, handGestures } from './gestures-list';

export const GesturesProvider = ({ children, options }: { children: JSX.Element[]; options: GestureOptions }) => {
  const gestures = useGesturesInstance(options);
  return <gesturesContext.Provider value={gestures}>{children}</gesturesContext.Provider>;
};
export const useGestures = () => {
  return useContext(gesturesContext) as Gestures;
};

export type Gestures = ReturnType<typeof useGesturesInstance>;
const gesturesContext = createContext<undefined | Gestures>(undefined);

const useGesturesInstance = (options: GestureOptions) => {
  const camera = useCamera();
  const player = usePlayer();
  const _headPos = useRef(new Vector3());
  const controllerL = useController(`left`);
  const controllerR = useController(`right`);

  const gestureResultL = useRef(createHandGestureResult());
  const gestureResultR = useRef(createHandGestureResult());
  const gestureResultBody = useRef(createBodyGestureResult());

  useFrame(() => {
    calculateHandGestures(controllerL?.hand, false, options, gestureResultL.current);
    calculateHandGestures(controllerR?.hand, true, options, gestureResultR.current);
    calculateBodyGestures(
      {
        position: camera.position,
        rotation: camera.rotation,
        quaternion: camera.quaternion,
      },
      controllerR?.hand,
      controllerR?.hand,
      options,
      gestureResultL.current,
      gestureResultR.current,
      gestureResultBody.current,
    );
  });

  return {
    left: gestureResultL.current,
    right: gestureResultR.current,
    body: gestureResultBody.current,
  };
};

// Gestures

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
    active: false,
    _wristPosition: new Vector3(),
    _joints: {} as Partial<XRHandJoints>,
    ...createResults(handGestures),
  };
};
export type HandGestureResult = ReturnType<typeof createHandGestureResult>;

const resetHandGestureResult = (result: HandGestureResult, hand: XRHandSpace | undefined) => {
  // result.active = false;

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

const handGesturesArray = [...Object.values(handGestures)];
const calculateHandGestures = (
  hand: XRHandSpace | undefined,
  isRightHand: boolean,
  options: GestureOptions,
  out: HandGestureResult,
) => {
  const wrist = hand?.joints.wrist;
  if (!wrist) {
    // disable if wrist is missing
    return out;
  }

  // detect if hand is out of view
  const hasMoved = !wrist.position.equals(out._wristPosition);
  out._wristPosition.copy(wrist.position);

  // Deactivate hand, but leave previous hand gesture results intact
  out.active = hasMoved;

  if (!out.active) {
    return out;
  }

  // Reset hand
  resetHandGestureResult(out, hand);
  const joints = out?._joints;
  if (!joints) {
    return out;
  }

  // Calculate gestures
  for (const g of handGesturesArray) {
    if (g.optionsFilter(options)) {
      g.calculate(hand, isRightHand, options, joints, wrist, out);
    }
  }
  return out;
};

const createBodyGestureResult = () => {
  const createResults = <T extends Record<string, { createResult: () => unknown }>>(g: T): ResultsOf<T> => {
    return Object.fromEntries([...Object.entries(g)].map(([k, v]) => [k, v.createResult()])) as ResultsOf<T>;
  };

  return {
    ...createResults(bodyGestures),
  };
};
export type BodyGestureResult = ReturnType<typeof createBodyGestureResult>;

const resetBodyGestureResult = (result: BodyGestureResult) => {
  // eslint-disable-next-line guard-for-in
  for (const k in result) {
    const o = result[k as keyof BodyGestureResult] as { active?: boolean };
    if (!o?.active) {
      continue;
    }
    o.active = false;
  }
};

const bodyGesturesArray = [...Object.values(bodyGestures)];
const calculateBodyGestures = (
  head: Pick<Object3D, `position` | `rotation` | `quaternion`>,
  handLeft: XRHandSpace | undefined,
  handRight: XRHandSpace | undefined,
  options: GestureOptions,
  leftResult: HandGestureResult,
  rightResult: HandGestureResult,
  out: BodyGestureResult,
) => {
  resetBodyGestureResult(out);

  for (const g of bodyGesturesArray) {
    if (g.optionsFilter(options)) {
      g.calculate(head, handLeft, handRight, options, leftResult, rightResult, out);
    }
  }
  return out;
};
