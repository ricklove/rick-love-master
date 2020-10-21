import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, TextInput } from 'react-native-lite';
import { ErrorBox } from 'controls-react/error-box';
import { Loading } from 'controls-react/loading';
import { useAutoLoadingError } from 'utils-react/hooks';
import { LessonModule, LessonProjectState, SetProjectState } from '../common/lesson-types';
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

    const { loading, error, doWork } = useAutoLoadingError();
    const [lessonModule, setLessonModule] = useState(null as null | LessonModule);
    useEffect(() => {
        doWork(async (stopIfObsolete) => {
            const lessonModuleResult = await (await fetch(props.lesson.lessonJsonUrl)).json() as LessonModule;
            setLessonModule(lessonModuleResult);
        });
    }, [props.lesson]);

    const setProjectState: SetProjectState = async (projectState: LessonProjectState) => {
        return { iFrameUrl: `${props.lesson.lessonBuildRootUrl}?filesHashCode=${projectState.filesHashCode}` };
    };

    return (
        <>
            <View style={styles.container}>
                <Loading loading={loading} />
                <ErrorBox error={error} />
                {lessonModule && (
                    <LessonModulePlayer module={lessonModule} setProjectState={setProjectState} />
                )}
            </View>
        </>
    );
};
