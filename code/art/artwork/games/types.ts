import { TimeProvider } from '../../time-provider';

export type Vector2 = { x: number, y: number };
export type ColorRgb = { r: number, g: number, b: number };
export type ArtGame<T> = {
    name: string;
    createGame: (
        timeProvider: TimeProvider,
        environmentProvider: { getDisplaySize: () => { width: number, height: number } }
    ) => {
        update: () => void;
        render: (renderProvider: T) => void;
        destroy: () => void;
    };
};
