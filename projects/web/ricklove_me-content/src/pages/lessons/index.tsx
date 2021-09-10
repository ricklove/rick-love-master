import React from 'react';
import { LessonListPage, LessonListPageData } from '../../components/lessons/lessons';

export type PageProps = { data: LessonListPageData };

export const Page = (props: PageProps) => {
  return <LessonListPage data={props.data} />;
};
