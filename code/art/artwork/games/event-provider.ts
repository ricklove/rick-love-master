
export type EventProvider = { windowAddEventListener: Window['addEventListener'], canvasAddEventListener: HTMLCanvasElement['addEventListener'] };

export const createEventProvider = (canvas: HTMLCanvasElement) => {
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

    return {
        windowAddEventListener,
        canvasAddEventListener,
        destroy: () => {
            windowEventListenersDestroy();
            canvasEventListenersDestroy();
        },
    };
};
