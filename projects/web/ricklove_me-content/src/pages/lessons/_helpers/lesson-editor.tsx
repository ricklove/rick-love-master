import React, { useEffect } from 'react';
import { LessonApiConfig } from '@ricklove/code-training-lesson-editor-common';
import { useLoadable } from '@ricklove/utils-react';
import { Layout } from '../../../components/layout/layout';
import { SEO } from '../../../components/layout/seo';

export const LessonEditorPage = (props: { config: LessonApiConfig }) => {
  return (
    <Layout>
      <SEO title={`Lesson Editor`} />
      <LessonComponentAuto {...props} />
    </Layout>
  );
};

export const LessonComponentAuto = (props: { config: LessonApiConfig }) => {
  const { LoadedComponent: LessonModulesClientEditor, load } = useLoadable(
    async () => (await import(`@ricklove/code-training-lesson-editor-client`)).LessonModulesClientEditor,
  );
  useEffect(() => {
    (async () => await load())();
  }, [load]);
  return (
    <div>
      {LessonModulesClientEditor && <LessonModulesClientEditor {...props} />}
      {!LessonModulesClientEditor && (
        <>
          <h1>Loading...</h1>
        </>
      )}
    </div>
  );
};
