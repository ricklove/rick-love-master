import React, { useEffect } from 'react';
import { useLoadable } from 'utils-react/loadable';
import { Layout } from './layout/layout';
import { SEO } from './layout/seo';

export type ComponentLessonModulePageData = {
    lessonModuleKey: string;
    lessonModuleTitle: string;
};

export const ComponentLessonModulePage = (props: { data: ComponentLessonModulePageData }) => {
    return (
        <Layout>
            <SEO title={`Lesson: ${props.data.lessonModuleTitle}`} />
            <LessonModuleComponentAuto data={props.data} />
        </Layout>
    );
};


export const LessonModuleComponentAuto = (props: { data: ComponentLessonModulePageData }) => {
    const { lessonModuleKey } = props.data;

    const { LoadedComponent: LessonModulePlayerLoader, load } = useLoadable((async () => (await import(`../../code-training/lesson-player/lesson-module-player-loader`)).LessonModulePlayerLoader));
    useEffect(() => { (async () => await load())(); }, [load]);
    return (
        <div>
            {LessonModulePlayerLoader && (
                <LessonModulePlayerLoader lesson={{
                    lessonJsonUrl: `/lesson-modules/${lessonModuleKey}/${lessonModuleKey}.code-lesson.json`,
                    lessonBuildRootUrl: `/lesson-modules/${lessonModuleKey}/build`,
                }} />
            )}
            {!LessonModulePlayerLoader && (
                <>
                    <h1>Loading...</h1>
                </>
            )}
        </div>
    );
};
