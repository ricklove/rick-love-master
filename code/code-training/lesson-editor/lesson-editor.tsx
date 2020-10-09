/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native-lite';
import { FileEditorMode, ProjectCodeEditor, ProjectEditorMode } from '../common/components/code-editor';
import { LessonData, LessonExperiment, LessonProjectFileSelection, LessonProjectState, LessonStep_ConstructCode } from '../common/lesson-types';
import { lessonExperiments_createReplacementProjectState, lessonExperiments_calculateProjectStateReplacements } from '../common/replacements';

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
    lessonFieldView: {
        flexDirection: `row`,
    },
    lessonFieldLabelText: {
        minWidth: 80,
        padding: 4,
        fontSize: 12,
    },
    lessonFieldText: {
        flex: 1,
        padding: 4,
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
    const projectEditorMode: ProjectEditorMode =
        editorMode === `edit` ? `edit`
            : `display`;
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

    const onProjectDataChange = (projectData: { projectState?: LessonProjectState, focus?: LessonProjectFileSelection }) => {

        setData(createLessonState({
            ...data.lesson,
            ...projectData,
        }));
    };
    const onLessonChange = (lesson: Partial<LessonData>) => {
        setData(createLessonState({
            ...data.lesson,
            ...lesson,
        }));
    };

    const {
        projectState,
        focus,
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
                            <ProjectCodeEditor
                                projectData={{
                                    projectState,
                                    focus,
                                }}
                                fileEditorMode_focus={fileEditorMode_focus}
                                fileEditorMode_noFocus={fileEditorMode_noFocus}
                                projectEditorMode={projectEditorMode}
                                onProjectDataChange={onProjectDataChange}
                            />

                            <Text style={styles.sectionHeaderText}>Lesson</Text>
                            <View style={styles.infoView}>
                                <LessonField label='Title' value={data.lesson.title} onChange={x => onLessonChange({ title: x })} />
                                <LessonField label='Objective' value={data.lesson.objective} onChange={x => onLessonChange({ objective: x })} />
                                <LessonField label='Explanation' value={data.lesson.explanation} onChange={x => onLessonChange({ explanation: x })} />
                                <LessonField label='Task' value={data.lesson.task} onChange={x => onLessonChange({ task: x })} />
                                <LessonField_Descriptions label='Descriptions' value={data.lesson.descriptions} onChange={x => onLessonChange({ descriptions: x })} />
                                <LessonField_Experiments label='Experiments' value={data.lesson.experiments} onChange={x => onLessonChange({ experiments: x })} projectState={data.lesson.projectState} />
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

const LessonField = ({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) => {
    return (
        <View style={styles.lessonFieldView}>
            <Text style={styles.lessonFieldLabelText}>{label}</Text>
            <TextInput
                style={styles.lessonFieldText}
                value={value}
                onChange={onChange}
                autoCompleteType='off'
                keyboardType='default'
            />
        </View>
    );
};

const LessonField_Descriptions = ({ label, value, onChange }: { label: string, value: string[], onChange: (value: string[]) => void }) => {
    return (
        <View style={styles.lessonFieldView}>
            <Text style={styles.lessonFieldLabelText}>{label}</Text>
            <TextInput
                style={styles.lessonFieldText}
                value={value.join(`\n`)}
                onChange={x => onChange(x.replace(/\r\n/, `\n`).split(`\n`))}
                autoCompleteType='off'
                keyboardType='default'
                multiline
                numberOfLines={5}
            />
        </View>
    );
};


const LessonField_Experiments = ({ label, value, onChange, projectState }: { label: string, value: LessonExperiment[], onChange: (value: LessonExperiment[]) => void, projectState: LessonProjectState }) => {
    return (
        <View style={{}}>
            <Text style={styles.lessonFieldLabelText}>{label}</Text>
            {value.map((x, i) => (
                <LessonField_Experiment key={`${i}`} label={`Experiment ${i}`} value={x}
                    onChange={v => onChange(value.map((y, j) => i === j ? v : y))} projectState={projectState}
                    onDelete={() => { value.splice(i, 1); onChange(value); }} />
            ))}
            <TouchableOpacity onPress={() => { value.push({ replacements: [], comment: `` }); onChange(value); }}>
                <View style={styles.buttonView}>
                    <Text style={styles.buttonText}>{`${`➕`} Add Experiment`}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};


const LessonField_Experiment = ({
    label,
    value,
    onChange,
    projectState: originalProjectState,
    onDelete,
}: {
    label: string;
    value: LessonExperiment;
    onChange: (value: LessonExperiment) => void;
    projectState: LessonProjectState;
    onDelete: () => void;
}) => {
    const [projectState, setProjectState] = useState(originalProjectState);
    const [lastFocus, setLastFocus] = useState({ filePath: projectState.files[0].path, index: 0, length: projectState.files[0].content.length });

    useEffect(() => {
        setProjectState(lessonExperiments_createReplacementProjectState(originalProjectState, value.replacements));
    }, [originalProjectState.files.length]);

    const changeProjectData = (data: { projectState?: LessonProjectState, focus?: LessonProjectFileSelection }) => {
        if (data.focus) {
            setLastFocus(data.focus);
        }

        if (!data.projectState) { return; }
        setProjectState(data.projectState);
        onChange(lessonExperiments_calculateProjectStateReplacements(originalProjectState, data.projectState));
    };

    return (
        <View style={{}}>
            <View style={{ flexDirection: `row` }}>
                <Text style={styles.lessonFieldLabelText}>{label}</Text>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={onDelete}>
                    <View style={styles.buttonView}>
                        <Text style={styles.buttonText}>{`${`❌`} Delete Experiment`}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <ProjectCodeEditor
                projectData={{
                    projectState,
                    focus: lastFocus,
                }}
                fileEditorMode_focus='edit'
                fileEditorMode_noFocus='edit'
                projectEditorMode='display'
                onProjectDataChange={changeProjectData}
            />
        </View>
    );
};
