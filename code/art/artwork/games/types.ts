import { TimeProvider } from '../../time-provider';

export type Vector2 = { x: number, y: number };
export type ColorRgb = { r: number, g: number, b: number };
export type ArtGame<TUpdateArgs, TRenderArgs> = {
    name: string;
    createGame: (
        timeProvider: TimeProvider,
        environmentProvider: { getDisplaySize: () => { width: number, height: number } }
    ) => {
        update: (updateCallbacks: TUpdateArgs) => void;
        render: (renderCallbacks: TRenderArgs) => void;
        destroy: () => void;
    };
};
