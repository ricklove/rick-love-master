/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Artwork } from '../art';

export const AsciiArtViewer = (props: { artwork: Artwork }) => {
    const [art, setArt] = useState(props.artwork.art);

    const { animate: animateRaw, autoAnimate } = props.artwork;

    useEffect(() => {
        const animate = animateRaw ?? (autoAnimate ? {
            fps: autoAnimate.fps ?? 100,
            draw: (t: number): string => {

                let v = props.artwork.art;
                for (const a of autoAnimate.replacements) {
                    v = v.replace(new RegExp(a.find, `g`), (x) => Math.random() < a.ratio ? a.replace : x);
                }

                return v;
            },
        } : null);

        if (!animate) { return; }

        const timeStartMs = Date.now();
        const draw = () => {
            setArt(animate.draw(Date.now() - timeStartMs));
        };
        const id = setInterval(draw, 1000 / animate.fps);
        draw();

        // eslint-disable-next-line consistent-return
        return () => clearInterval(id);
    }, []);

    return (
        <div>
            <span style={{ fontFamily: `monospace`, whiteSpace: `pre` }} >{art}</span>
        </div>
    );
};
