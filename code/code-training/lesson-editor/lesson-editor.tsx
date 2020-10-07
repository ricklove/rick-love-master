import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native-lite';
import { FileCodeEditor } from '../common/components/code-editor';
import { LessonData, LessonStep_ConstructCode } from '../common/lesson-types';

const createDefaultLesson = (): LessonData => {
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
            filePath: file.path,
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
    sectionHeaderText: {
        margin: 8,
        fontSize: 18,
        color: `#FFFF88`,
    },
    infoView: {
    },
    infoText: {
        margin: 8,
        fontSize: 12,
        wrap: `wrap`,
    },
    jsonText: {
        margin: 8,
        fontSize: 12,
        color: `#FFFFFF`,
        background: `#000000`,
    },
} as const;

const createLessonState = (lesson: LessonData, lessonJson?: string) => {
    type LessonSteps = {
        constructCode: LessonStep_ConstructCode;
    };
    const lessonSteps: LessonSteps = {
        constructCode: {
            lessonData: lesson,
        },
    };

    return {
        lesson,
        lessonJson: lessonJson ?? JSON.stringify(lesson, null, 2),
        lessonSteps,
    };
};

export const LessonEditor = (props: {}) => {

    const [data, setData] = useState(createLessonState(createDefaultLesson()));

    const changeLessonJson = (json: string) => {
        setData(createLessonState(JSON.parse(json), json));
    };

    const {
        projectState,
        focus,
        title,
        objective,
        explanation,
        task,
    } = data.lesson;

    return (
        <>
            <Text style={debugStyles.sectionHeaderText}>Project Files</Text>
            {projectState.files.map(x => (
                <FileCodeEditor key={x.path} file={x} selection={focus.filePath === x.path ? focus : undefined} mode={focus.filePath === x.path ? `type` : `display`} />
            ))}
            <Text style={debugStyles.sectionHeaderText}>Lesson</Text>
            <View style={debugStyles.infoView}>
                <Text style={debugStyles.infoText}>{`title: ${title}`}</Text>
                <Text style={debugStyles.infoText}>{`objective: ${objective}`}</Text>
                <Text style={debugStyles.infoText}>{`explanation: ${explanation}`}</Text>
                <Text style={debugStyles.infoText}>{`task: ${task}`}</Text>
            </View>
            <Text style={debugStyles.sectionHeaderText}>Lesson Data</Text>
            <View>
                <TextInput
                    style={debugStyles.jsonText}
                    value={data.lessonJson}
                    onChange={changeLessonJson}
                    autoCompleteType='off'
                    keyboardType='default'
                    multiline
                    numberOfLines={20}
                />
            </View>
        </>
    );
};
