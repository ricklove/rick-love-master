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
    const getSize = (uvPos: Vector2) => {
        const size = getDisplaySize();
        return {
            x: uvPos.x * size.width,
            y: uvPos.y * size.height,
        };
    };

    const tools = {
        drawX: (gamePosition: Vector2, gameSize?: Vector2, color?: string | ColorRgb) => {
            const position = getPosition(gamePosition);
            const size = gameSize ? getSize(gameSize) : undefined;
            context.strokeStyle = getDebugColor(color);

            const r = size ? { x: size.x / 2, y: size.y / 2 } : { x: 2, y: 2 };

            context.beginPath();
            context.moveTo(position.x - r.x, position.y - r.y);
            context.lineTo(position.x + r.x, position.y + r.y);
            context.moveTo(position.x - r.x, position.y + r.y);
            context.lineTo(position.x + r.x, position.y - r.y);
            context.stroke();
        },
        drawBox: (gamePosition: Vector2, gameSize?: Vector2, color?: string | ColorRgb) => {
            const position = getPosition(gamePosition);
            const size = gameSize ? getSize(gameSize) : undefined;
            context.strokeStyle = getDebugColor(color);

            const r = size ? { x: size.x / 2, y: size.y / 2 } : { x: 2, y: 2 };

            context.beginPath();
            context.moveTo(position.x - r.x, position.y - r.y);
            context.lineTo(position.x - r.x, position.y + r.y);
            context.lineTo(position.x + r.x, position.y + r.y);
            context.lineTo(position.x + r.x, position.y - r.y);
            context.lineTo(position.x - r.x, position.y - r.y);
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

            tools.drawX(toGamePos, { x: 0.01, y: 0.01 }, color);
        },
        drawLabel: (gamePosition: Vector2, text: string, color?: string | ColorRgb) => {
            const position = getPosition(gamePosition);

            context.fillStyle = `#000000`;
            context.fillRect(position.x, position.y - 24, 8 * text.length, 32);

            context.fillStyle = getDebugColor(color);

            context.beginPath();
            context.font = `14px monospace`;
            context.fillText(text, position.x, position.y);
        },
    };

    return tools;
};
export type DebugDrawingTools = ReturnType<typeof createDebugDrawingTools>;
