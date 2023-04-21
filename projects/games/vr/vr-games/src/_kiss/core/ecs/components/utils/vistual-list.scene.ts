import { debugScene } from './_debug-scene';
import { createVirtualList, VirtualListArgs } from './virtual-list';

const inputs: { [name: string]: VirtualListArgs } = {
  flat: {
    slotRadius: 0.2,
    gap: 0.02,
    path: [
      [-2, 1, -5],
      [-1, 1, -5],
      [0, 1, -5],
      [1, 1, -5],
      [2, 1, -5],
    ],
  },
  sine: {
    slotRadius: 0.04,
    gap: 0.06,
    path: [...new Array(10)].map((_, i) => [-2 + (i * 4) / 10, 1 + Math.sin(i), -5]),
  },
  sine2: {
    slotRadius: 0.03,
    gap: 0.05,
    path: [...new Array(20)].map((_, i) => [-2 + i * 0.25 + Math.sin(i * 3), 1 + Math.sin(i), -5 - i * 0.5]),
  },
  wavy: {
    slotRadius: 0.05,
    gap: 0.1,
    path: [
      [-2, 0, -5],
      [-1, 1, -2],
      [0, 1.5, -1],
      [1, 1, -2],
      [2, 2, -5],
    ],
  },
};

export const testSceneVirtualList = debugScene.create({
  name: `VirtualList`,
  inputs,
  getPoints: (input) => {
    const slotSize = input.slotRadius * 2;
    const result = createVirtualList(input);

    return {
      points: [
        ...result.slots.map((x) => {
          return {
            position: x.position,
            color: 0xff0000,
            scale: [slotSize, slotSize, slotSize] as [number, number, number],
          };
        }),
      ],
    };
  },
});
