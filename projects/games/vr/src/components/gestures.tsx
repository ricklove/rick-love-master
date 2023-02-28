/* eslint-disable no-bitwise */
import React, { createContext, useRef } from 'react';
import { useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { useController } from '@react-three/xr';
import { Matrix4, Vector3, XRHandJoints, XRHandSpace, XRJointSpace } from 'three';

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

const createDirectionAndOrigin = () => ({
  position: new Vector3(),
  _positionSmoothing: createSmoothValues(10),
  direction: new Vector3(),
  _directionSmoothing: createSmoothValues(0.15),
  rotation: new Matrix4(),
});

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

const createSmoothValues = (runningAverageBase: number) => {
  return {
    _runningAverageBase: runningAverageBase,
    _delta: new Vector3(),
    _keep: new Vector3(),
    out: new Vector3(),
  };
};
type SmoothValues = ReturnType<typeof createSmoothValues>;

const smoothValue = (value: Vector3, g: SmoothValues): Vector3 => {
  // return g.out.copy(value);
  const originDelta = g._delta.copy(value).sub(g.out);
  const runningAverageFactorOrigin = Math.min(1, g._runningAverageBase * originDelta.length());

  const keep = g._keep.copy(g.out).multiplyScalar(1 - runningAverageFactorOrigin);
  return g.out.copy(value).multiplyScalar(runningAverageFactorOrigin).add(keep);
};

const empty = new Vector3(0, 0, 0);
const up = new Vector3(0, 1, 0);

const calculateRotation = (g: { direction: Vector3; rotation: Matrix4 }) => {
  g.rotation.lookAt(empty, g.direction, up);
};

const defineHandGesture = <
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

type ResultsOf<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends { createResult: () => infer UResult } ? UResult : unknown;
};
type OptionsOf<T extends Record<string, unknown>> = {
  [K in keyof T]: boolean;
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

// Gestures
const pointingHand = defineHandGesture({
  key: `pointingHand`,
  createResult: () => {
    return {
      active: false,
      ...createDirectionAndOrigin(),
      _proximalAverage: new Vector3(),
      _wristMetacarpalAverage: new Vector3(),
      _wristToProximal: new Vector3(),
      _handForwardDirection: new Vector3(),
      _handUpDirection: new Vector3(),
      _handPalmDirection: new Vector3(),
      _directionAdjustment: new Vector3(),
      _handPointDirection: new Vector3(),
      _ringToIndex: new Vector3(),
    };
  },
  calculate: (hand, isRightHand, options, joints, wrist, out) => {
    const g = out.pointingHand;

    const indeProx = joints[`index-finger-phalanx-proximal`]?.position ?? empty;
    const middProx = joints[`middle-finger-phalanx-proximal`]?.position ?? empty;
    const ringProx = joints[`ring-finger-phalanx-proximal`]?.position ?? empty;
    const pinkProx = joints[`pinky-finger-phalanx-proximal`]?.position ?? empty;

    const indeMeta = joints[`index-finger-metacarpal`]?.position ?? wrist.position;
    const middMeta = joints[`middle-finger-metacarpal`]?.position ?? wrist.position;
    const ringMeta = joints[`ring-finger-metacarpal`]?.position ?? wrist.position;
    const wristPos = wrist.position;

    const proximalAverage = g._proximalAverage
      .copy(indeProx)
      .add(middProx)
      .add(ringProx)
      .add(pinkProx)
      .multiplyScalar(1 / 4);
    const wristMetacarpalAverage = g._wristMetacarpalAverage
      .copy(indeMeta)
      .add(middMeta)
      .add(ringMeta)
      .add(wristPos)
      .multiplyScalar(1 / 4);

    const wristToProximal = g._wristToProximal.copy(proximalAverage).sub(wristMetacarpalAverage);
    const handForwardDirection = g._handForwardDirection.copy(wristToProximal).normalize();

    const ringToIndex = g._ringToIndex
      .copy(indeProx)
      .sub(ringProx)
      .add(indeMeta)
      .sub(ringMeta)
      .multiplyScalar(1 / 2);
    const handUpDirection = g._handUpDirection.copy(ringToIndex).normalize();

    // Already normalized
    const handPalmDirection = isRightHand
      ? g._handPalmDirection.copy(handUpDirection).cross(handForwardDirection)
      : g._handPalmDirection.copy(handForwardDirection).cross(handUpDirection);

    // Adjust direction to center
    const directionAdjustment = g._directionAdjustment.copy(handPalmDirection).multiplyScalar(0.2);
    const handPointDirection = g._handPointDirection.copy(handForwardDirection).add(directionAdjustment).normalize();

    g.active = true;
    g.position.copy(smoothValue(wristMetacarpalAverage, g._positionSmoothing));
    g.direction.copy(smoothValue(handPointDirection, g._directionSmoothing));
    calculateRotation(g);
  },
});

const pointingGun = defineHandGesture({
  key: `pointingGun`,
  deps: {
    pointingHand,
  },
  createResult: () => {
    return {
      active: false,
      ...createDirectionAndOrigin(),
      _gunOrigin: new Vector3(),
      _gunUpAdjustment: new Vector3(),
      _gunForwardAdjustment: new Vector3(),
    };
  },
  calculate: (hand, isRightHand, options, joints, wrist, out) => {
    const g = out.pointingGun;
    const h = out.pointingHand;

    // Adjust origin
    const gunUpAdjustment = g._gunUpAdjustment.copy(h._ringToIndex).multiplyScalar(1.5);
    const gunForwardAdjustment = g._gunForwardAdjustment
      .copy(h._wristToProximal)
      .multiplyScalar(1.0)
      .projectOnVector(h._handPointDirection);
    const gunOrigin = g._gunOrigin.copy(h._wristMetacarpalAverage).add(gunUpAdjustment).add(gunForwardAdjustment);

    g.active = true;
    g.position.copy(smoothValue(gunOrigin, g._positionSmoothing));
    g.direction.copy(h.direction);
    calculateRotation(g);
  },
});

const pointingIndexFinger = defineHandGesture({
  key: `pointingIndexFinger`,
  deps: {
    pointingHand,
  },
  createResult: () => {
    return {
      active: false,
      ...createDirectionAndOrigin(),
      _target: new Vector3(),
      _toMiddleTip: new Vector3(),
      _toIndexTip: new Vector3(),
      _origin: new Vector3(),
      _originUpAdjustment: new Vector3(),
      _toTargetDirection: new Vector3(),
    };
  },
  calculate: (hand, isRightHand, options, joints, wrist, out) => {
    const g = out.pointingIndexFinger;
    const h = out.pointingHand;

    const indeTip = joints[`index-finger-tip`]?.position ?? empty;
    const indeDist = joints[`index-finger-phalanx-distal`]?.position ?? empty;
    const indeInte = joints[`index-finger-phalanx-intermediate`]?.position ?? empty;

    const middTip = joints[`middle-finger-tip`]?.position ?? empty;

    const target = g._target
      .copy(indeTip)
      .add(indeDist)
      .add(indeInte)
      .multiplyScalar(1 / 3);

    const originUpAdjustment = g._originUpAdjustment.copy(h._ringToIndex).multiplyScalar(1.0);
    const origin = g._origin.copy(h._wristMetacarpalAverage).add(originUpAdjustment);

    const toMiddleTip = g._toMiddleTip.copy(middTip).sub(origin);
    const toIndexTip = g._toIndexTip.copy(indeTip).sub(origin);
    // if the middle finger is closer to the wrist than the index finger tip by a factor
    const FACTOR = 2;
    g.active = toIndexTip.lengthSq() > toMiddleTip.lengthSq() * FACTOR * FACTOR;

    const toTargetDirection = g._toTargetDirection.copy(target).sub(origin).normalize();
    g.direction.copy(smoothValue(toTargetDirection, g._directionSmoothing));
    g.position.copy(indeTip);
    calculateRotation(g);
  },
});

const pointingWand = defineHandGesture({
  key: `pointingWand`,
  deps: {
    pointingHand,
  },
  createResult: () => {
    return {
      active: false,
      ...createDirectionAndOrigin(),
      _target: new Vector3(),
      _toMiddleTip: new Vector3(),
      _toIndexTip: new Vector3(),
      _origin: new Vector3(),
      _targetAdjustment: new Vector3(),
      _originAdjustment: new Vector3(),
      _toTargetDirection: new Vector3(),
    };
  },
  calculate: (hand, isRightHand, options, joints, wrist, out) => {
    const g = out.pointingWand;
    const h = out.pointingHand;

    const indeTip = joints[`index-finger-tip`]?.position ?? empty;
    const indeDist = joints[`index-finger-phalanx-distal`]?.position ?? empty;
    const indeInte = joints[`index-finger-phalanx-intermediate`]?.position ?? empty;

    const middTip = joints[`middle-finger-tip`]?.position ?? empty;

    const targetAdjustment = g._targetAdjustment.copy(h._ringToIndex).multiplyScalar(-0.2);

    const target = g._target
      .copy(indeTip)
      .add(indeDist)
      .add(indeInte)
      .multiplyScalar(1 / 3)
      .add(targetAdjustment);

    const originAdjustment = g._originAdjustment.copy(h._ringToIndex).multiplyScalar(-0.2);
    const origin = g._origin.copy(h._wristMetacarpalAverage).add(originAdjustment);

    const toMiddleTip = g._toMiddleTip.copy(middTip).sub(origin);
    const toIndexTip = g._toIndexTip.copy(indeTip).sub(origin);
    // if the middle finger is closer to the wrist than the index finger tip by a factor
    const FACTOR = 2;
    g.active = toIndexTip.lengthSq() > toMiddleTip.lengthSq() * FACTOR * FACTOR;

    const toTargetDirection = g._toTargetDirection.copy(target).sub(origin).normalize();
    g.direction.copy(smoothValue(toTargetDirection, g._directionSmoothing));
    g.position.copy(origin);
    calculateRotation(g);
  },
});

const handGestures = {
  pointingHand,
  pointingGun,
  pointingIndexFinger,
  pointingWand,
};
const handGesturesArray = [...Object.values(handGestures)];
type Clean<T> = {} & {
  [K in keyof T]: T[K];
};

const gestures = {
  ...handGestures,
};
export type GestureOptions = Clean<OptionsOf<typeof gestures>>;
export const GestureOptions = {
  all: Object.fromEntries([...Object.keys(gestures)].map((k) => [k, true])) as GestureOptions,
};
