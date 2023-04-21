import { debugScene } from './_debug-scene';
import { createSmoothCurve, SmoothCurveArgs } from './smooth-curve';

const inputs: { [name: string]: SmoothCurveArgs } = {
  flat: {
    path: [
      [-2, 1, -5],
      [-1, 1, -5],
      [0, 1, -5],
      [1, 1, -5],
      [2, 1, -5],
    ],
  },
  sine: {
    path: [...new Array(10)].map((_, i) => [-2 + (i * 4) / 10, 1 + Math.sin(i), -5]),
  },
  sine2: {
    path: [...new Array(20)].map((_, i) => [-2 + i * 0.25 + Math.sin(i * 3), 1 + Math.sin(i), -5 - i * 0.5]),
  },
  wavy: {
    path: [
      [-2, 0, -5],
      [-1, 1, -2],
      [0, 1.5, -1],
      [1, 1, -2],
      [2, 2, -5],
    ],
  },
};

export const testScenes_smoothCurve = debugScene.create({
  name: `smoothCurve`,
  inputs,
  getPoints: (input) => {
    const slotSize = 0.1;
    const result = createSmoothCurve(input);
    const count = Math.floor(result.totalSegmentLength / (slotSize * 1.8));

    return {
      points: [
        ...[...new Array(count)].map((_, i) => {
          const position = result.getPointOnPath(i / count);
          return {
            position,
            color: 0x00ff00,
            scale: [slotSize, slotSize, slotSize] as [number, number, number],
          };
        }),
        ...input.path.map((x) => {
          return {
            position: x,
            color: 0xff0000,
            scale: [slotSize, slotSize, slotSize] as [number, number, number],
          };
        }),
      ],
    };
  },
});
