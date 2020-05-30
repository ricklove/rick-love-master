/* eslint-disable no-underscore-dangle */
import React, { ReactNode, useRef, useState, useEffect } from 'react';


const globalState = {
    scale: 1,
    setScale: (s: number) => {
        globalState.scale = s;
        globalState._subscribers.forEach(x => x?.());
    },
    _subscribers: [] as (null | (() => void))[],
    subscribe: (sub: () => void) => {
        const i = globalState._subscribers.length;
        globalState._subscribers.push(sub);
        return {
            unsubscribe: () => {
                globalState._subscribers[i] = null;
            },
        };
    },
};

export const CodeWrapper_Zoom = (props: { children: ReactNode }) => {

    const ZOOM_SIZE = 256;

    const element = useRef(null as null | HTMLDivElement);
    const zoomElement = useRef(null as null | HTMLDivElement);
    const mouseState = useRef(false);

    const [scale, setScale] = useState(1);

    const mouseEvents = useRef((() => {
        const onMouseMove = (e: { clientX: number, clientY: number }) => {
            if (!zoomElement.current) { return; }
            if (!mouseState.current) { return; }
            const rect = zoomElement.current.getBoundingClientRect();
            const mTarget = e.clientX - rect.left;
            const s = mTarget / (ZOOM_SIZE * 0.5);
            setScale(s);
            globalState.setScale(s);
        };
        const onMouseDown = () => { mouseState.current = true; };
        const onMouseUp = () => { mouseState.current = false; };
        return {
            onMouseDown,
            onMouseUp,
            onMouseMove,
        };
    })());

    useEffect(() => {
        const {
            onMouseDown,
            onMouseUp,
            onMouseMove,
        } = mouseEvents.current;

        const unsub = globalState.subscribe(() => { setScale(globalState.scale); });

        // window.addEventListener(`mousedown`, onMouseDown);
        window.addEventListener(`pointerup`, onMouseUp);
        window.addEventListener(`pointermove`, onMouseMove);
        return () => {
            unsub.unsubscribe();

            // window.removeEventListener(`mousedown`, onMouseDown);
            window.removeEventListener(`pointerup`, onMouseUp);
            window.removeEventListener(`pointermove`, onMouseMove);
        };
    }, []);

    const overflow = `scroll`;
    return (
        <div className='code-wrapper' >
            <div style={{ height: 16 }} />
            <div ref={element} style={{ overflowX: overflow }}>
                <div style={{ transform: `scale(${scale})`, transformOrigin: `top left` }} >
                    <div>
                        {props.children}
                    </div>
                </div>
            </div>
            <div style={{ position: `absolute`, top: 4, right: 32, height: 8, width: ZOOM_SIZE, backgroundColor: `#FF0000` }}
                role='button'
                tabIndex={0}
                ref={zoomElement}
                onPointerDown={() => mouseEvents.current.onMouseDown()}
            >
                <div style={{ position: `absolute`, top: -4, left: ZOOM_SIZE * 0.5 * scale - 8, height: 16, width: 16, backgroundColor: `#00FF00` }} />
            </div>
        </div >
    );
};
