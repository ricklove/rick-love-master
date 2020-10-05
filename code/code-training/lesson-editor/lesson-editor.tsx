import React from 'react';
import { View, Text } from 'react-native-lite';
import { FileCodeEditor } from '../common/components/code-editor';
import { LessonData, LessonStep_ConstructCode } from '../common/lesson-types';

const createLesson = (): LessonData => {
    const file = {
        path: `test.tsx`,
        content: `
import React from 'react';

export const MinimalReactComponent = (props: {}) => {
    return (
        <span>Hello World!</span>
    );
};
        `.trim(),
        language: `tsx` as const,
    };

    const focusIndex = file.content.indexOf(`<span>Hello World!</span>`);
    const focusLength = `<span>Hello World!</span>`.length;

    const lesson: LessonData = {
        projectState: {
            files: [file],
        },
        focus: {
            file,
            index: focusIndex,
            length: focusLength,
        },
        title: `Test Lesson`,
        objective: `Test the Editor`,
        explanation: `Learn some stuff`,
        task: `Make a test variable true`,
        descriptions: [],
        experiments: [],
    };
    return lesson;
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

export const LessonEditor = (props: {}) => {

    const lessonStep: LessonStep_ConstructCode = {
        lessonData: createLesson(),
    };
    const {
        projectState,
        focus,
        title,
        objective,
        explanation,
        task,
    } = lessonStep.lessonData;

    return (
        <>
            {projectState.files.map(x => (
                <FileCodeEditor key={x.path} file={x} selection={focus.file.path === x.path ? focus : undefined} mode={focus.file.path === x.path ? `type` : `display`} />
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
