import React, { useState } from 'react';
import { Text } from 'react-native-lite';
import { LessonData } from '../lesson-types';
import { LessonProjectFilesEditor } from './lesson-file-editor';

const styles = {
    sectionHeaderText: {
        margin: 8,
        fontSize: 18,
        color: `#FFFF88`,
    },
    infoText: {
        margin: 8,
        fontSize: 12,
        whiteSpace: `pre-wrap`,
    },
} as const;

export const LessonView_ConstructCode = ({ data }: { data: LessonData }) => {

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
                onTaskDone={() => setIsDone(true)}
                lessonData={data}
            />
        </>
    );
};

export const LessonView_UnderstandCode = ({ data }: { data: LessonData }) => {

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
                onTaskDone={() => setIsDone(true)}
                lessonData={data}
            />
        </>
    );
};
