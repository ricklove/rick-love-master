import { debugScene } from './_debug-scene';
import { createVirtualList, VirtualListArgs } from './virtual-list';

const inputs: { [name: string]: VirtualListArgs<string> } = {
  flat: {
    slotRadius: 0.2,
    gap: 0.02,
    items: [...new Array(1)].map((_, i) => `${i}`),
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
    items: [...new Array(10000)].map((_, i) => `${i}`),
    path: [...new Array(10)].map((_, i) => [-2 + (i * 4) / 10, 1 + Math.sin(i), -5]),
  },
  sine2: {
    slotRadius: 0.03,
    gap: 0.05,
    items: [...new Array(10000)].map((_, i) => `${i}`),
    path: [...new Array(20)].map((_, i) => [-2 + i * 0.25 + Math.sin(i * 3), 1 + Math.sin(i), -5 - i * 0.5]),
  },
  wavy: {
    slotRadius: 0.05,
    gap: 0.1,
    items: [...new Array(10)].map((_, i) => `${i}`),
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
  getResult: (input) => {
    const slotSize = input.slotRadius * 2;
    const result = createVirtualList(input);

    return {
      getPoints: () => [
        ...result.slots.map((x) => {
          return {
            position: x.position,
            color: 0xff0000,
            scale: [slotSize, slotSize, slotSize] as [number, number, number],
            text: x.item,
          };
        }),
      ],
      actions: {
        forward1: () => result.scroll(1),
        forwardSmall: () => result.scroll(0.03),
        forwardMedium: () => result.scroll(0.3),
        forwardLarge: () => result.scroll(10),
        backward1: () => result.scroll(-1),
        backwardSmall: () => result.scroll(-0.03),
        backwardMedium: () => result.scroll(-0.3),
        backwardLarge: () => result.scroll(-10),
      },
    };
  },
});
