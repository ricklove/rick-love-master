import React, { useEffect, useState } from 'react';
import { LessonModule, LessonProjectState, SetProjectState } from '@ricklove/code-training-lesson-common';
import { C } from '@ricklove/react-controls';
import { View } from '@ricklove/react-native-lite';
import { useAsyncWorker } from '@ricklove/utils-react';
import { LessonModulePlayer } from './lesson-module-player';

const styles = {
  container: {
    background: `#111111`,
  },
  containerPanel: {
    background: `#292a2d`,
  },
  buttonView: {
    background: `#1e1e1e`,
    alignSelf: `flex-start`,
    padding: 8,
    margin: 1,
  },
  buttonText: {
    fontSize: 14,
    color: `#FFFFFFF`,
  },
} as const;

type LessonInfo = {
  lessonJsonUrl: string;
  lessonBuildRootUrl: string;
};
export const LessonModulePlayerLoader = (props: { lesson: LessonInfo }) => {
  const { loading, error, doWork } = useAsyncWorker();
  const [lessonModule, setLessonModule] = useState(null as null | LessonModule);
  useEffect(() => {
    doWork(async (stopIfObsolete) => {
      const lessonModuleResult = (await (await fetch(props.lesson.lessonJsonUrl)).json()) as LessonModule;
      stopIfObsolete();
      setLessonModule(lessonModuleResult);
    });
  }, [props.lesson]);

  const setProjectState: SetProjectState = async (projectState: LessonProjectState) => {
    return { iFrameUrl: `${props.lesson.lessonBuildRootUrl}/index.html?filesHashCode=${projectState.filesHashCode}` };
  };

  return (
    <>
      <View style={styles.container}>
        <C.Loading loading={loading} />
        <C.ErrorBox error={error} />
        {lessonModule && <LessonModulePlayer module={lessonModule} setProjectState={setProjectState} />}
      </View>
    </>
  );
};
