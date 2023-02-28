/* eslint-disable no-bitwise */
import { Matrix4, Vector3 } from 'three';

export const createDirectionAndOrigin = () => ({
  position: new Vector3(),
  _positionSmoothing: createSmoothValues(10),
  direction: new Vector3(),
  _directionSmoothing: createSmoothValues(0.15),
  rotation: new Matrix4(),
});
const createSmoothValues = (runningAverageBase: number) => {
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
  const originDelta = g._delta.copy(value).sub(g.out);
  const runningAverageFactorOrigin = Math.min(1, g._runningAverageBase * originDelta.length());

  const keep = g._keep.copy(g.out).multiplyScalar(1 - runningAverageFactorOrigin);
  return g.out.copy(value).multiplyScalar(runningAverageFactorOrigin).add(keep);
};

export const empty = new Vector3(0, 0, 0);
export const up = new Vector3(0, 1, 0);

export const calculateRotation = (g: { direction: Vector3; rotation: Matrix4 }) => {
  g.rotation.lookAt(empty, g.direction, up);
};
