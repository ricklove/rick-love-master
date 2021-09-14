import type p5 from 'p5';
// import { CanvasVideoRecorder } from './canvas-video-recorder';

// export type P5Constructor = ((sketch: (p5: p5) => void, hostElement: HTMLElement) => { remove: () => void });

export type ArtWork_P5 = {
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
            targetCanvasSize?: { width: number; height: number };
        };
        setup: (p5: p5, args: { canvasSize: { width: number; height: number } }) => void;
        draw: (p5: p5, args: { time: number; framesPerSecond: number; canvasSize: { width: number; height: number } }) => void;
        destroy?: () => void;
    };
};

