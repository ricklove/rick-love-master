export type Vector2 = { x: number; y: number };
export const getDistanceSq = (a: Vector2, b: Vector2) => {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return x * x + y * y;
};
