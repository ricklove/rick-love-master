import React, { useEffect } from 'react';
import { Loading } from 'controls-react/loading';
import { useAutoLoadingError } from 'utils-react/hooks';
import { LessonProjectState } from '../lesson-types';

const styles = {
    container: {
        margin: 16,
        background: `#FFFFFF`,
    },
} as const;

export const LessonRenderView = (props: {}) => {

    return (
        <>
            <div style={styles.container}>
                <iframe src='http://localhost:3043/' title='Preview' />
            </div>
        </>
    );
};

export const LessonProjectStatePreview = ({ projectState, setProjectState }: { projectState: LessonProjectState, setProjectState: (projectState: LessonProjectState) => Promise<void> }) => {
    const { loading, error, doWork } = useAutoLoadingError();
    useEffect(() => {
        doWork(async (stopIfObsolete) => {
            await setProjectState(projectState);
        });
    }, [
        projectState,
    ]);
    return (
        <>
            <Loading loading={loading} />
            {!loading && (
                <LessonRenderView />
            )}
        </>
    );
};
