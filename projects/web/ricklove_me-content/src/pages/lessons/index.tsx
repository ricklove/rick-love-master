import React from 'react';
import { LessonListPage, LessonListPageData } from './_helpers/lessons';

export type PageProps = { data: LessonListPageData };

export const Page = (props: PageProps) => {
  return <LessonListPage data={props.data} />;
};
