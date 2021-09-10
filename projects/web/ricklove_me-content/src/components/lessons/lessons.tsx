import React, { useEffect } from 'react';
import { useLoadable } from '@ricklove/utils-react';
import { Layout } from '../layout/layout';
import { SEO } from '../layout/seo';
import { getNavigation } from '../site';
import { LessonWebData } from './types';

export type LessonPageData = {
  lesson: LessonWebData;
};

export type LessonListPageData = {
  lessons: LessonWebData[];
};

export const LessonListPage = (props: { data: LessonListPageData }) => {
  const Link = getNavigation().StaticPageLinkComponent;

  return (
    <Layout>
      <SEO title='Lessons' />
      {props.data.lessons.map((x) => (
        <div key={x.key} className='post-item'>
          <Link to={x.pageUrl}>
            <h2 className='post-item-title'>{x.title}</h2>
          </Link>
        </div>
      ))}
    </Layout>
  );
};

export const LessonPage = (props: { data: LessonPageData }) => {
  return (
    <Layout>
      <SEO title={`Lesson: ${props.data.lesson.title}`} />
      <LessonComponentAuto data={props.data} />
    </Layout>
  );
};

export const LessonComponentAuto = (props: { data: LessonPageData }) => {
  const { lesson } = props.data;

  const { LoadedComponent: LessonModulePlayerLoader, load } = useLoadable(
    async () => (await import(`@ricklove/code-training-lesson-player`)).LessonModulePlayerLoader,
  );
  useEffect(() => {
    (async () => await load())();
  }, [load]);
  return (
    <div>
      {LessonModulePlayerLoader && (
        <LessonModulePlayerLoader
          lesson={{
            lessonBuildRootUrl: lesson.buildRootUrl,
            lessonJsonUrl: lesson.jsonUrl,
          }}
        />
      )}
      {!LessonModulePlayerLoader && (
        <>
          <h1>Loading...</h1>
        </>
      )}
    </div>
  );
};
