import { createSmoothCurve, SmoothCurveArgs } from './smooth-curve';

export type VirtualListArgs<TItem> = SmoothCurveArgs & {
  slotRadius: number;
  gap: number;
  items: TItem[];
};
export const createVirtualList = <TItem>({ path, slotRadius, gap, items: itemsInit }: VirtualListArgs<TItem>) => {
  const state = {
    items: itemsInit,
  };
  const smoothCurve = createSmoothCurve({ path });
  const slotSize = slotRadius * 2 + gap;
  const count = Math.floor(smoothCurve.totalSegmentLength / slotSize);

  const tSlotSize = 1 / count;
  const slots = [...new Array(count)].map((_, i) => {
    const tCurve = i / count;
    const position = smoothCurve.getPointOnPath(tCurve);
    return {
      tCurve,
      position,
      iItem: i,
      item: state.items[i] as undefined | TItem,
    };
  });

  /** scroll
   * @param delta -1 is backwards an entire item slot, 1 is forward an entire item slot
   */
  const scroll = (delta: number) => {
    console.log(`scroll`, { delta });
    slots.forEach((x) => {
      x.tCurve -= delta * tSlotSize;
      if (x.tCurve < 0) {
        x.tCurve += 1;
        x.iItem += count;
        x.item = state.items[x.iItem];
      }
      if (x.tCurve > 1) {
        x.tCurve -= 1;
        x.iItem -= count;
        x.item = state.items[x.iItem];
      }

      x.position = smoothCurve.getPointOnPath(x.tCurve);
    });
  };

  return {
    slots,
    scroll,
    setItems: (items: TItem[]) => {
      state.items = items;
    },
  };
};
