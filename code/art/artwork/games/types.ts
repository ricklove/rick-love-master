import { TimeProvider } from '../../time-provider';
import { EventProvider } from './event-provider';

export type ColorRgb = { r: number, g: number, b: number };
export type ArtGame<TUpdateArgs, TRenderArgs> = {
    name: string;
    createGame: (
        timeProvider: TimeProvider,
        environmentProvider: { getDisplaySize: () => { width: number, height: number } }
    ) => {
        setup: (eventProvider: EventProvider) => void;
        update: (updateCallbacks: TUpdateArgs) => void;
        render: (renderCallbacks: TRenderArgs) => void;
        destroy: () => void;
    };
};


export type Vector2 = { x: number, y: number };
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
