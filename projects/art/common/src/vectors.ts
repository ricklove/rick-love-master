export type Vector2 = { x: number; y: number };
// export type Rect2 = { pos: Vector2; size: Vector2 };

export const Vectors = {
    add: (a: Vector2, b: Vector2) => ({ x: a.x + b.x, y: a.y + b.y }),
    subtract: (a: Vector2, b: Vector2) => ({ x: a.x - b.x, y: a.y - b.y }),
    scale: (a: Vector2, s: number) => ({ x: a.x * s, y: a.y * s }),
};
