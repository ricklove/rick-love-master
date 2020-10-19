/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native-lite';
import { LessonProjectFilesEditor, LessonProjectEditorMode, LessonFileEditorMode } from '../common/components/lesson-file-editor';
import { LessonData, LessonExperiment, LessonProjectFileSelection, LessonProjectState, LessonStep_ConstructCode, LessonStep_UnderstandCode } from '../common/lesson-types';
import { lessonExperiments_createReplacementProjectState, lessonExperiments_calculateProjectStateReplacements } from '../common/replacements';
import { LessonView_ConstructCode, LessonView_ExperimentCode, LessonView_UnderstandCode } from '../common/components/lesson-view';
import { LessonProjectStatePreview, LessonRenderView } from '../common/components/lesson-render-view';
import { calculateFilesHash } from '../common/lesson-hash';

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
        understandCode: LessonStep_UnderstandCode;
    };
    const lessonSteps: LessonSteps = {
        constructCode: {
            lessonData: lesson,
        },
        understandCode: {
            lessonData: lesson,
        },
    };

    return {
        lesson,
        lessonJson: lessonJson ?? JSON.stringify(lesson, null, 2),
        lessonSteps,
    };
};

export const LessonEditor = (props: { value: LessonData, onChange: (value: LessonData) => void, setProjectState: (projectState: LessonProjectState) => Promise<void> }) => {

    const [data, setData] = useState(createLessonState(props.value));
    type EditorMode = 'edit' | 'json' | 'construct-code' | 'understand-code' | 'experiment-code' | 'preview';
    const [editorMode, setEditorMode] = useState(`edit` as EditorMode);
    const editorModes = [
        { value: `edit`, label: `Edit` },
        { value: `json`, label: `Json` },
        { value: `construct-code`, label: `Construct Code` },
        { value: `understand-code`, label: `Understand Code` },
        { value: `experiment-code`, label: `Experiment Code` },
        { value: `preview`, label: `Preview` },
    ] as { value: EditorMode, label: string }[];
    const projectEditorMode: LessonProjectEditorMode =
        editorMode === `edit` ? `edit`
            : `display`;
    const fileEditorMode_focus: LessonFileEditorMode =
        editorMode === `edit` ? `edit`
            : editorMode === `construct-code` ? `construct-code`
                : `display`;
    const fileEditorMode_noFocus: LessonFileEditorMode =
        editorMode === `edit` ? `edit`
            : editorMode === `construct-code` ? `display`
                : `display`;

    const changeLessonState = (value: typeof data) => {
        setData(value);
        props.onChange(value.lesson);
    };
    const changeLessonJson = (json: string) => {
        changeLessonState(createLessonState(JSON.parse(json), json));
    };

    const onProjectDataChange = (projectData: { projectState?: LessonProjectState, focus?: LessonProjectFileSelection }) => {
        changeLessonState(createLessonState({
            ...data.lesson,
            ...projectData,
        }));
    };
    const onLessonChange = (lesson: Partial<LessonData>) => {
        changeLessonState(createLessonState({
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
                    {editorMode === `edit` && (
                        <>
                            <Text style={styles.sectionHeaderText}>Project Files</Text>
                            <LessonProjectFilesEditor
                                projectData={{
                                    projectState,
                                    focus,
                                }}
                                fileEditorMode_focus={fileEditorMode_focus}
                                fileEditorMode_noFocus={fileEditorMode_noFocus}
                                projectEditorMode={projectEditorMode}
                                onProjectDataChange={onProjectDataChange}
                                lessonData={data.lesson}
                            />
                            <Text style={styles.sectionHeaderText}>Lesson</Text>
                            <View style={styles.infoView}>
                                <LessonField label='Title' value={data.lesson.title} onChange={x => onLessonChange({ title: x })} />
                                <LessonField label='Objective' value={data.lesson.objective} onChange={x => onLessonChange({ objective: x })} />
                                <LessonField label='Explanation' value={data.lesson.explanation} onChange={x => onLessonChange({ explanation: x })} />
                                <LessonField label='Task' value={data.lesson.task} onChange={x => onLessonChange({ task: x })} />
                                <LessonField_Descriptions label='Descriptions' value={data.lesson.descriptions} onChange={x => onLessonChange({ descriptions: x })} />
                                <LessonField_Experiments label='Experiments' value={data.lesson.experiments} onChange={x => onLessonChange({ experiments: x })} lessonData={data.lesson} />
                            </View>
                        </>
                    )}
                    {editorMode === `construct-code` && (
                        <LessonView_ConstructCode data={data.lesson} />
                    )}
                    {editorMode === `understand-code` && (
                        <LessonView_UnderstandCode data={data.lesson} />
                    )}
                    {editorMode === `experiment-code` && (
                        <LessonView_ExperimentCode data={data.lesson} setProjectState={props.setProjectState} />
                    )}
                    {editorMode === `preview` && (
                        <LessonProjectStatePreview projectState={data.lesson.projectState} setProjectState={props.setProjectState} />
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


const LessonField_Experiments = ({ label, value, onChange, lessonData }: {
    label: string; value: LessonExperiment[]; onChange: (value: LessonExperiment[]) => void;
    lessonData: LessonData;
}) => {
    return (
        <View style={{}}>
            <Text style={styles.lessonFieldLabelText}>{label}</Text>
            {value.map((x, i) => (
                <LessonField_Experiment key={`${i}`} label={`Experiment ${i}`} value={x}
                    onChange={v => onChange(value.map((y, j) => i === j ? v : y))}
                    onDelete={() => { value.splice(i, 1); onChange(value); }} lessonData={lessonData} />
            ))}
            <TouchableOpacity onPress={() => { value.push({ replacements: [], comment: ``, filesHashCode: `` }); onChange(value); }}>
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
    onDelete,
    lessonData,
}: {
    label: string;
    value: LessonExperiment;
    onChange: (value: LessonExperiment) => void;
    onDelete: () => void;
    lessonData: LessonData;
}) => {
    const [modifiedProjectState, setModifiedProjectState] = useState(lessonData.projectState);
    const [lastFocus, setLastFocus] = useState({ filePath: modifiedProjectState.files[0].path, index: 0, length: modifiedProjectState.files[0].content.length });
    const [commentText, setCommentText] = useState(value.comment ?? ``);

    useEffect(() => {
        setModifiedProjectState(s => (lessonExperiments_createReplacementProjectState(lessonData.projectState, value.replacements)));
    }, [lessonData.projectState]);

    const changeProjectData = (data: { projectState?: LessonProjectState, focus?: LessonProjectFileSelection }) => {
        if (data.focus) {
            setLastFocus(data.focus);
        }

        if (!data.projectState) { return; }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setModifiedProjectState(data.projectState!);
        onChange({ ...lessonExperiments_calculateProjectStateReplacements(lessonData.projectState, data.projectState), comment: commentText, filesHashCode: calculateFilesHash(lessonData.projectState.files) });
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
            <View style={styles.lessonFieldView}>
                <Text style={styles.lessonFieldLabelText}>Comment</Text>
                <TextInput
                    style={styles.lessonFieldText}
                    value={commentText}
                    onChange={setCommentText}
                    onBlur={() => onChange({ ...value, comment: commentText })}
                    autoCompleteType='off'
                    keyboardType='default'
                />
            </View>
            <LessonProjectFilesEditor
                key={modifiedProjectState.key}
                projectData={{
                    projectState: modifiedProjectState,
                    focus: lastFocus,
                }}
                fileEditorMode_focus='edit'
                fileEditorMode_noFocus='edit'
                projectEditorMode='display'
                onProjectDataChange={changeProjectData}
                lessonData={lessonData}
            />
            {value.replacements.map(x => (
                <View key={x.selection.filePath + x.selection.index} >
                    <View style={{ flexDirection: `row` }}>
                        <Text style={{ minWidth: 80 }}>File</Text>
                        <Text style={{ marginLeft: 4, background: `#111111` }}>{`${x.selection.filePath}`}</Text>
                    </View>
                    <View style={{ flexDirection: `row` }}>
                        <Text style={{ minWidth: 80 }}>Match</Text>
                        <Text style={{ marginLeft: 4, background: `#111111`, color: `#FF8888`, textDecoration: `line-through` }}>{`${lessonData.projectState.files.find(f => f.path === x.selection.filePath)?.content.substr(x.selection.index, x.selection.length)}`}</Text>
                    </View>
                    <View style={{ flexDirection: `row` }}>
                        <Text style={{ minWidth: 80 }}>Replace</Text>
                        <Text style={{ marginLeft: 4, background: `#111111`, color: `#8888FF` }}>{`${x.content}`}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};
