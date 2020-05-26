import React, { ReactNode, useRef, useState, useEffect } from 'react';


export const CodeWrapper = (props: { children: ReactNode }) => {

    const element = useRef(null as null | HTMLDivElement);
    const [scale, setScale] = useState(1);
    useEffect(() => {
        let lastScale = 1;
        const onScroll = () => {
            if (!element.current) { return; }
            const rect = element.current.getBoundingClientRect();
            const docRect = document.body.getBoundingClientRect();
            const y = window.scrollY;
            const topDistance = rect.top;
            const topDistancePerViewHeight = topDistance / window.innerHeight;

            const docEnd = docRect.bottom - window.innerHeight;
            const distanceToEndPerViewHeight = docEnd / window.innerHeight;

            const scaleReduce = topDistancePerViewHeight;
            let s = 1 - scaleReduce;
            s *= 1.1;
            s = s > 1 ? 1 : s;
            s = s < 0.25 ? 0.25 : s;

            let s2 = 1 - distanceToEndPerViewHeight;
            s2 *= 1;
            s2 = s2 > 1 ? 1 : s2;
            s2 = s2 < 0.25 ? 0.25 : s2;

            const sFinal = Math.max(s, s2);
            if (sFinal !== lastScale) {
                lastScale = sFinal;
                setScale(sFinal);
            }
            // console.log({ top: rect.top, y, topDistancePerViewHeight, docEnd, distanceToEndPerViewHeight });
        };
        onScroll();
        window.addEventListener(`scroll`, onScroll);
        return () => window.removeEventListener(`scroll`, onScroll);
    }, []);

    // 
    // overflow: `${scale > 0.8 ? `auto` : `visible`}` 
    // const overflow = scale >= 1 ? `auto` : `visible`;
    const overflow = `scroll`;
    return (
        <div className='code-wrapper' ref={element} style={{ overflowX: overflow }}>
            <div style={{ transform: `scale(${scale})`, transformOrigin: `top left` }} >
                <div>
                    {props.children}
                </div>
            </div>
        </div>
    );
};
