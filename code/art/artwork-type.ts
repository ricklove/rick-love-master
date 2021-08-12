import type p5 from 'p5';
import { ArtKey } from './art-index';
import { CanvasVideoRecorder } from './canvas-video-recording/canvas-video-recorder';

export type P5Constructor = ((sketch: (p5: p5) => void, hostElement: HTMLElement) => { remove: () => void });
export type ArtWork = {
    key: ArtKey;
    title: string;
    description: string;
    artist: string;
    openSea?: {
        tokenAddress: string;
        tokenId: string;
    };
    getTokenDescription: (tokenId: string) => null | string;
    renderArt?: (hostElement: HTMLDivElement,
        hash: string,
        recorder: null | CanvasVideoRecorder,
        createP5: P5Constructor
    ) => {
        remove: () => void;
        recorder?: null | CanvasVideoRecorder; };
    ArtComponent?: (props: { hash: string }) => JSX.Element;
    canSetSeed?: boolean;
};
