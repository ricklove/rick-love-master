
export type EventProvider = { windowAddEventListener: Window['addEventListener'], canvasAddEventListener: HTMLCanvasElement['addEventListener'] };

export const createEventProvider = (canvas: HTMLCanvasElement) => {
    const windowSubs = [] as { name: string, handler: () => void }[];
    const windowAddEventListener = ((name: string, handler: () => void) => {
        window.addEventListener(name, handler);
        windowSubs.push({ name, handler });
    }) as typeof window.addEventListener;
    const windowEventListenersDestroy = () => {
        windowSubs.forEach(({ name, handler }) => {
            window.removeEventListener(name, handler);
        });
    };
    const canvasSubs = [] as { name: string, handler: () => void }[];
    const canvasAddEventListener = ((name: string, handler: () => void) => {
        if (!canvas) { return; }

        canvas.addEventListener(name, handler);
        canvasSubs.push({ name, handler });
    }) as HTMLCanvasElement['addEventListener'];
    const canvasEventListenersDestroy = () => {
        canvasSubs.forEach(({ name, handler }) => {
            canvas.removeEventListener(name, handler);
        });
    };

    return {
        windowAddEventListener,
        canvasAddEventListener,
        destroy: () => {
            windowEventListenersDestroy();
            canvasEventListenersDestroy();
        },
    };
};
