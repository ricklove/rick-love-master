/* eslint-disable no-bitwise */
import { Vector3 } from 'three';
import { defineHandGesture } from '../gestures-core';
import { calculateRotationMatrix, createDirectionAndOrigin, empty, smoothValue } from '../helpers';
import { fingerExtendedIndex, fingerExtendedMiddle } from './finger-states';

export const pointingHand = defineHandGesture({
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
    calculateRotationMatrix(g);
  },
});

export const pointingGun = defineHandGesture({
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
    calculateRotationMatrix(g);
  },
});

export const pointingIndexFinger = defineHandGesture({
  key: `pointingIndexFinger`,
  deps: {
    pointingHand,
    fingerExtendedIndex,
    fingerExtendedMiddle,
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
    const indeExtended = out.fingerExtendedIndex;
    const middExtended = out.fingerExtendedMiddle;

    g.active = indeExtended.state === `extended` && middExtended.state === `closed`;
    if (!g.active) {
      return;
    }

    const indeTip = joints[`index-finger-tip`]?.position ?? empty;
    const indeDist = joints[`index-finger-phalanx-distal`]?.position ?? empty;
    const indeInte = joints[`index-finger-phalanx-intermediate`]?.position ?? empty;

    const target = g._target
      .copy(indeTip)
      .add(indeDist)
      .add(indeInte)
      .multiplyScalar(1 / 3);

    const originUpAdjustment = g._originUpAdjustment.copy(h._ringToIndex).multiplyScalar(1.0);
    const origin = g._origin.copy(h._wristMetacarpalAverage).add(originUpAdjustment);

    const toTargetDirection = g._toTargetDirection.copy(target).sub(origin).normalize();
    g.direction.copy(smoothValue(toTargetDirection, g._directionSmoothing));
    g.position.copy(indeTip);
    calculateRotationMatrix(g);
  },
});

export const pointingWand = defineHandGesture({
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
    calculateRotationMatrix(g);
  },
});
