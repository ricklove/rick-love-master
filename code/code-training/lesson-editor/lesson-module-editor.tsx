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
    // lessonTabRowView: {
    //     flexDirection: `row`,
    //     paddingLeft: 16,
    // },
    // lessonTabView: {
    //     background: `#1e1e1e`,
    //     alignSelf: `flex-start`,
    //     padding: 8,
    //     marginRight: 1,
    // },
    // lessonTabView_selected: {
    //     background: `#292a2d`,
    //     alignSelf: `flex-start`,
    //     padding: 8,
    //     marginRight: 1,
    // },
    // lessonTabText: {
    //     fontSize: 14,
    //     color: `#FFFFFFF`,
    // },
    // lessonTabText_selected: {
    //     fontSize: 14,
    //     color: `#88FF88`,
    // },
    // buttonView: {
    //     background: `#1e1e1e`,
    //     alignSelf: `flex-start`,
    //     padding: 8,
    //     margin: 1,
    // },
    // buttonText: {
    //     fontSize: 14,
    //     color: `#FFFFFFF`,
    // },
    // sectionHeaderText: {
    //     margin: 8,
    //     fontSize: 18,
    //     color: `#FFFF88`,
    // },
    // infoView: {
    // },
    // infoText: {
    //     margin: 8,
    //     fontSize: 12,
    //     wrap: `wrap`,
    // },
    // lessonFieldView: {
    //     flexDirection: `row`,
    // },
    // lessonFieldLabelText: {
    //     minWidth: 80,
    //     padding: 4,
    //     fontSize: 12,
    // },
    // lessonFieldText: {
    //     flex: 1,
    //     padding: 4,
    //     fontSize: 12,
    //     wrap: `wrap`,
    // },
    // jsonText: {
    //     padding: 4,
    //     fontSize: 12,
    //     color: `#FFFFFF`,
    //     background: `#000000`,
    // },
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
                />
                {activeLesson && (
                    <>
                        <LessonEditor value={activeLesson} onChange={changeActiveLesson} />
                    </>
                )}
            </View>
        </>
    );
};
