export type SmoothCurveArgs = {
  path: [number, number, number][];
};
export const createSmoothCurve = ({ path }: SmoothCurveArgs) => {
  // function to get any point along the path
  const pathMids = path
    .map((p, i) => {
      if (i === 0) return p;
      const p0 = path[i - 1];
      return [(p[0] + p0[0]) / 2, (p[1] + p0[1]) / 2, (p[2] + p0[2]) / 2] as [number, number, number];
    })
    .slice(1);
  const getPointOnSegment = (iSegment: number, t: number) => {
    if (iSegment - 1 < 0) {
      return pathMids[0];
    }
    if (iSegment + 1 > path.length - 1) {
      return pathMids[pathMids.length - 1];
    }

    const p0 = pathMids[iSegment - 1];
    const p1 = path[iSegment];
    const p2 = pathMids[iSegment];

    const t2 = t * t;
    const invT = 1 - t;
    const invT2 = invT * invT;

    // Quadratic Bézier
    const x = invT2 * p0[0] + 2 * invT * t * p1[0] + t2 * p2[0];
    const y = invT2 * p0[1] + 2 * invT * t * p1[1] + t2 * p2[1];
    const z = invT2 * p0[2] + 2 * invT * t * p1[2] + t2 * p2[2];

    return [x, y, z] as [number, number, number];
  };

  const segmentLengths = path.map((p, i) => {
    if (i === 0) return 0;
    const subPointCount = 7;
    const subPoints = [...Array(subPointCount)].map((_, iSub) => {
      const t = iSub / (subPointCount - 1);
      return getPointOnSegment(i, t);
    });
    const subSegmentLengths = subPoints.map((p, i) => {
      if (i === 0) return 0;
      const p0 = subPoints[i - 1];
      return Math.sqrt((p[0] - p0[0]) ** 2 + (p[1] - p0[1]) ** 2 + (p[2] - p0[2]) ** 2);
    });

    return subSegmentLengths.reduce((a, b) => a + b, 0);
  });
  const totalSegmentLength = segmentLengths.reduce((a, b) => a + b, 0);

  const getPointOnPath = (t: number) => {
    const tSegmentLength = t * totalSegmentLength;
    let iSegment = 0;
    let accSegmentLength = 0;
    while (accSegmentLength < tSegmentLength) {
      accSegmentLength += segmentLengths[iSegment];
      iSegment++;
    }
    iSegment--;

    const distanceToSegmentEnd = accSegmentLength - tSegmentLength;
    const tInSegment = 1 - distanceToSegmentEnd / segmentLengths[iSegment];
    return getPointOnSegment(iSegment, tInSegment);
  };

  return {
    totalSegmentLength,
    segmentLengths,
    getPointOnPath,
  };
};
