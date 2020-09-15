/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useEffect } from 'react';
import { defaultDoodleDrawing, DoodleSegment, DoodleDrawing, encodeDoodleDrawing, decodeDoodleDrawing, doodleSegmentToSvgPath_line, doodleToSvg } from './doodle';

export const styles = {
    drawing: {
        width: 312,
        height: 312,
        color: `#FFFFFF`,
        backgroundColor: `#000000`,
    },
};

export const DoodleTestView = (props: {}) => {
    const [doodle, setDoodle] = useState(defaultDoodleDrawing());

    return (
        <>
            <DoodleDrawerView style={styles.drawing} drawing={doodle} onChange={setDoodle} />
            <DoodleDisplayView style={styles.drawing} drawing={doodle} />
        </>
    );
};

// export const DoodleDrawingView = (props: { drawing?: DoodleDrawing, onDrawingChanged: (drawing: DoodleDrawing) => void }) => {

//     const [doodle, setDoodle] = useState(props.drawing ?? defaultDoodleDrawing());
//     const changeDoodle = (value: DoodleDrawing) => {
//         setDoodle(value);
//         props.onDrawingChanged(value);
//     };

//     return (
//         <>
//             <DoodleDrawer style={styles.drawing} drawing={doodle} onChange={changeDoodle} />
//             {/* <div>
//                 {JSON.stringify(doodle)}
//             </div> */}
//             {/* <div>
//                 {JSON.stringify(decodeDoodleDrawing(encodeDoodleDrawing(doodle)))}
//             </div> */}

//             {/* <div>
//                 {encodeDoodleDrawing(doodle).doodleText}
//             </div> */}
//             {/* <div>
//                 {encodeDoodleDrawing(decodeDoodleDrawing(encodeDoodleDrawing(doodle))).doodleText}
//             </div>  */}
//         </>
//     );
// };


export const DoodleDrawerView = (props: { style: { width: number, height: number, color: string, backgroundColor: string }, drawing: DoodleDrawing, onChange: (drawing: DoodleDrawing) => void }) => {
    const { style, drawing, onChange } = props;
    const scale = style.width / drawing.width;

    const [segment, setSegment] = useState(null as null | DoodleSegment);
    const segmentClientStart = useRef(null as null | { clientX: number, clientY: number, x: number, y: number });
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
        // console.log(`onPressIn`, { event, pos });
        const div = divHost.current;
        if (!div) { return onIgnore(event); }

        const rect = div.getBoundingClientRect();


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

        setSegment({
            points: [{
                x: segmentClientStart.current.x,
                y: segmentClientStart.current.y,
            }],
        });

        return onIgnore(event);
    };
    const onPressOut = (event: Ev) => {
        // console.log(`onPressOut`, { event });
        const s = segment;
        if (!s) { return onIgnore(event); }

        onChange({
            ...drawing,
            segments: [...drawing.segments, s],
        });
        setSegment(null);
        segmentClientStart.current = null;

        return onIgnore(event);
    };
    const onMove = (pos: { x: number, y: number }) => {
        setSegment(s => {
            if (!s) { return null; }
            const lastPos = s.points[s.points.length - 1];
            if (Math.abs(lastPos.x - pos.x) + Math.abs(lastPos.y - pos.y) <= 2) {
                return s;
            }
            return { points: [...s.points, pos] };
        });
    };
    const onClientMove = (event: (Ev) & { clientX?: number, clientY?: number }, pos?: { clientX: number, clientY: number }) => {
        if (!segmentClientStart.current) {
            return onIgnore(event);
        }

        // console.log(`onClientMove`, { event, pos });
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

    useEffect(() => {
        // console.log(`Disable scroll on touch`);
        // Disable document scroll
        const onIgnoreNative = (e: Event) => {
            // If not drawing, don't ignore
            if (!segmentClientStart.current) { return true; }

            // console.log(`Prevent scroll on touch`);
            e.preventDefault();
            e.stopPropagation();
            e.cancelBubble = true;
            e.returnValue = false;
            return false;
        };
        document.addEventListener(`touchmove`, onIgnoreNative, { passive: false });
        return () => {
            document.removeEventListener(`touchmove`, onIgnoreNative);
        };
    }, []);

    return (
        <>
            <div style={{ position: `relative`, width: style.width, height: style.height, backgroundColor: style.backgroundColor }}>
                <svg style={{ width: style.width, height: style.height }} viewBox={`0 0 ${drawing.width} ${drawing.height}`} preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'>
                    {drawing.segments.map((x, i) => (
                        <path key={i} d={doodleSegmentToSvgPath_line(x)} stroke={style.color} fill='transparent' />
                    ))}
                    {segment && (
                        <path d={doodleSegmentToSvgPath_line(segment)} stroke={style.color} fill='transparent' />
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
                />
            </div>
            {/* <div>{doodleToSvg(drawing)}</div>
            <div>{encodeDoodleDrawing(drawing).doodleText}</div> */}
        </>
    );
};

export const DoodleDisplayView = ({ style, drawing }: { style: { width: number, height: number, color: string, backgroundColor: string }, drawing: DoodleDrawing }) => {
    return (
        <div style={{ width: style.width, height: style.height, backgroundColor: style.backgroundColor }}>
            <svg style={{ width: style.width, height: style.height }} viewBox={`0 0 ${drawing.width} ${drawing.height}`} preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'>
                {drawing.segments.map((x, i) => (
                    <path key={i} d={doodleSegmentToSvgPath_line(x)} stroke={style.color} fill='transparent' />
                ))}
            </svg>
        </div>
    );
};
