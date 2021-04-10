import { CanvasVideoRecorder } from './canvas-video-recorder';

export type ArtWork = {
    key: string;
    title: string;
    description: string;
    artist: string;
    openSea?: {
        tokenAddress: string;
        tokenId: string;
    };
    getTokenDescription: (tokenId: string) => null | string;
    renderArt?: (hostElement: HTMLDivElement, hash: string, recorder: null | CanvasVideoRecorder) => { remove: () => void, recorder?: null | CanvasVideoRecorder };
    ArtComponent?: (props: { hash: string }) => JSX.Element;
};
