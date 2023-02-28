/* eslint-disable no-bitwise */
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';

export const empty = new Vector3(0, 0, 0);
export const emptyRotation = new Euler();
export const emptyQuanternion = new Quaternion();
export const identity = new Matrix4().identity();
export const up = new Vector3(0, 1, 0);

export const createPositionAndDirection = () => ({
  position: new Vector3(),
  _positionSmoothing: createSmoothValues(10),
  direction: new Vector3(),
  _directionSmoothing: createSmoothValues(0.15),
  rotationMatrix: new Matrix4(),
  quaternion: new Quaternion(),
});
export const createSmoothValues = (runningAverageBase: number) => {
  return {
    _runningAverageBase: runningAverageBase,
    _delta: new Vector3(),
    _keep: new Vector3(),
    out: new Vector3(),
  };
};
type SmoothValues = ReturnType<typeof createSmoothValues>;

export const smoothValue = (value: Vector3, g: SmoothValues): Vector3 => {
  // return g.out.copy(value);
  const delta = g._delta.copy(value).sub(g.out);
  const runningAverageFactorOrigin = Math.min(1, g._runningAverageBase * delta.length());

  const keep = g._keep.copy(g.out).multiplyScalar(1 - runningAverageFactorOrigin);
  return g.out.copy(value).multiplyScalar(runningAverageFactorOrigin).add(keep);
};

export const runningAverage = (value: Vector3, g: SmoothValues): Vector3 => {
  const runningAverageFactorOrigin = g._runningAverageBase;
  const keep = g._keep.copy(g.out).multiplyScalar(1 - runningAverageFactorOrigin);
  return g.out.copy(value).multiplyScalar(runningAverageFactorOrigin).add(keep);
};

export const calculateRotationMatrix = (g: { direction: Vector3; rotationMatrix: Matrix4; quaternion: Quaternion }) => {
  g.rotationMatrix.lookAt(empty, g.direction, up);
  g.quaternion.setFromRotationMatrix(g.rotationMatrix);
};
