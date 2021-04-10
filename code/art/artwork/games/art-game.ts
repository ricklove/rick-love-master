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
        if (e.key === `t`) {
            // toggle debug
            isVisible = !isVisible;
            canvas.style.opacity = isVisible ? `0` : `0.5`;
        }
    });

    const statsState = {
        frameLast: {
            time: Date.now(),
            updateFrameTick: 0,
            renderFrameTick: 0,
        },
        frame125: {
            time: Date.now(),
            updateFrameTick: 0,
            renderFrameTick: 0,
        },
        frame250: {
            time: Date.now(),
            updateFrameTick: 0,
            renderFrameTick: 0,
        },
    };

    return {
        render: (gameInstance: { render: (renderCallbacks: TRenderArgs) => void }, stats: { updateFrameTick: number, renderFrameTick: number }) => {
            if (!isVisible) { return; }

            // Stats
            if (Date.now() > statsState.frame250.time + 250) {
                statsState.frame250 = statsState.frame125;
            }
            if (Date.now() > statsState.frame125.time + 125) {
                statsState.frame125 = statsState.frameLast;
            }
            statsState.frameLast = {
                time: Date.now(),
                renderFrameTick: stats.renderFrameTick,
                updateFrameTick: stats.updateFrameTick,
            };

            // console.log(`DebugGameView render`, { game, gameInstance });
            autoResizeCanvas();

            // Erode
            context.beginPath();
            context.fillStyle = `#00000010`;
            context.fillRect(0, 0, canvas.width, canvas.height);

            tools.drawBox({ x: 0.5, y: 0.5 }, { x: 0.1, y: 0.1 }, `#00FF008`);
            gameInstance.render(renderArgs);

            const frameA = statsState.frame125;
            const frameB = statsState.frame250;

            tools.drawLabel({ x: 0, y: 0.1 }, `render fps: ${((frameA.renderFrameTick - frameB.renderFrameTick) * 1000 / (frameA.time - frameB.time)).toFixed(1).padStart(8, ` `)}`);
            tools.drawLabel({ x: 0, y: 0.2 }, `update fps: ${((frameA.updateFrameTick - frameB.updateFrameTick) * 1000 / (frameA.time - frameB.time)).toFixed(1).padStart(8, ` `)}`);
        },
        destroy: () => {
            canvas.remove();
        },
    };
};
