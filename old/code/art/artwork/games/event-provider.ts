import { scaleByPixelRatio, Vector2 } from './utils';

export type EventProvider = {
    windowAddEventListener: Window['addEventListener'];
    canvasAddEventListener: HTMLCanvasElement['addEventListener'];
    tools: {
        getMouseGamePosition: (e: MouseEvent) => Vector2;
        getTouchPositions: (e: TouchEvent) => Vector2[];
    };
    destroy: () => void;
};

export const createEventProvider = (canvas: HTMLCanvasElement): EventProvider => {
    const windowSubs = [] as { name: string, handler: () => void }[];
    const windowAddEventListener = ((name: string, handler: () => void, options?: boolean | AddEventListenerOptions) => {
        windowSubs.push({ name, handler });
        return window.addEventListener(name, handler, options);
    }) as typeof window.addEventListener;
    const windowEventListenersDestroy = () => {
        windowSubs.forEach(({ name, handler }) => {
            window.removeEventListener(name, handler);
        });
    };
    const canvasSubs = [] as { name: string, handler: () => void }[];
    const canvasAddEventListener = ((name: string, handler: () => void, options: boolean | AddEventListenerOptions) => {
        if (!canvas) { return null; }

        canvasSubs.push({ name, handler });
        return canvas.addEventListener(name, handler, options);
    }) as HTMLCanvasElement['addEventListener'];
    const canvasEventListenersDestroy = () => {
        canvasSubs.forEach(({ name, handler }) => {
            canvas.removeEventListener(name, handler);
        });
    };

    const clientToGamePosition = (item: { clientX: number, clientY: number }, rectCached?: DOMRect) => {
        const rect = rectCached ?? canvas.getBoundingClientRect();
        const canvasPos = {
            x: item.clientX - rect.left,
            y: item.clientY - rect.top,
        };

        const gamePos = {
            x: scaleByPixelRatio(canvasPos.x) / canvas.width,
            y: 1 - (scaleByPixelRatio(canvasPos.y) / canvas.height),
        };
        return gamePos;
    };

    return {
        windowAddEventListener,
        canvasAddEventListener,
        tools: {
            getMouseGamePosition: (e) => clientToGamePosition(e),
            getTouchPositions: (e) => {
                const rect = canvas.getBoundingClientRect();
                const pos = [] as Vector2[];
                const { touches } = e;
                for (let i = 0; i < touches.length; i++) {
                    const touch = touches.item(i);
                    if (!touch) { continue; }

                    pos.push(clientToGamePosition(touch, rect));
                }
                return pos;
            },
        },
        destroy: () => {
            windowEventListenersDestroy();
            canvasEventListenersDestroy();
        },
    };
};
