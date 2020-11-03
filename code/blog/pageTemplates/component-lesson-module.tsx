import React, { useEffect } from 'react';
import { useLoadable } from 'utils-react/loadable';
import { Layout } from './layout/layout';
import { SEO } from './layout/seo';
import { getNavigation } from '../site/store';

export type ComponentLessonModulePageData = {
    lessonModuleKey: string;
    lessonModuleTitle: string;
};

export type ComponentLessonListPageData = {
    lessons: {
        sitePath: string;
        lessonModuleKey: string;
        lessonModuleTitle: string;
    }[];
};

export const ComponentLessonListPage = (props: { data: ComponentLessonListPageData }) => {
    const Link = getNavigation().StaticPageLinkComponent;

    return (
        <Layout>
            <SEO title='Lessons' />
            {props.data.lessons.map(x => (
                <div key={x.lessonModuleKey} className='post-item'>
                    <Link to={x.sitePath}>
                        <h2 className='post-item-title'>{x.lessonModuleTitle}</h2>
                    </Link>
                </div>
            ))}
        </Layout>

    );
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
