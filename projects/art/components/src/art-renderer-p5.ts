import p5 from 'p5';
import { ArtWork_p5, Vector2 } from '@ricklove/art-common';
import { ArtRenderer } from './types';

export const createArtRenderer_p5 = (artwork: ArtWork_p5, tokenId: string): ArtRenderer => ({
  setup: (host: HTMLDivElement) => {
    const artworkInstance = artwork.render(tokenId);
    const { targetCanvasSize, targetFramesPerSecond } = artworkInstance.options ?? {};
    const actualCanvasSize = calculateActualCanvasSize(host, targetCanvasSize);

    let canvas = null as null | HTMLCanvasElement;
    let timeMsElapsed = 0;
    let timeMsAtLastFrame = 0;
    let isPlaying = false;

    const p5Instance = new p5((p: p5) => {
      p.setup = () => {
        const result = p.createCanvas(actualCanvasSize.size.x, actualCanvasSize.size.y);
        const canvasId = `${Math.random()}`;
        result.id(canvasId);
        canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        artworkInstance.setup?.(p, { canvasSize: actualCanvasSize.size });

        if (targetFramesPerSecond) {
          p.frameRate(targetFramesPerSecond);
        }

        // Start paused
        p.noLoop();
      };
      p.draw = () => {
        // p.frameCount
        if (isPlaying) {
          timeMsElapsed += Date.now() - timeMsAtLastFrame;
          timeMsAtLastFrame = Date.now();
        }

        artworkInstance.draw(p, {
          canvasSize: actualCanvasSize.size,
          framesPerSecond: p.frameRate(),
          time: timeMsElapsed / 1000.0,
        });
      };
    }, host);

    const destroy = () => {
      try {
        artworkInstance.destroy?.();
      } catch {
        // Ignore
      }
      p5Instance.remove();
      canvas = null;
    };

    return {
      options: artworkInstance.options,
      play: () => {
        timeMsAtLastFrame = Date.now();
        isPlaying = true;
        p5Instance.loop();
      },
      pause: () => {
        isPlaying = false;
        p5Instance.noLoop();
      },
      nextFrame: (framesPerSecond: number) => {
        if (isPlaying) {
          return;
        }

        timeMsElapsed += 1 / framesPerSecond;
        p5Instance.redraw();
      },
      getCanvas: () => canvas,
      destroy,
    };
  },
});

const calculateActualCanvasSize = (host: HTMLDivElement, targetCanvasSize?: Vector2) => {
  const hostSize = { x: host.clientWidth, y: host.clientHeight };
  if (!targetCanvasSize) {
    return {
      scale: 1,
      size: hostSize,
    };
  }

  const xMax = Math.max(hostSize.x, targetCanvasSize.x);
  const yMax = Math.max(hostSize.y, targetCanvasSize.y);
  const xScale = xMax / targetCanvasSize.x;
  const yScale = yMax / targetCanvasSize.y;
  const actualScale = Math.min(xScale, yScale);

  return {
    scale: actualScale,
    size: {
      x: actualScale * targetCanvasSize.x,
      y: actualScale * targetCanvasSize.y,
    },
  };
};
