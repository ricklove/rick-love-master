import React from 'react';
import { View, Text } from 'react-native-lite';
import { LessonStepViewer_ConstructCode_Debug } from '../common/components/lesson-step-viewer-construct-code';
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

    const focusIndex = file.content.indexOf(`Hello World!`);
    const focusLength = `Hello World!`.length;

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

export const LessonEditor = (props: {}) => {

    const lessonStep: LessonStep_ConstructCode = {
        lessonData: createLesson(),
    };

    return (
        <LessonStepViewer_ConstructCode_Debug lessonStep={lessonStep} />
    );
};
