import { Vector3 } from 'three';

export const formatVector = (v: Vector3) => {
  return `[${v.x.toFixed(2)},${v.y.toFixed(2)},${v.z.toFixed(2)}]`;
};
