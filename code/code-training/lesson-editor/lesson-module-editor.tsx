/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native-lite';
import { TabsComponent } from '../common/components/tabs';
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
    const addLesson = () => {
        const newLesson = createDefaultLesson();
        setModule(s => ({
            ...s,
            lessons: [...s.lessons, newLesson],
        }));
        setActiveLesson(newLesson);
    };
    const deleteActiveLesson = () => {
        setModule(s => ({
            ...s,
            lessons: s.lessons.filter(x => x !== activeLesson),
        }));
        setActiveLesson(module.lessons.filter(x => x !== activeLesson)[0]);
    };
    const moveLesson = (item: LessonData, oldIndex: number, newIndex: number) => {
        if (newIndex < 0 || newIndex > module.lessons.length - 1) { return; }
        setModule(s => {
            const newLessons = [...s.lessons];
            newLessons.splice(oldIndex, 1);
            newLessons.splice(newIndex, 0, item);

            return ({
                ...s,
                lessons: newLessons,
            })
        });
    };

    return (
        <>
            <View style={styles.container}>
                <TabsComponent
                    style={{ selectedTabText: { color: `#88FF88` } }}
                    header={'Lessons'}
                    items={module.lessons}
                    getKey={x => x.key}
                    getLabel={x => x.title}
                    selected={activeLesson}
                    onChange={x => setActiveLesson(x)}
                    onAdd={addLesson}
                    onDelete={deleteActiveLesson}
                    onMove={moveLesson}
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
