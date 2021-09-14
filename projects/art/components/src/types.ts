export type ArtRenderer = {
  setup: (host: HTMLDivElement) => {
    play: () => void;
    pause: () => void;
    nextFrame: (framesPerSecond: number) => void;
    getCanvas: () => null | HTMLCanvasElement;
    destroy: () => void;
  };
};
