/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useEffect } from 'react';

type DoodleDrawing = {
    width: number;
    height: number;
    segments: DoodleSegment[];
};
type DoodleSegment = {
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

const emptyDrawing: DoodleDrawing = {
    width: 128,
    height: 128,
    segments: [],
};

export const DoodleView = (props: {}) => {

    const [doodle, setDoodle] = useState(emptyDrawing);

    return (
        <>
            <DoodleSvg style={{ width: 256, height: 256, color: `#FFFFFF`, backgroundColor: `#000000` }} drawing={doodle} onChange={setDoodle} />
        </>
    );
};

// const createBezierCurvePath = (segment: DoodleSegment) => {
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

const createLinePath = (segment: DoodleSegment) => {
    if (segment.points.length <= 0) { return ``; }
    if (segment.points.length === 1) { return `M${segment.points[0].x} ${segment.points[0].y} L${segment.points[0].x} ${segment.points[0].y}`; }

    return `M${segment.points[0].x} ${segment.points[0].y} L${segment.points.slice(1).map(p => `${p.x} ${p.y}`).join(` `)}`;
};

const DoodleSvg = (props: { style: { width: number, height: number, color: string, backgroundColor: string }, drawing: DoodleDrawing, onChange: (drawing: DoodleDrawing) => void }) => {
    const { style, drawing, onChange } = props;
    const scale = style.width / drawing.width;

    const [segment, setSegment] = useState(null as null | DoodleSegment);
    const segmentClientStart = useRef({ clientX: 0, clientY: 0, x: 0, y: 0 });
    const divHost = useRef(null as null | HTMLDivElement);

    type Ev = React.SyntheticEvent;

    const onIgnore = (e: Ev) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.cancelBubble = true;
        e.nativeEvent.returnValue = false;
        return false;
    };

    const onPressIn = (event: (Ev) & { clientX?: number, clientY?: number }, pos?: { clientX: number, clientY: number }) => {
        console.log(`onPressIn`, { event, pos });
        const div = divHost.current;
        if (!div) { return onIgnore(event); }

        const rect = div.getBoundingClientRect();

        setSegment({ points: [] });

        const p = {
            clientX: pos?.clientX ?? event.clientX ?? 0,
            clientY: pos?.clientY ?? event.clientY ?? 0,
        };

        segmentClientStart.current = {
            clientX: p.clientX,
            clientY: p.clientY,
            x: Math.floor((p.clientX - rect.x) / scale),
            y: Math.floor((p.clientY - rect.y) / scale),
        };

        return onIgnore(event);
    };
    const onPressOut = (event: Ev) => {
        console.log(`onPressOut`, { event });
        const s = segment;
        if (!s) { return onIgnore(event); }

        onChange({
            ...drawing,
            segments: [...drawing.segments, s],
        });
        setSegment(null);

        return onIgnore(event);
    };
    const onMove = (pos: { x: number, y: number }) => {
        setSegment(s => {
            if (!s) { return null; }
            return { points: [...s.points, pos] };
        });
    };
    const onClientMove = (event: (Ev) & { clientX?: number, clientY?: number }, pos?: { clientX: number, clientY: number }) => {
        console.log(`onClientMove`, { event, pos });
        const p = {
            clientX: pos?.clientX ?? event.clientX ?? 0,
            clientY: pos?.clientY ?? event.clientY ?? 0,
        };
        const dPos = {
            x: Math.floor((p.clientX - segmentClientStart.current.clientX) / scale) + segmentClientStart.current.x,
            y: Math.floor((p.clientY - segmentClientStart.current.clientY) / scale) + segmentClientStart.current.y,
        };

        onMove(dPos);
        return onIgnore(event);
    };

    // useEffect(() => {
    //     console.log(`divHost`, { divHost });
    //     const div = divHost.current;
    //     if (!div) { return () => { }; }

    //     const onTouchStart = (x: Event) => onPressIn(x, (x as TouchEvent).touches[0]);
    //     const onTouchMove = (x: Event) => onClientMove(x, (x as TouchEvent).touches[0]);

    //     div.addEventListener(`mouseDown`, onPressIn, { passive: false });
    //     div.addEventListener(`onTouchStart`, onTouchStart, { passive: false });
    //     div.addEventListener(`onMouseUp`, onPressOut, { passive: false });
    //     div.addEventListener(`onTouchEnd`, onPressOut, { passive: false });
    //     div.addEventListener(`onMouseLeave`, onPressOut, { passive: false });
    //     div.addEventListener(`onTouchEndCapture`, onPressOut, { passive: false });
    //     div.addEventListener(`onMouseMove`, onClientMove, { passive: false });
    //     div.addEventListener(`onTouchMove`, onTouchMove, { passive: false });

    //     return () => {
    //         div.removeEventListener(`mouseDown`, onPressIn);
    //         div.removeEventListener(`onTouchStart`, onTouchStart);
    //         div.removeEventListener(`onMouseUp`, onPressOut);
    //         div.removeEventListener(`onTouchEnd`, onPressOut);
    //         div.removeEventListener(`onMouseLeave`, onPressOut);
    //         div.removeEventListener(`onTouchEndCapture`, onPressOut);
    //         div.removeEventListener(`onMouseMove`, onClientMove);
    //         div.removeEventListener(`onTouchMove`, onTouchMove);
    //     };
    // }, [divHost.current]);

    return (
        <div style={{ position: `relative`, width: style.width, height: style.height, backgroundColor: style.backgroundColor }}>
            <svg style={{ width: style.width, height: style.height }} viewBox={`0 0 ${drawing.width} ${drawing.height}`} preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'>
                {drawing.segments.map((x, i) => (
                    <path key={i} d={createLinePath(x)} stroke={style.color} fill='transparent' />
                ))}
                {segment && (
                    <path d={createLinePath(segment)} stroke={style.color} fill='transparent' />
                )}
            </svg>
            <div ref={divHost} style={{ position: `absolute`, left: 0, right: 0, top: 0, bottom: 0, zIndex: 10 }}
                onMouseDown={onPressIn}
                onMouseUp={onPressOut}
                onMouseMove={onClientMove}
                onMouseLeave={onPressOut}
                onTouchStart={x => onPressIn(x, x.touches[0])}
                onTouchEnd={onPressOut}
                onTouchCancel={onPressOut}
                onTouchMove={x => onClientMove(x, x.touches[0])}
                onTouchEndCapture={onPressOut}
            > </div>
        </div>
    );
};
