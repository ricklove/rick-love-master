import { EventProvider } from './event-provider';
import { createDebugDrawingTools, DebugDrawingTools } from './debug-drawing-tools';
import { TimeProvider } from '../../time-provider';
import { Vector2, Size2, scaleByPixelRatio } from './utils';

export type ArtGame<TRenderArgs> = {
    name: string;
    createGame: (
        timeProvider: TimeProvider,
        environmentProvider: { getDisplaySize: () => Size2 }
    ) => {
        setup: (eventProvider: EventProvider) => void;
        update: () => void;
        render: (renderCallbacks: TRenderArgs) => void;
        destroy: () => void;
    };
    debugRenderer?: (tools: DebugDrawingTools, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement,) => TRenderArgs;
};

export const createDebugGameView = <TRenderArgs>(
    game: ArtGame<TRenderArgs>,
    gameCanvas: HTMLCanvasElement,
    eventProvider: EventProvider,
) => {
    console.log(`createDebugGameView`, { game, gameCanvas });

    if (!game.debugRenderer) { return null; }

    const canvas = document.createElement(`canvas`);
    gameCanvas.parentElement?.appendChild(canvas);
    canvas.style.pointerEvents = `none`;
    canvas.style.position = `absolute`;
    canvas.style.left = `0`;
    canvas.style.top = `0`;
    canvas.style.opacity = `0.5`;
    // canvas.style.backgroundColor = `#00FF0022`;

    const autoResizeCanvas = () => {
        const width = scaleByPixelRatio(gameCanvas.clientWidth);
        const height = scaleByPixelRatio(gameCanvas.clientHeight);
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;

            return true;
        }
        return false;
    };

    const context = canvas.getContext(`2d`);
    if (!context) { throw new Error(`createDebugCanvas: Could not get context`); }

    const tools = createDebugDrawingTools(context, () => ({ width: canvas.width, height: canvas.height }));
    const renderArgs = game.debugRenderer(tools, context, canvas);


    let isVisible = true;
    eventProvider.windowAddEventListener(`keydown`, e => {
        if (e.key === `d`) {
            // toggle debug
            isVisible = !isVisible;
            canvas.style.opacity = isVisible ? `0` : `0.5`;
        }
    });

    return {
        render: (gameInstance: { render: (renderCallbacks: TRenderArgs) => void }) => {
            console.log(`DebugGameView render`, { game, gameInstance });
            autoResizeCanvas();

            // Erode
            context.beginPath();
            context.fillStyle = `#00000010`;
            context.fillRect(0, 0, canvas.width, canvas.height);

            tools.drawBox({ x: 0.5, y: 0.5 }, { x: 0.1, y: 0.1 }, `#00FF008`);
            gameInstance.render(renderArgs);
        },
        destroy: () => {
            canvas.remove();
        },
    };
};
