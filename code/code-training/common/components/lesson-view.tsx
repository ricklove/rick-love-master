/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native-lite';
import { LessonData, LessonExperiment, LessonProjectState, SetProjectState } from '../lesson-types';
import { lessonExperiments_createReplacementProjectState } from '../replacements';
import { LessonProjectFilesEditor } from './lesson-file-editor';
import { LessonProjectStatePreview } from './lesson-render-view';

const styles = {
    sectionHeaderText: {
        margin: 8,
        fontSize: 18,
        color: `#FFFF88`,
        whiteSpace: `pre-wrap`,
    },
    sectionHeader2Text: {
        margin: 8,
        fontSize: 16,
        color: `#FFFF88`,
        whiteSpace: `pre-wrap`,
    },
    infoText: {
        margin: 8,
        fontSize: 12,
        whiteSpace: `pre-wrap`,
    },
    buttonView: {
        margin: 8,
        padding: 4,
        border: `solid 1px #888888`,
    },
    buttonText: {
        color: `#88FF88`,
    },
} as const;
export const LessonView_PreviewResult = ({ data, onDone, setProjectState }: { data: LessonData, onDone?: () => void, setProjectState: SetProjectState }) => {

    const [isDone, setIsDone] = useState(false);

    return (
        <>
            <Text style={styles.sectionHeaderText}>{`${data.title} - Preview the Result ${isDone ? `✅` : `🔳`}`}</Text>
            <View style={{ flexDirection: `row`, alignItems: `center` }}>
                <Text style={styles.infoText}>{`${`🔎`} Preview the result below`}</Text>
                <View style={{ flex: 1 }} />
                {onDone && (
                    <TouchableOpacity onPress={() => onDone?.()}>
                        <View style={styles.buttonView}>
                            <Text style={styles.buttonText}>Done</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.sectionHeader2Text}>Preview</Text>
            <LessonProjectStatePreview projectState={data.projectState} setProjectState={setProjectState} />
            <Text style={styles.sectionHeader2Text}>Code</Text>
            <LessonProjectFilesEditor
                projectData={{
                    projectState: data.projectState,
                    focus: data.focus,
                }}
                fileEditorMode_focus='display'
                fileEditorMode_noFocus='display'
                projectEditorMode='display'
                onTaskDone={() => { setIsDone(true); onDone?.(); }}
                lessonData={data}
            />
        </>
    );
};

export const LessonView_ConstructCode = ({ data, onDone }: { data: LessonData, onDone?: () => void }) => {

    const [isDone, setIsDone] = useState(false);

    return (
        <>
            <Text style={styles.sectionHeaderText}>{`${data.title} - Construct the Code ${isDone ? `✅` : `🔳`}`}</Text>
            <Text style={styles.infoText}>{`🎯 ${data.objective}`}</Text>
            <Text style={styles.infoText}>{`💡 ${data.explanation}`}</Text>
            <Text style={styles.infoText}>{`${isDone ? `✅` : `🔳`} ${data.task}`}</Text>
            <LessonProjectFilesEditor
                projectData={{
                    projectState: data.projectState,
                    focus: data.focus,
                }}
                fileEditorMode_focus='construct-code'
                fileEditorMode_noFocus='display'
                projectEditorMode='display'
                onTaskDone={() => { setIsDone(true); onDone?.(); }}
                lessonData={data}
            />
        </>
    );
};

export const LessonView_UnderstandCode = ({ data, onDone }: { data: LessonData, onDone?: () => void }) => {

    const [isDone, setIsDone] = useState(false);

    return (
        <>
            <Text style={styles.sectionHeaderText}>{`${data.title} - Understand the Code ${isDone ? `✅` : `🔳`}`}</Text>
            <LessonProjectFilesEditor
                projectData={{
                    projectState: data.projectState,
                    focus: data.focus,
                }}
                fileEditorMode_focus='understand-code'
                fileEditorMode_noFocus='display'
                projectEditorMode='display'
                onTaskDone={() => { setIsDone(true); onDone?.(); }}
                lessonData={data}
            />
        </>
    );
};

const experimentStyles = {
    instructionsText: {
        marginLeft: 16,
        fontSize: 16,
        color: `#88FF88`,
    },
    experimentView: {
        padding: 16,
        justifyContent: `flex-start`,
    },
    experimentItemRow: {
        flexDirection: `row`,
        alignItems: `center`,
    },
    experimentItemView: {
        padding: 4,
        // border: `solid 1px #888888`,
        // borderLeft: `solid 4px #EEEEEE`,
    },
    experimentItemView_active: {
        padding: 4,
        border: `solid 1px #FFFF88`,
        borderLeft: `solid 4px #FFFF88`,
    },
    experimentItemText: {
        color: `#FFFF88`,
        whiteSpace: `pre-wrap`,
    },
} as const;
export const LessonView_ExperimentCode = ({ data, onDone, setProjectState }: { data: LessonData, onDone?: () => void, setProjectState: SetProjectState }) => {

    const [modifiedProjectState, setModifiedProjectState] = useState(data.projectState);
    const [activeExperiment, setActiveExperiment] = useState(null as null | LessonExperiment);
    const [activeFocus, setActiveFocus] = useState(data.focus);

    const changeExperiment = (value: null | LessonExperiment) => {
        setActiveExperiment(value);
        if (!value) {
            setModifiedProjectState(data.projectState);
            setActiveFocus(data.focus);
            return;
        }
        setModifiedProjectState(s => (lessonExperiments_createReplacementProjectState(data.projectState, value.replacements)));

        // Focus on change area:
        const focusReplacements = value.replacements.filter(x => x.selection.filePath === data.focus.filePath);
        const minIndex = Math.min(...focusReplacements.map(x => x.selection.index));
        const maxEndIndex = Math.max(...focusReplacements.map(x => x.selection.index + x.selection.length));
        const lengthDeltas = focusReplacements.map(x => -x.selection.length + x.content.length);
        // eslint-disable-next-line unicorn/no-reduce
        const lengthDelta = lengthDeltas.reduce((out, x) => { out += x; return out; }, 0);
        console.log(`LessonView_ExperimentCode`, { minIndex, maxEndIndex, lengthDeltas, lengthDelta, focusReplacements });
        setActiveFocus({ ...data.focus, index: minIndex, length: maxEndIndex - minIndex + lengthDelta });
    };

    useEffect(() => {
        changeExperiment(null);
    }, [data.projectState]);

    return (
        <>
            <Text style={styles.sectionHeaderText}>{`${data.title} - Experiment with the Code`}</Text>
            <Text style={experimentStyles.instructionsText}>Select an experiment below and view the result</Text>
            <View style={experimentStyles.experimentView}>
                <TouchableOpacity onPress={() => changeExperiment(null)}>
                    <View style={experimentStyles.experimentItemRow}>
                        <View style={styles.buttonView}>
                            <Text style={styles.buttonText}>View</Text>
                        </View>
                        <View style={activeExperiment === null ? experimentStyles.experimentItemView_active : experimentStyles.experimentItemView}>
                            <Text style={experimentStyles.experimentItemText}>Completed Code</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {data.experiments.map((x, i) => (
                    <TouchableOpacity key={`${i}`} onPress={() => changeExperiment(x)}>
                        <View style={experimentStyles.experimentItemRow}>
                            <View style={styles.buttonView}>
                                <Text style={styles.buttonText}>View</Text>
                            </View>
                            <View style={x === activeExperiment ? experimentStyles.experimentItemView_active : experimentStyles.experimentItemView}>
                                <Text style={experimentStyles.experimentItemText}>{`🔬 ${x.comment ?? `Experiment ${i}`}`}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
                {onDone && (
                    <TouchableOpacity onPress={() => onDone?.()}>
                        <View style={experimentStyles.experimentItemRow}>
                            <View style={styles.buttonView}>
                                <Text style={styles.buttonText}>Done</Text>
                            </View>
                            <View style={experimentStyles.experimentItemView}>
                                <Text style={experimentStyles.experimentItemText}>▶ Go to next step</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
            <LessonProjectFilesEditor
                key={modifiedProjectState.filesHashCode}
                projectData={{
                    projectState: modifiedProjectState,
                    focus: activeFocus,
                }}
                fileEditorMode_focus='display'
                fileEditorMode_noFocus='display'
                projectEditorMode='display'
                onTaskDone={() => { }}
                lessonData={data}
            />
            {/* {activeExperiment && activeExperiment.replacements.map(x => (
                <View key={x.selection.filePath + x.selection.index} >
                    <View style={{ flexDirection: `row` }}>
                        <Text style={{ minWidth: 80 }}>File</Text>
                        <Text style={{ marginLeft: 4, background: `#111111` }}>{`${x.selection.filePath}`}</Text>
                    </View>
                    <View style={{ flexDirection: `row` }}>
                        <Text style={{ minWidth: 80 }}>Match</Text>
                        <Text style={{ marginLeft: 4, background: `#111111`, color: `#FF8888`, textDecoration: `line-through` }}>{`${data.projectState.files.find(f => f.path === x.selection.filePath)?.content.substr(x.selection.index, x.selection.length)}`}</Text>
                    </View>
                    <View style={{ flexDirection: `row` }}>
                        <Text style={{ minWidth: 80 }}>Replace</Text>
                        <Text style={{ marginLeft: 4, background: `#111111`, color: `#8888FF` }}>{`${x.content}`}</Text>
                    </View>
                </View>
            ))} */}
            <LessonProjectStatePreview projectState={modifiedProjectState} setProjectState={setProjectState} />
        </>
    );
};
