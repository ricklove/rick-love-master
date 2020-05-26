/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-underscore-dangle */
import React, { ReactNode, useRef, useState, useEffect } from 'react';

const moduleState = {
    scale: 1,
    setScale: (x: number) => { moduleState.scale = x; },
};

export const ZoomWrapper = (props: { children: ReactNode }) => {

    const element = useRef(null as null | HTMLDivElement);

    const [scale, setScale] = useState(moduleState.scale);
    const zoomScale = (direction: 'in' | 'out') => {
        const targetScale = moduleState.scale * (direction === `out` ? 0.9 : 1 / 0.9);
        setScale(targetScale);
        moduleState.setScale(targetScale);
    };

    // useEffect(() => {
    //     const unsub = globalState.subscribe(() => { setScale(globalState.scale); });
    //     return () => {
    //         unsub.unsubscribe();
    //     };
    // }, []);

    const buttonStyle = {
        position: `absolute`,
        display: `flex`,
        height: 32, width: 32,
        top: -4, right: 64,
        // backgroundColor: `#FF0000`,
        fontFamily: `monospace`,
        color: `#000000`,
        padding: 0,
        margin: 0,
        // border: `1px solid #000000`,
        justifyContent: `center`,
        alignItems: `center`,
        // overflow: `hidden`,
    } as const;
    const buttonSpanStyle = {
        display: `block`,
        fontWeight: `bold`,
        fontSize: 16,
    } as const;

    const overflow = `scroll`;
    return (
        <div className='zoom-wrapper' >
            <div ref={element} style={{ overflowX: overflow }}>
                <div style={{ transform: `scale(${scale})`, transformOrigin: `top left`, width: `calc(100%/${scale})` }} >
                    <div>
                        {props.children}
                    </div>
                </div>
            </div>
            <div style={{ ...buttonStyle, right: 64 }} onClick={() => zoomScale(`out`)} ><span style={buttonSpanStyle}>&#x2796;</span></div>
            <div style={{ ...buttonStyle, right: 32 }} onClick={() => zoomScale(`in`)} ><span style={buttonSpanStyle}>&#x2795;</span></div>
        </div >
    );
};
