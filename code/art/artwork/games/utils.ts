export type ColorRgb = { r: number, g: number, b: number };
export type Vector2 = { x: number, y: number };
export type Size2 = { width: number, height: number };

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
    scale: (a: number, b: Vector2) => {
        return {
            x: a * b.x,
            y: a * b.y,
        };
    },
};

export function scaleByPixelRatio(input: number) {
    const pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
}
