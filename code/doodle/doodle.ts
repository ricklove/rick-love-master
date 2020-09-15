
export type DoodleDrawing = {
    width: number;
    height: number;
    segments: DoodleSegment[];
};
export type DoodleSegment = {
    points: { x: number, y: number }[];
};

// const sampleDrawing: DoodleDrawing = {
//     width: 128,
//     height: 128,
//     segments: [{
//         points: [
//             { x: 10, y: 10 },
//             { x: 50, y: 10 },
//             { x: 50, y: 50 },
//             { x: 10, y: 50 },
//             { x: 10, y: 10 },
//         ],
//     }],
// };

export const defaultDoodleDrawing = (): DoodleDrawing => ({
    width: 104,
    height: 104,
    segments: [],
});

export type DoodleDrawingEncoded = {
    doodleText: string;
};
type DoodleDrawingEncodedObj = {
    w: number;
    h: number;
    s: {
        x: number;
        y: number;
        p: string;
    }[];
};
const encodeDoodleSegmentPoints = (points: { x: number, y: number }[]): string => {
    if (points.length <= 0) { return ``; }
    let last = points[0];
    let t = ``;

    points.slice(1).forEach(p => {
        t += `${p.x - last.x},${p.y - last.y};`;
        last = p;
    });

    return t;
};
const decodeDoodleSegmentPoints = (x: number, y: number, pointsString: string): { x: number, y: number }[] => {
    if (!pointsString) { return [{ x, y }]; }
    let last = { x, y };
    const pointRelPos = pointsString.split(`;`).filter(p => p);
    const points = pointRelPos.map(p => {
        const parts = p.split(`,`);
        const point = {
            x: last.x + Number.parseInt(parts[0], 10),
            y: last.y + Number.parseInt(parts[1], 10),
        };
        last = point;
        return point;
    });

    return [...points];
};

export const encodeDoodleDrawing = (doodle: DoodleDrawing): DoodleDrawingEncoded => {
    const o: DoodleDrawingEncodedObj = {
        w: doodle.width,
        h: doodle.height,
        s: doodle.segments.map(x => ({
            x: x.points[0].x,
            y: x.points[0].y,
            p: encodeDoodleSegmentPoints(x.points),
        })),
    };
    return { doodleText: JSON.stringify(o) };
};
export const decodeDoodleDrawing = (doodle: DoodleDrawingEncoded): DoodleDrawing => {
    const o: DoodleDrawingEncodedObj = JSON.parse(doodle.doodleText) as DoodleDrawingEncodedObj;
    return {
        width: o.w,
        height: o.h,
        segments: o.s.map(p => {
            return {
                points: [{ x: p.x, y: p.y }, ...decodeDoodleSegmentPoints(p.x, p.y, p.p)],
            };
        }),
    };
};
