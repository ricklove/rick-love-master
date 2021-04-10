import { ColorRgb, Size2, Vector2 } from './utils';

export const createDebugDrawingTools = (context: CanvasRenderingContext2D, getDisplaySize: () => Size2) => {

    const getDebugColor = (color: undefined | null | string | ColorRgb) =>
        !color ? `#00FF00`
            : typeof color === `string` ? color
                : `rgb(${color.r},${color.g},${color.b})`;

    const getPosition = (uvPos: Vector2) => {
        const size = getDisplaySize();
        return {
            x: uvPos.x * size.width,
            y: (1 - uvPos.y) * size.height,
        };
    };

    const tools = {
        drawX: (gamePosition: Vector2, gameSize?: Vector2, color?: string | ColorRgb) => {
            const position = getPosition(gamePosition);
            const size = gameSize ? getPosition(gameSize) : undefined;
            context.strokeStyle = getDebugColor(color);

            const r = size ? { x: size.x / 2, y: size.y / 2 } : { x: 2, y: 2 };

            context.beginPath();
            context.moveTo(position.x - r.x, position.y - r.x);
            context.lineTo(position.x + r.x, position.y + r.x);
            context.moveTo(position.x - r.x, position.y + r.x);
            context.lineTo(position.x + r.x, position.y - r.x);
            context.stroke();
        },
        drawBox: (gamePosition: Vector2, gameSize?: Vector2, color?: string | ColorRgb) => {
            const position = getPosition(gamePosition);
            const size = gameSize ? getPosition(gameSize) : undefined;
            context.strokeStyle = getDebugColor(color);

            const r = size ? { x: size.x / 2, y: size.y / 2 } : { x: 2, y: 2 };

            context.beginPath();
            context.moveTo(position.x - r.x, position.y - r.x);
            context.lineTo(position.x - r.x, position.y + r.x);
            context.lineTo(position.x + r.x, position.y + r.x);
            context.lineTo(position.x + r.x, position.y - r.x);
            context.lineTo(position.x - r.x, position.y - r.x);
            context.stroke();
        },
        drawArrow: (fromGamePos: Vector2, toGamePos: Vector2, color?: string | ColorRgb) => {
            const fromPos = getPosition(fromGamePos);
            const toPos = getPosition(toGamePos);
            context.strokeStyle = getDebugColor(color);

            context.beginPath();
            context.moveTo(fromPos.x, fromPos.y);
            context.lineTo(toPos.x, toPos.y);
            context.stroke();

            tools.drawX(toGamePos, { x: 0.05, y: 0.05 }, color);
        },
    };

    return tools;
};
export type DebugDrawingTools = ReturnType<typeof createDebugDrawingTools>;
