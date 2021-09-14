export type ArtRenderer = {
  setup: (host: HTMLDivElement, options: { shouldPlay: boolean }) => ArtRendererInstance;
};

export type ArtRendererInstance = {
  play: () => void;
  pause: () => void;
  nextFrame: (framesPerSecond: number) => void;
  getCanvas: () => null | HTMLCanvasElement;
  destroy: () => void;
};
