import React from 'react';
import { LessonEditorPage } from './_helpers/lesson-editor';

export type PageProps = {};

export const Page = (_props: PageProps) => {
  return (
    <LessonEditorPage
      config={{
        lessonApiUrl: `http://localhost:3056/api`,
      }}
    />
  );
};
