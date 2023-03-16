import { Quaternion, Vector3 } from 'three';

export const createCalculatorEstimateVelocityFromPosition = () => {
  const inTargetPosition = new Vector3();
  const inTargetQuanternion = new Quaternion();
  const inActualPosition = new Vector3();
  const inActualQuanternion = new Quaternion();
  const outVelocity = new Vector3();
  const outAngularVelocity = new Vector3();

  const lastTargetPosition = new Vector3();
  const targetVelocity = new Vector3();
  const runningVelocity = new Vector3();
  const missingFrames = { count: 0 };
  const delta = new Vector3();
  const a = new Vector3();
  const b = new Vector3();
  const forward = new Vector3(0, 0, -1);
  const rotationAxisFromCross = new Vector3();

  const q = new Quaternion();
  const q2 = new Quaternion();
  const qDiff = new Quaternion();
  const qActualInverse = new Quaternion();
  const qVel = new Quaternion();

  const convertPositionToVelocity = ({
    inTargetPosition: targetPosition,
    inTargetQuanternion: targetQuanternion,
    inActualPosition: actualPosition,
    inActualQuanternion: actualQuanternion,
    outVelocity,
    outAngularVelocity,
  }: {
    inTargetPosition: Vector3;
    inTargetQuanternion: Quaternion;
    inActualPosition: Vector3;
    inActualQuanternion: Quaternion;
    outVelocity: Vector3;
    /** cannon docs: the angular velocity as a vector, which the body rotates around. The length of this vector determines how fast (in radians per second) the body rotates. */
    outAngularVelocity: Vector3;
  }) => {
    const hasMoved = a.copy(lastTargetPosition).sub(targetPosition).lengthSq() > 0;

    missingFrames.count = hasMoved ? 0 : missingFrames.count++;
    lastTargetPosition.copy(targetPosition);

    const mult = (0.5 * 60) / (missingFrames.count + 1);
    // const ratio = missingFrames.count + 1;
    // const ratio = 0.5;
    // const mult = 0.5;

    delta.copy(targetPosition).sub(actualPosition);
    targetVelocity.copy(delta).multiplyScalar(mult);
    runningVelocity.lerp(targetVelocity, 0.8);
    outVelocity.copy(runningVelocity);

    // https://gamedev.stackexchange.com/q/30926
    // angular velocity is usually represented as a 3d vector where the direction is the axis and the magnitude is the angular speed
    a.copy(forward).applyQuaternion(targetQuanternion);
    b.copy(forward).applyQuaternion(actualQuanternion);
    rotationAxisFromCross.crossVectors(a, b);
    outAngularVelocity.copy(rotationAxisFromCross).multiplyScalar(mult);

    // qActualInverse.copy(actualQuanternion).invert();
    // qDiff.copy(qActualInverse).multiply(targetQuanternion);
    // qVel.copy(qDiff).
    // btQuaternion velQuater = 2.0f * exp(log(diffQuater) / d_time) * conjBoxQuater;

    // q.copy(actualQuanternion).(targetQuanternion, 1);
    // outAngularVelocity.setFromQuaternion(q);
  };
  return {
    calculate: convertPositionToVelocity,
    inTargetPosition,
    inTargetQuanternion,
    inActualPosition,
    inActualQuanternion,
    outVelocity,
    outAngularVelocity,
  };
};
