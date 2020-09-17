export type DoodleDrawingStorageService = {
    saveDrawing: (prompt: string, drawing: DoodleDrawing) => Promise<void>;
    getDrawings: (prompt: string, options?: { includeOtherPrompts?: boolean, maxCount?: number }) => Promise<{ doodles: DoodleData[] }>;
    saveBestDrawingSelection: (doodle: DoodleData) => Promise<void>;
};


export type DoodleSummaryDataJson = {
    doodles: DoodleData_EncodedWithScore[];
};
export type DoodleData_EncodedWithScore = DoodleData_Encoded & {
    s: number;
};

export type DoodleUserDrawingDataJson = {
    doodles: DoodleData_Encoded[];
};

export type DoodleUserVotesDataJson = {
    doodleVotes: DoodleScoreVote[];
};

export type DoodleScoreVote = {
    // Doodle Key
    k: string;
    // Doodle Timestamp
    t: number;
};

export type DoodleScore = {
    doodleKey: string;
    score: number;
};

export type DoodleData = {
    key: string;
    drawing: DoodleDrawing;
    prompt: string;
    timestamp: number;
};
export type DoodleData_Encoded = {
    // Doodle Key
    k: string;
    // Doodle Drawing
    d: DoodleDrawingEncoded;
    // Prompt
    p: string;
    // Doodle Timestamp
    t: number;
};

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


// const doodleSegmentToSvgPath_bezier = (segment: DoodleSegment) => {
//     const delta1 = {
//         x: segment.points[2].x - segment.points[1].x,
//         y: segment.points[2].y - segment.points[1].y,
//     };
//     const controlPoint = {
//         x: segment.points[1].x - delta1.x * 0.5,
//         y: segment.points[1].y - delta1.y * 0.5,
//     };
//     return `M${segment.points[0].x} ${segment.points[0].y} Q${controlPoint.x} ${controlPoint.y} ${segment.points[1].x} ${segment.points[1].y}T${segment.points.slice(2, -1).map(p => `${p.x} ${p.y}`).join(` `)}`;
// };


export const doodleSegmentToSvgPath_line = (segment: DoodleSegment) => {
    if (segment.points.length <= 0) { return ``; }
    if (segment.points.length === 1) { return `M${segment.points[0].x} ${segment.points[0].y} L${segment.points[0].x} ${segment.points[0].y}`; }

    let last = segment.points[0];
    return `M${segment.points[0].x} ${segment.points[0].y} l${segment.points.slice(1).map(p => {
        const t = `${p.x - last.x} ${p.y - last.y}`;
        last = p;
        return t;
    }).join(` `)}`;
};

export const doodleToSvg = (drawing: DoodleDrawing) => {
    // preserveAspectRatio='none' stroke='#000000' fill='transparent' xmlns='http://www.w3.org/2000/svg'
    return `
<svg viewBox='0 0 ${drawing.width} ${drawing.height}' stroke='#000000' fill='transparent'>
    ${drawing.segments.map((x, i) => (
        `<path d='${doodleSegmentToSvgPath_line(x)}' />`
    )).join(``)}
</svg>
    `.trim();
};
