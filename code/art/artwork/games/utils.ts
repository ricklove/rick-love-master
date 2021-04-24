export type ColorRgb = { r: number, g: number, b: number };
export type Vector2 = { x: number, y: number };
export type Size2 = { width: number, height: number };
export type Rect2 = { position: Vector2, size: Vector2 };

export const Vector2 = {
    add: (a: Vector2, b: Vector2) => {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
        };
    },
    subtract: (a: Vector2, b: Vector2) => {
        return {
            x: a.x - b.x,
            y: a.y - b.y,
        };
    },
    divide: (a: Vector2, b: Vector2) => {
        return {
            x: a.x / b.x,
            y: a.y / b.y,
        };
    },
    scale: (a: number, b: Vector2) => {
        return {
            x: a * b.x,
            y: a * b.y,
        };
    },
    lengthSq: (a: Vector2) => {
        return a.x * a.x + a.y * a.y;
    },
    distanceSq: (a: Vector2, b: Vector2) => {
        return Vector2.lengthSq(Vector2.subtract(a,b));
    },
};

export const Rect2 = {
    collidesRectangle: (a: Rect2, b: Rect2, sizeRatio = 1) => {
        return Math.abs(a.position.x - b.position.x) < sizeRatio * 0.5 * (a.size.x + b.size.x)
            && Math.abs(a.position.y - b.position.y) < sizeRatio * 0.5 * (a.size.y + b.size.y);
    },
};

export function scaleByPixelRatio(input: number) {
    const pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
}
