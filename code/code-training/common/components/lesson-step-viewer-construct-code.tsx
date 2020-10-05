import React from 'react';
import { View, Text } from 'react-native-lite';
import { LessonProjectFileSelection, LessonStep_ConstructCode } from '../lesson-types';
import { CodeEditor } from './code-editor';

export const LessonStepViewer_ConstructCode = (props: { lessonStep: LessonStep_ConstructCode }) => {

    return (
        <LessonStepViewer_ConstructCode_Debug {...props} />
    );
};

const debugStyles = {
    codeView: {
        padding: 8,
        display: `block`,
        backgroundColor: `#000000`,
    },
    codeText: {
        fontSize: 12,
    },
    codeFocusText: {
        fontSize: 12,
        backgroundColor: `#222222`,
    },
    infoView: {
    },
    infoText: {
        margin: 8,
        fontSize: 12,
        wrap: `wrap`,
    },
} as const;

export const LessonStepViewer_ConstructCode_Debug = (props: { lessonStep: LessonStep_ConstructCode }) => {
    const {
        projectState,
        focus,
        title,
        objective,
        explanation,
        task,
    } = props.lessonStep.lessonData;
    return (
        <>
            {projectState.files.map(x => (
                <CodeEditor key={x.path} code={x.content} language={x.language} selection={focus.file.path === x.path ? focus : undefined} mode='display' />
            ))}
            <View style={debugStyles.infoView}>
                <Text style={debugStyles.infoText}>{`title: ${title}`}</Text>
                <Text style={debugStyles.infoText}>{`objective: ${objective}`}</Text>
                <Text style={debugStyles.infoText}>{`explanation: ${explanation}`}</Text>
                <Text style={debugStyles.infoText}>{`task: ${task}`}</Text>
            </View>
        </>
    );
};
