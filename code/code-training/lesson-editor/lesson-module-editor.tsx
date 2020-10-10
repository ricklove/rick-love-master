/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native-lite';
import { TabsComponent, TabsListEditorComponent } from '../common/components/tabs';
import { LessonData } from '../common/lesson-types';
import { createDefaultLesson, createDefaultLessonModule } from './lesson-defaults';
import { LessonEditor } from './lesson-editor';


const styles = {
    container: {
        background: `#111111`,
    },
    containerPanel: {
        background: `#292a2d`,
    },
} as const;


export const LessonModuleEditor = (props: {}) => {
    const [module, setModule] = useState(createDefaultLessonModule());
    const [activeLesson, setActiveLesson] = useState(module.lessons[0]);

    const changeActiveLesson = (value: LessonData) => {
        setModule(s => ({
            ...s,
            lessons: s.lessons.map(x => {
                if (x === activeLesson) {
                    return value;
                }
                return x;
            }),
        }));
        setActiveLesson(value);
    };

    return (
        <>
            <View style={styles.container}>
                <TabsListEditorComponent
                    style={{ selectedTabText: { color: `#88FF88` } }}
                    header={'Lessons'}
                    items={module.lessons}
                    onChange={x => setModule(s => ({ ...s, lessons: x }))}
                    getKey={x => x.key}
                    getLabel={x => x.title}
                    selected={activeLesson}
                    onSelect={x => setActiveLesson(x)}
                    onCreateNewItem={createDefaultLesson}
                />
                {activeLesson && (
                    <>
                        <LessonEditor key={activeLesson.key} value={activeLesson} onChange={changeActiveLesson} />
                    </>
                )}
            </View>
        </>
    );
};
