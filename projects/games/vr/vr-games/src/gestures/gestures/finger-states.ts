/* eslint-disable no-bitwise */
import { Vector3, XRHandJoints } from 'three';
import { defineHandGesture } from '../gestures-core';
import { calculateRotationMatrix, createPositionAndDirection, empty, smoothValue } from '../helpers';

const getFingerExtended = <TKey extends `Thumb` | `Index` | `Middle` | `Ring` | `Pinky`>(
  keyPrefix: TKey,
  name: `thumb` | `index-finger` | `middle-finger` | `ring-finger` | `pinky-finger`,
  closedBendRatio?: number,
) => {
  const key = `fingerExtended${keyPrefix}` as const;
  const jointTip = `${name}-tip` as keyof XRHandJoints;
  // const jointDist = `${name}-phalanx-distal` as keyof XRHandJoints;
  const jointProx = `${name}-phalanx-proximal` as keyof XRHandJoints;
  const jointMeta = `${name}-metacarpal` as keyof XRHandJoints;

  return defineHandGesture({
    key,
    createResult: () => {
      return {
        active: false,
        ...createPositionAndDirection(),
        bendRatio: 1,
        state: `extended` as `extended` | `partial` | `closed`,
        _metaToTip: new Vector3(),
        _metaToProx: new Vector3(),
        _proxToTip: new Vector3(),
      };
    },
    calculate: (hand, isRightHand, options, joints, wrist, out) => {
      const g = out[key];

      const tip = joints[jointTip]?.position ?? empty;
      // const dist = joints[jointDist]?.position ?? empty;
      const prox = joints[jointProx]?.position ?? empty;
      const meta = joints[jointMeta]?.position ?? empty;

      const metaToTip = g._metaToTip.copy(tip).sub(meta);
      const metaToProx = g._metaToProx.copy(prox).sub(meta);
      const proxToTip = g._proxToTip.copy(tip).sub(prox);

      const lengthHypo = metaToTip.length();
      const lengthSides = metaToProx.length() + proxToTip.length();
      g.bendRatio = lengthSides / lengthHypo;

      const EXTENDED_BEND_RATIO = 1.05;
      const CLOSED_BEND_RATIO = closedBendRatio ?? 1.7;
      g.state = g.bendRatio < EXTENDED_BEND_RATIO ? `extended` : g.bendRatio < CLOSED_BEND_RATIO ? `partial` : `closed`;

      g.active = g.state === `extended`;
      g.position.copy(smoothValue(tip, g._positionSmoothing));
      g.direction.copy(smoothValue(metaToTip, g._directionSmoothing));
      calculateRotationMatrix(g);
    },
  });
};

export const fingerExtendedThumb = getFingerExtended(`Thumb`, `thumb`, 1.1);
export const fingerExtendedIndex = getFingerExtended(`Index`, `index-finger`);
export const fingerExtendedMiddle = getFingerExtended(`Middle`, `middle-finger`);
export const fingerExtendedRing = getFingerExtended(`Ring`, `ring-finger`);
export const fingerExtendedPinky = getFingerExtended(`Pinky`, `pinky-finger`);
