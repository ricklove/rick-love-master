import { LessonData, LessonModule } from '../common/lesson-types';
import { calculateFilesHashCode } from '../common/lesson-hash';

export const createDefaultLesson = (): LessonData => {
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
    const file0 = {
        path: `test0.tsx`,
        content: `
import React from 'react';

export const MinimalReactComponent0 = (props: {}) => {
    return (
        <span>Hello World 0!</span>
    );
};
        `.trim(),
        language: `tsx` as const,
    };
    const file2 = {
        path: `test2.tsx`,
        content: `
import React from 'react';

export const MinimalReactComponent2 = (props: {}) => {
    return (
        <span>Hello World 2!</span>
    );
};
        `.trim(),
        language: `tsx` as const,
    };

    const focusIndex = file.content.indexOf(`<span>Hello World!</span>`);
    const focusLength = `<span>Hello World!</span>`.length;
    const files = [file0, file, file2];
    const lesson: LessonData = {
        key: `Lesson-${Date.now()}-${(`${Math.random()}`).substr(2)}`,
        projectState: {
            files,
            filesHashCode: calculateFilesHashCode(files),
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

export const cloneLesson = (lesson: LessonData): LessonData => {
    const newLesson = JSON.parse(JSON.stringify(lesson));
    return {
        ...newLesson,
        key: `Lesson-${Date.now()}-${(`${Math.random()}`).substr(2)}`,
    };
};

export const createDefaultLessonModule = (): LessonModule => {
    return {
        key: `Module-${Date.now()}-${(`${Math.random()}`).substr(2)}`,
        title: `Module`,
        lessons: [createDefaultLesson()],
    };
};
