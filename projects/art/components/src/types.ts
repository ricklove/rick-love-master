export type ArtRenderer = {
  setup: (host: HTMLDivElement, options: { shouldPlay: boolean }) => ArtRendererInstance;
};

export type ArtRendererInstance = {
  play: () => void;
  pause: () => void;
  nextFrame: (framesPerSecond: number) => { isDone: boolean };
  getCanvas: () => null | HTMLCanvasElement;
  destroy: () => void;
};
