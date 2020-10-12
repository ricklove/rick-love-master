import React, { useState } from 'react';
import { Text } from 'react-native-lite';
import { LessonData } from '../lesson-types';
import { LessonProjectFilesEditor } from './lesson-file-editor';

const styles = {
    container: {
        margin: 16,
        background: `#FFFFFF`,
    },
} as const;

export const LessonRenderView = ({ data }: { data: LessonData }) => {

    return (
        <>
            <div style={styles.container}>
                <iframe src='http://localhost:3042/' title='Preview' />
            </div>
        </>
    );
};
