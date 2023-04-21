import { createSmoothCurve, SmoothCurveArgs } from './smooth-curve';

export type VirtualListArgs = SmoothCurveArgs & {
  slotRadius: number;
  gap: number;
};
export const createVirtualList = ({ path, slotRadius, gap }: VirtualListArgs) => {
  const smoothCurve = createSmoothCurve({ path });
  const slotSize = slotRadius * 2 + gap;
  const count = Math.floor(smoothCurve.totalSegmentLength / slotSize);
  const slots = [...new Array(count)].map((_, i) => {
    const position = smoothCurve.getPointOnPath(i / count);
    return {
      position,
    };
  });

  return {
    slots,
  };
};
