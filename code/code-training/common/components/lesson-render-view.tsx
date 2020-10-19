import React, { useEffect, useState } from 'react';
import { Loading } from 'controls-react/loading';
import { useAutoLoadingError } from 'utils-react/hooks';
import { LessonProjectState, SetProjectState } from '../lesson-types';

const styles = {
    container: {
        margin: 16,
        background: `#FFFFFF`,
    },
} as const;

export const LessonRenderView = (props: { iFrameUrl: string }) => {

    return (
        <>
            <div style={styles.container}>
                <iframe src={props.iFrameUrl} title='Preview' />
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
