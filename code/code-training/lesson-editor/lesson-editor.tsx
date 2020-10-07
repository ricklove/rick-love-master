import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native-lite';
import { FileCodeEditor, FileEditorMode, ProjectCodeEditor, ProjectEditorMode } from '../common/components/code-editor';
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

    const lesson: LessonData = {
        projectState: {
            files: [file0, file, file2],
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

const styles = {
    container: {
        background: `#111111`,
    },
    containerPanel: {
        background: `#292a2d`,
    },
    editorModeTabRowView: {
        flexDirection: `row`,
        paddingLeft: 16,
    },
    editorModeTabView: {
        background: `#1e1e1e`,
        alignSelf: `flex-start`,
        padding: 8,
        marginRight: 1,
    },
    editorModeTabView_selected: {
        background: `#292a2d`,
        alignSelf: `flex-start`,
        padding: 8,
        marginRight: 1,
    },
    editorModeTabText: {
        fontSize: 14,
        color: `#FFFFFFF`,
    },
    editorModeTabText_selected: {
        fontSize: 14,
        color: `#FFFF88`,
    },
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
        padding: 4,
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
    type EditorMode = 'edit' | 'json' | 'constructCode';
    const [editorMode, setEditorMode] = useState(`edit` as EditorMode);
    const editorModes = [
        { value: `edit`, label: `Edit` },
        { value: `json`, label: `Json` },
        { value: `constructCode`, label: `Construct Code` },
    ] as { value: EditorMode, label: string }[];
    const projectEditorMode: ProjectEditorMode = `tabs`;
    const fileEditorMode_focus: FileEditorMode =
        editorMode === `edit` ? `edit`
            : editorMode === `constructCode` ? `type-selection`
                : `display`;
    const fileEditorMode_noFocus: FileEditorMode =
        editorMode === `edit` ? `edit`
            : editorMode === `constructCode` ? `display`
                : `display`;

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
            <View style={styles.container}>
                <View style={styles.editorModeTabRowView}>
                    {editorModes.map(x => (
                        <TouchableOpacity key={x.value + editorMode} onPress={() => setEditorMode(x.value)}>
                            <View style={x.value === editorMode ? styles.editorModeTabView_selected : styles.editorModeTabView}>
                                <Text style={x.value === editorMode ? styles.editorModeTabText_selected : styles.editorModeTabText}>{x.label}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.containerPanel}>
                    {editorMode !== `json` && (
                        <>
                            <Text style={styles.sectionHeaderText}>Project Files</Text>
                            <ProjectCodeEditor projectState={projectState} focus={focus} fileEditorMode_focus={fileEditorMode_focus} fileEditorMode_noFocus={fileEditorMode_noFocus} projectEditorMode={projectEditorMode} />

                            <Text style={styles.sectionHeaderText}>Lesson</Text>
                            <View style={styles.infoView}>
                                <Text style={styles.infoText}>{`title: ${title}`}</Text>
                                <Text style={styles.infoText}>{`objective: ${objective}`}</Text>
                                <Text style={styles.infoText}>{`explanation: ${explanation}`}</Text>
                                <Text style={styles.infoText}>{`task: ${task}`}</Text>
                            </View>
                        </>
                    )}
                    {editorMode === `json` && (
                        <>
                            <Text style={styles.sectionHeaderText}>Lesson Data</Text>
                            <View>
                                <TextInput
                                    style={styles.jsonText}
                                    value={data.lessonJson}
                                    onChange={changeLessonJson}
                                    autoCompleteType='off'
                                    keyboardType='default'
                                    multiline
                                    numberOfLines={20}
                                />
                            </View>
                        </>
                    )}
                </View>
            </View>
        </>
    );
};
