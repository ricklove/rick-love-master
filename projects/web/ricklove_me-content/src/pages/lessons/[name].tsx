import React from 'react';
import { LessonPage, LessonPageData } from '../../components/lessons/lessons';

export type PageProps = {
  params: { name: string };
  pageData: LessonPageData;
};

export const Page = (props: PageProps) => {
  return <LessonPage data={props.pageData} />;
};
