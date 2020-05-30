/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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

export const CodeWrapper_ZoomButtons = (props: { children: ReactNode, adjustWidth?: boolean }) => {

    const ZOOM_SIZE = 256;

    const element = useRef(null as null | HTMLDivElement);

    const [scale, setScale] = useState(globalState.scale);
    const zoomScale = (direction: 'in' | 'out') => {
        const targetScale = globalState.scale * (direction === `out` ? 0.9 : 1 / 0.9);
        setScale(targetScale);
        globalState.setScale(targetScale);
    };

    useEffect(() => {
        const unsub = globalState.subscribe(() => { setScale(globalState.scale); });
        return () => {
            unsub.unsubscribe();
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
            <div style={{ position: `absolute`, top: 4, right: 64, height: 16, width: 16, backgroundColor: `#FF0000` }} onClick={() => zoomScale(`out`)} />
            <div style={{ position: `absolute`, top: 4, right: 32, height: 16, width: 16, backgroundColor: `#00FF00` }} onClick={() => zoomScale(`in`)} />
        </div >
    );
};
