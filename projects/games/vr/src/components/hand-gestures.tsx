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
  pointing = 1 << 0,
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
    pointing: {
      active: false,
      direction: new Vector3(),
      origin: new Vector3(),
      _directionDelta: new Vector3(),
      _originDelta: new Vector3(),
      _direction: new Vector3(),
      _origin: new Vector3(),
      _indexTarget: new Vector3(),
      _pointingOrigin: new Vector3(),
      _toMiddleTip: new Vector3(),
      _toIndexTip: new Vector3(),
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
    o.active = true;
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

const calculateHandGesture = (hand: XRHandSpace | undefined, filter: GestureBitFlag, out: GestureResult) => {
  resetGestureResult(out, hand);
  const joints = out?._joints;
  if (!joints) {
    3;
    return out;
  }

  const wrist = joints.wrist;
  if (!wrist) {
    // disable if wrist is missing
    return out;
  }

  const empty = out._empty;

  if (filter & GestureBitFlag.pointing) {
    const indexTarget0 = joints[`index-finger-tip`]?.position ?? empty;
    const indexTarget1 = joints[`index-finger-phalanx-distal`]?.position ?? empty;
    const indexTarget2 = joints[`index-finger-phalanx-intermediate`]?.position ?? empty;

    const middleTip = joints[`middle-finger-tip`]?.position ?? empty;

    const pointingOrigin0 = joints[`thumb-metacarpal`]?.position ?? wrist.position;
    const pointingOrigin1 = joints[`index-finger-metacarpal`]?.position ?? wrist.position;
    const pointingOrigin2 = joints[`middle-finger-metacarpal`]?.position ?? wrist.position;

    const pointing = out.pointing;

    const indexTarget = pointing._indexTarget
      .copy(indexTarget0)
      .add(indexTarget1)
      .add(indexTarget2)
      .multiplyScalar(1 / 3);
    const pointingOrigin = pointing._pointingOrigin
      .copy(pointingOrigin0)
      .add(pointingOrigin1)
      .add(pointingOrigin2)
      .multiplyScalar(1 / 3);

    const toMiddleTip = pointing._toMiddleTip.copy(middleTip).sub(pointingOrigin);
    const toIndexTip = pointing._toIndexTip.copy(indexTarget0).sub(pointingOrigin);
    const toIndexTarget = pointing._toIndexTip.copy(indexTarget).sub(pointingOrigin);
    // if the middle finger is closer to the wrist than the index finger tip by a factor
    const FACTOR = 2;
    pointing.active = toIndexTip.lengthSq() > toMiddleTip.lengthSq() * FACTOR * FACTOR;

    pointing._origin.copy(pointingOrigin);
    pointing._direction.copy(toIndexTarget).normalize();

    pointing._directionDelta.copy(pointing._direction).sub(pointing.direction);
    pointing._originDelta.copy(pointing._origin).sub(pointing.origin);

    const runningAverageFactorOrigin = Math.min(1, 10.0 * pointing._originDelta.length());
    const runningAverageFactorDirection = Math.min(1, 1.0 * pointing._directionDelta.length());

    pointing.origin
      .multiplyScalar(1 - runningAverageFactorOrigin)
      .add(pointing._origin.multiplyScalar(runningAverageFactorOrigin));
    pointing.direction
      .multiplyScalar(1 - runningAverageFactorDirection)
      .add(pointing._direction.multiplyScalar(runningAverageFactorDirection));
  }

  return out;
};
