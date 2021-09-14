import type p5 from 'p5';
import { Vector2 } from './vectors';
// import { CanvasVideoRecorder } from './canvas-video-recorder';

// export type P5Constructor = ((sketch: (p5: p5) => void, hostElement: HTMLElement) => { remove: () => void });

export type ArtWork_p5 = {
    key: string;
    projectMetadata: {
        title: string;
        description: string;
        artist: string;
    };
    getTokenMetadata: (tokenId: string) => {
        tokenId: string;
        title?: string;
        description?: string;
        attributes?: {
            traitType: string;
            value: string;
        }[];
    };
    render: (tokenId: string) => {
        options?: {
            targetFramesPerSecond?: number;
            targetCanvasSize?: Vector2;
        };
        setup?: (p5: p5, args: { canvasSize: Vector2 }) => void;
        draw: (p5: p5, args: { time: number; framesPerSecond: number; canvasSize: Vector2 }) => void;
        destroy?: () => void;
    };
};
