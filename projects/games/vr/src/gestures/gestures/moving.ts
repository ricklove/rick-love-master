import { Vector3 } from 'three';
import { formatVector } from '../../utils/formatters';
import { logger } from '../../utils/logger';
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
      _framesSinceActive: 1000,
      _lPos: new Vector3(),
      _rPos: new Vector3(),
      _lLastPos: new Vector3(),
      _rLastPos: new Vector3(),
      _lDelta: new Vector3(),
      _rDelta: new Vector3(),
      _delta: new Vector3(),
      _instantMovement: new Vector3(),
      _velocity: new Vector3(),
      _velocityCutoff: new Vector3(),
      _velocityRaw: new Vector3(),
      _velocityRunningAverage: createSmoothValues(1 / 30),
      _speedPerFrame: 0,
    };
  },
  calculate: (head, handLeft, handRight, options, leftResult, rightResult, out) => {
    const g = out.moving;

    const lPos = !leftResult.active ? undefined : g._lPos.copy(leftResult.pointingHand._wristMetacarpalAverage);
    const rPos = !rightResult.active ? undefined : g._rPos.copy(rightResult.pointingHand._wristMetacarpalAverage);

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

    if (leftResult.active || rightResult.active) {
      g._delta.copy(g._rDelta).sub(g._lDelta);
      g._speedPerFrame = g._delta.length() / g._framesSinceActive;
      g._framesSinceActive = 0;
    }
    g._framesSinceActive++;

    if (g._framesSinceActive > 15) {
      g._speedPerFrame *= 0.9;
    }

    const SPEED_AT_1METERPERSECOND_ARM_MOVEMENT = 5;
    const instantSpeed = Math.min(
      SPEED_AT_1METERPERSECOND_ARM_MOVEMENT * 10,
      SPEED_AT_1METERPERSECOND_ARM_MOVEMENT * 60 * g._speedPerFrame,
    );

    logger.log(`instantSpeed`, {
      instantSpeed: instantSpeed.toFixed(3),
      rDelta: formatVector(g._rDelta),
      lDelta: formatVector(g._lDelta),
    });

    const instantMovement = g._instantMovement.set(0, 0, -1).applyEuler(head.rotation).multiplyScalar(instantSpeed);
    g._velocityRunningAverage._runningAverageBase = Math.min(1 / 2, 0.05 / g._velocityRaw.length());
    g._velocityRaw.copy(runningAverage(instantMovement, g._velocityRunningAverage));

    const CUTOFF_SPEED = 5;

    const isMoving = g._velocityRaw.lengthSq() > CUTOFF_SPEED * CUTOFF_SPEED;
    if (isMoving) {
      g._velocityCutoff.copy(g._velocityRaw).normalize().multiplyScalar(CUTOFF_SPEED);
      g._velocity.copy(g._velocityRaw).sub(g._velocityCutoff);
    } else {
      g._velocity.set(0, 0, 0);
    }

    g.active = isMoving;
    g.direction.copy(g._velocityRaw).normalize();
    g.position.copy(head.position).add(g._velocity);
    calculateRotationMatrix(g);
  },
});
