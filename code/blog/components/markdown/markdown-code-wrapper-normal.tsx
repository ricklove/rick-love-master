import React, { ReactNode, useRef, useState, useEffect } from 'react';


export const CodeWrapper_Normal = (props: { children: ReactNode }) => {

    const element = useRef(null as null | HTMLDivElement);
    const [scale, setScale] = useState(1);

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
