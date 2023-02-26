/* eslint-disable no-bitwise */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useController } from '@react-three/xr';
import { Vector3, XRHandJoints, XRHandSpace } from 'three';

export const useHandGesture = (filter: GestureBitFlag) => {
  const controllerL = useController(`left`);
  const controllerR = useController(`right`);

  const gestureResultL = useRef(createGestureResult());
  const gestureResultR = useRef(createGestureResult());

  useFrame(() => {
    calculateHandGesture(controllerL?.hand, filter, gestureResultL.current);
    calculateHandGesture(controllerR?.hand, filter, gestureResultR.current);
  });

  return {
    left: gestureResultL.current,
    right: gestureResultR.current,
  };
};

export enum GestureBitFlag {
  none = 0,
  handDirection = 1 << 0,
  pointing = 2 << 0,
  //   Mean = 1 << 1,
  //   Funny = 1 << 2,
  //   Boring = 1 << 3,
  //   All = ~(~0 << 4),
  all = 0xffffffff,
}

const createGestureResult = () => {
  return {
    _empty: new Vector3(),
    _joints: {} as Partial<XRHandJoints>,
    kind: 0,
    handDirection: {
      active: false,
      direction: new Vector3(),
      origin: new Vector3(),
      _directionDelta: new Vector3(),
      _originDelta: new Vector3(),
      _direction: new Vector3(),
      _origin: new Vector3(),
      _target: new Vector3(),
      _toTarget: new Vector3(),
    },
    pointing: {
      active: false,
      direction: new Vector3(),
      origin: new Vector3(),
      _directionDelta: new Vector3(),
      _originDelta: new Vector3(),
      _direction: new Vector3(),
      _origin: new Vector3(),
      _target: new Vector3(),
      _toMiddleTip: new Vector3(),
      _toIndexTip: new Vector3(),
      _toTarget: new Vector3(),
    },
  };
};
export type GestureResult = ReturnType<typeof createGestureResult>;

const resetGestureResult = (result: GestureResult, hand: XRHandSpace | undefined) => {
  result.kind = 0;
  // eslint-disable-next-line guard-for-in
  for (const k in result) {
    const o = result[k as keyof GestureResult] as { active?: boolean };
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

type SmoothDirection = { _directionDelta: Vector3; _direction: Vector3; direction: Vector3 };
const smoothDirection = (value: Vector3, g: SmoothDirection) => {
  g._direction.copy(value);
  g._directionDelta.copy(g._direction).sub(g.direction);

  const runningAverageFactorDirection = Math.min(1, 1.0 * g._directionDelta.length());
  g.direction
    .multiplyScalar(1 - runningAverageFactorDirection)
    .add(g._direction.multiplyScalar(runningAverageFactorDirection));
};

type SmoothOrigin = { _originDelta: Vector3; _origin: Vector3; origin: Vector3 };
const smoothOrigin = (value: Vector3, g: SmoothOrigin) => {
  g._origin.copy(value);
  g._originDelta.copy(g._origin).sub(g.origin);

  const runningAverageFactorOrigin = Math.min(1, 10.0 * g._originDelta.length());
  g.origin.multiplyScalar(1 - runningAverageFactorOrigin).add(g._origin.multiplyScalar(runningAverageFactorOrigin));
};

const calculateHandGesture = (hand: XRHandSpace | undefined, filter: GestureBitFlag, out: GestureResult) => {
  resetGestureResult(out, hand);
  const joints = out?._joints;
  if (!joints) {
    return out;
  }

  const wrist = joints.wrist;
  if (!wrist) {
    // disable if wrist is missing
    return out;
  }

  const empty = out._empty;

  if (filter & GestureBitFlag.handDirection) {
    const g = out.handDirection;

    const target0 = joints[`index-finger-phalanx-proximal`]?.position ?? empty;
    const target1 = joints[`middle-finger-phalanx-proximal`]?.position ?? empty;
    const target2 = joints[`ring-finger-phalanx-proximal`]?.position ?? empty;

    const origin0 = joints[`index-finger-metacarpal`]?.position ?? wrist.position;
    const origin1 = joints[`middle-finger-metacarpal`]?.position ?? wrist.position;
    const origin2 = joints[`ring-finger-metacarpal`]?.position ?? wrist.position;
    const origin3 = wrist.position;

    const target = g._target
      .copy(target0)
      .add(target1)
      .add(target2)
      .multiplyScalar(1 / 3);
    const origin = g._origin
      .copy(origin0)
      .add(origin1)
      .add(origin2)
      .add(origin3)
      .multiplyScalar(1 / 4);

    const toTarget = g._toTarget.copy(target).sub(origin);
    smoothDirection(toTarget, g);
    smoothOrigin(g._origin, g);

    g.active = true;
  }

  if (filter & GestureBitFlag.pointing) {
    const g = out.pointing;

    const target0 = joints[`index-finger-tip`]?.position ?? empty;
    const target1 = joints[`index-finger-phalanx-distal`]?.position ?? empty;
    const target2 = joints[`index-finger-phalanx-intermediate`]?.position ?? empty;

    const middleTip = joints[`middle-finger-tip`]?.position ?? empty;

    const origin0 = joints[`thumb-metacarpal`]?.position ?? wrist.position;
    const origin1 = joints[`index-finger-metacarpal`]?.position ?? wrist.position;
    const origin2 = joints[`middle-finger-metacarpal`]?.position ?? wrist.position;

    const target = g._target
      .copy(target0)
      .add(target1)
      .add(target2)
      .multiplyScalar(1 / 3);
    const origin = g._origin
      .copy(origin0)
      .add(origin1)
      .add(origin2)
      .multiplyScalar(1 / 3);

    const toMiddleTip = g._toMiddleTip.copy(middleTip).sub(origin);
    const toIndexTip = g._toIndexTip.copy(target0).sub(origin);
    // if the middle finger is closer to the wrist than the index finger tip by a factor
    const FACTOR = 2;
    g.active = toIndexTip.lengthSq() > toMiddleTip.lengthSq() * FACTOR * FACTOR;

    const toTarget = g._toTarget.copy(target).sub(origin);
    smoothDirection(toTarget, g);
    smoothOrigin(g._origin, g);
  }

  return out;
};
