import React, { useEffect, useRef, useState } from 'react';
import { Loading } from 'controls-react/loading';
import { useAutoLoadingError } from 'utils-react/hooks';
import { LessonProjectState, SetProjectState } from '../lesson-types';

const styles = {
    container: {

    },
    iFrame: {
        width: `100%`,
        height: 300,
        border: `solid 4px #888888`,
        background: `#FFFFFF`,
    },
} as const;

export const LessonRenderView = (props: { iFrameUrl: string }) => {

    const containerRef = useRef(null as null | HTMLDivElement);
    const lastWidth = useRef(``);
    const lastHeight = useRef(``);
    const intervalId = useRef(setInterval(() => { }, 100 * 1000));
    const onResizeHeight = (target: HTMLIFrameElement) => {
        if (!containerRef.current) { return; }

        try {
            const borderSize = 4;
            const width = `${containerRef.current.clientWidth - borderSize * 2}px`;
            const height = `${(target.contentWindow?.document.body.scrollHeight ?? 300) + borderSize * 2}px`;
            if (height !== lastHeight.current
                || width !== lastWidth.current) {
                lastWidth.current = width;
                lastHeight.current = height;
                target.style.width = width;
                target.style.height = height;
                target.style.border = `solid ${borderSize}px #888888`;
            }
        } catch {
            // Ignore cross-domain error
        }
    };

    const onLoad = (target: HTMLIFrameElement) => {
        onResizeHeight(target);
        clearInterval(intervalId.current);
        intervalId.current = setInterval(() => onResizeHeight(target), 100);
    };
    useEffect(() => {
        lastHeight.current = ``;
        clearInterval(intervalId.current);
        intervalId.current = setInterval(() => { }, 100 * 1000);
        return () => {
            clearInterval(intervalId.current);
        };
    }, [props.iFrameUrl]);

    return (
        <>
            <div style={styles.container} ref={containerRef}>
                <iframe style={styles.iFrame} src={props.iFrameUrl} title='Preview'
                    onLoad={e => { onLoad(e.target as HTMLIFrameElement); }}
                />
            </div>
        </>
    );
};

export const LessonProjectStatePreview = ({ projectState, setProjectState }: { projectState: LessonProjectState, setProjectState: SetProjectState }) => {
    const { loading, error, doWork } = useAutoLoadingError();
    const [iFrameUrl, setIFrameUrl] = useState(null as null | string);
    useEffect(() => {
        doWork(async (stopIfObsolete) => {
            const r = await setProjectState(projectState);
            setIFrameUrl(r.iFrameUrl);
        });
    }, [
        projectState,
    ]);
    return (
        <>
            <Loading loading={loading} />
            {!loading && iFrameUrl && (
                <LessonRenderView iFrameUrl={iFrameUrl} />
            )}
        </>
    );
};
