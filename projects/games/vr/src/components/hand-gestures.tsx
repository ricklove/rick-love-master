/* eslint-disable no-bitwise */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useController } from '@react-three/xr';
import { Matrix4, Vector3, XRHandJoints, XRHandSpace } from 'three';

export const useHandGesture = (options: GestureOptions) => {
  const controllerL = useController(`left`);
  const controllerR = useController(`right`);

  const gestureResultL = useRef(createGestureResult());
  const gestureResultR = useRef(createGestureResult());

  useFrame(() => {
    calculateHandGesture(controllerL?.hand, false, options, gestureResultL.current);
    calculateHandGesture(controllerR?.hand, true, options, gestureResultR.current);
  });

  return {
    left: gestureResultL.current,
    right: gestureResultR.current,
  };
};

export type GestureOptions = {
  pointingHand?: boolean;
  pointingGun?: boolean;
  pointingIndexFinger?: boolean;
  pointingWand?: boolean;
};
export const GestureOptions = {
  all: {
    pointingHand: true,
    pointingGun: true,
    pointingIndexFinger: true,
    pointingWand: true,
  } as GestureOptions,
};

const createGestureResult = () => {
  const createDirectionAndOrigin = () => ({
    position: new Vector3(),
    _positionSmoothing: createSmoothValues(10),
    direction: new Vector3(),
    _directionSmoothing: createSmoothValues(0.15),
    rotation: new Matrix4(),
  });
  return {
    _joints: {} as Partial<XRHandJoints>,
    kind: 0,
    pointingHand: {
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
    },
    pointingGun: {
      active: false,
      ...createDirectionAndOrigin(),
      _gunOrigin: new Vector3(),
      _gunUpAdjustment: new Vector3(),
      _gunForwardAdjustment: new Vector3(),
    },
    pointingIndexFinger: {
      active: false,
      ...createDirectionAndOrigin(),
      _target: new Vector3(),
      _toMiddleTip: new Vector3(),
      _toIndexTip: new Vector3(),
      _origin: new Vector3(),
      _originUpAdjustment: new Vector3(),
      _toTargetDirection: new Vector3(),
    },
    pointingWand: {
      active: false,
      ...createDirectionAndOrigin(),
      _target: new Vector3(),
      _toMiddleTip: new Vector3(),
      _toIndexTip: new Vector3(),
      _origin: new Vector3(),
      _targetAdjustment: new Vector3(),
      _originAdjustment: new Vector3(),
      _toTargetDirection: new Vector3(),
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

const calculateHandGesture = (
  hand: XRHandSpace | undefined,
  isRightHand: boolean,
  options: GestureOptions,
  out: GestureResult,
) => {
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

  if (options.pointingHand || options.pointingGun || options.pointingIndexFinger) {
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
  }

  if (options.pointingGun) {
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
  }

  if (options.pointingIndexFinger) {
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
  }

  if (options.pointingWand) {
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
  }

  return out;
};
