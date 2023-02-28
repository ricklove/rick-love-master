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
      _velocityRunningAverage: createSmoothValues(1 / 30),
    };
  },
  calculate: (head, handLeft, handRight, options, leftResult, rightResult, out) => {
    const g = out.moving;

    const lPos = g._lRelPos
      .copy(leftResult.pointingHand._wristMetacarpalAverage)
      .sub(rightResult.pointingHand._wristMetacarpalAverage);
    const rPos = g._rRelPos
      .copy(rightResult.pointingHand._wristMetacarpalAverage)
      .sub(leftResult.pointingHand._wristMetacarpalAverage);

    if (lPos) {
      g._lDelta.copy(lPos).sub(g._lLastPos);
      if (g._lDelta.lengthSq() > 10) {
        g._lDelta.set(0, 0, 0);
      }
      g._lLastPos.copy(lPos);
    }

    if (rPos) {
      g._rDelta.copy(rPos).sub(g._rLastPos);
      if (g._rDelta.lengthSq() > 10) {
        g._rDelta.set(0, 0, 0);
      }
      g._rLastPos.copy(rPos);
    }

    const instantSpeed = Math.min(1000, 300 * Math.max(g._lDelta.length(), g._lDelta.length()));
    g._velocityRunningAverage._runningAverageBase = Math.min(1 / 10, 0.1 / g._velocity.length());
    const movement = g._instantMovement.set(0, 0, -1).applyEuler(head.rotation).multiplyScalar(instantSpeed);
    g._velocity.copy(runningAverage(movement, g._velocityRunningAverage));

    g.active = true;
    g.direction.copy(g._velocity).normalize();
    g.position.copy(head.position).add(g._velocity);
    calculateRotationMatrix(g);

    // g.active = true;
    // g.direction.copy(g._rDelta).normalize();
    // g.position.copy(g._rLastPos);
    // calculateRotationMatrix(g);
  },
});
