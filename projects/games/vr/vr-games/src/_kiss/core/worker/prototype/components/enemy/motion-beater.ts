import { RigidBody } from '@dimforge/rapier3d-compat';
import { Quaternion, Vector3 } from 'three';

export const createMotionBeater = ({
  impulseStrength,
  curveStrength,
  wobbleStrength,
}: {
  impulseStrength: number;
  curveStrength: number;
  wobbleStrength: number;
}) => {
  const w = {
    position: new Vector3(),
    quaternion: new Quaternion(),
    delta: new Vector3(),
    impulse: new Vector3(),
    curve: new Vector3(),
    wobble: new Vector3(),
  };

  const curveDirection = new Vector3(0, 0, -1);

  return {
    setup: (entity: { rigidBody: RigidBody }) => {
      const { rigidBody } = entity;
      rigidBody.setGravityScale(0, true);
      // Start with a random velocity
      const impulse = w.impulse
        .set(Math.random(), Math.random(), Math.random())
        .normalize()
        .multiplyScalar(impulseStrength);
      rigidBody.applyImpulse(impulse, true);

      curveDirection.set(Math.random(), Math.random(), Math.random()).normalize();
    },
    update: (entity: { rigidBody: RigidBody }, deltaTime: number, target: { position: Vector3 }) => {
      const { rigidBody } = entity;
      const { position: targetPosition } = target;
      const translation = rigidBody.translation();
      const position = w.position.set(translation.x, translation.y, translation.z);
      const delta = w.delta.copy(position).sub(targetPosition);
      const impulse = w.impulse
        .copy(delta)
        .normalize()
        .multiplyScalar(impulseStrength * deltaTime);
      rigidBody.applyImpulse(impulse, true);

      // curve
      const curve = w.curve
        .copy(curveDirection)
        .multiplyScalar(curveStrength)
        .multiplyScalar(curveStrength * deltaTime);
      rigidBody.applyImpulse(curve, true);

      // wobble
      const rotation = rigidBody.rotation();
      const quaternion = w.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
      const wobble = w.wobble
        .set(0, 0, -1)
        .applyQuaternion(quaternion)
        .multiplyScalar(wobbleStrength * deltaTime);
      rigidBody.applyImpulse(wobble, true);
    },
  };
};
