import { Vector3 } from 'three';
import { defineBodyGesture } from '../gestures-core';
import { calculateRotationMatrix, createPositionAndDirection, createSmoothValues, runningAverage } from '../helpers';
import { pointingHand } from './pointing';

export const moving = defineBodyGesture({
  key: `moving`,
  depsHands: {
    pointingHand,
  },
  createResult: () => {
    return {
      active: false,
      ...createPositionAndDirection(),
      _lRelPos: new Vector3(),
      _rRelPos: new Vector3(),
      _lLastPos: new Vector3(),
      _rLastPos: new Vector3(),
      _lDelta: new Vector3(),
      _rDelta: new Vector3(),
      _instantMovement: new Vector3(),
      _velocity: new Vector3(),
      _velocityMin: new Vector3(),
      _velocityRaw: new Vector3(),
      _velocityRunningAverage: createSmoothValues(1 / 30),
    };
  },
  calculate: (head, handLeft, handRight, options, leftResult, rightResult, out) => {
    const g = out.moving;

    const lPos = !leftResult.active ? undefined : g._lRelPos.copy(leftResult.pointingHand._wristMetacarpalAverage);
    const rPos = !rightResult.active ? undefined : g._rRelPos.copy(rightResult.pointingHand._wristMetacarpalAverage);

    if (lPos) {
      if (g._lLastPos.lengthSq() === 0) {
        g._lLastPos.copy(lPos);
      }
      g._lDelta.copy(lPos).sub(g._lLastPos);
      g._lLastPos.copy(lPos);
    }

    if (rPos) {
      if (g._rLastPos.lengthSq() === 0) {
        g._rLastPos.copy(rPos);
      }
      g._rDelta.copy(rPos).sub(g._rLastPos);
      g._rLastPos.copy(rPos);
    }

    const instantSpeed = Math.min(1000, 300 * Math.min(g._lDelta.length(), g._rDelta.length()));
    const instantMovement = g._instantMovement.set(0, 0, -1).applyEuler(head.rotation).multiplyScalar(instantSpeed);
    g._velocityRunningAverage._runningAverageBase = Math.min(1 / 2, 0.05 / g._velocityRaw.length());
    g._velocityRaw.copy(runningAverage(instantMovement, g._velocityRunningAverage));

    const MIN_SPEED = 1;

    const isMoving = g._velocityRaw.lengthSq() > MIN_SPEED * MIN_SPEED;
    if (isMoving) {
      g._velocityMin.copy(g._velocityRaw).normalize().multiplyScalar(MIN_SPEED);
      g._velocity.copy(g._velocityRaw).sub(g._velocityMin);
    } else {
      g._velocity.set(0, 0, 0);
    }

    g.active = isMoving;
    g.direction.copy(g._velocityRaw).normalize();
    g.position.copy(head.position).add(g._velocity);
    calculateRotationMatrix(g);
  },
});
