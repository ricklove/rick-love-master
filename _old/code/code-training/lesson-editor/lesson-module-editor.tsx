/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { TouchableOpacity, View, Text, TextInput } from 'react-native-lite';
import { TabsComponent, TabsListEditorComponent } from '../common/components/tabs';
import { LessonData, LessonModule, LessonProjectState, SetProjectState } from '../common/lesson-types';
import { cloneLesson, createDefaultLesson, createDefaultLessonModule } from './lesson-defaults';
import { LessonEditor } from './lesson-editor';


const styles = {
    container: {
        background: `#111111`,
    },
    containerPanel: {
        background: `#292a2d`,
    },
    sectionHeaderText: {
        margin: 8,
        fontSize: 18,
        color: `#FFFF88`,
    },
    jsonText: {
        padding: 4,
        fontSize: 12,
        color: `#FFFFFF`,
        background: `#000000`,
    },
} as const;


export const LessonModuleEditor = (props: { value?: LessonModule, onChange?: (value: LessonModule) => void, setProjectState: SetProjectState }) => {
    const [module, setModule] = useState(props.value ?? createDefaultLessonModule());
    const [activeLesson, setActiveLesson] = useState(module.lessons[0]);
    const [mode, setMode] = useState(`lesson` as 'lesson' | 'json');

    const changeActiveLesson = (value: LessonData) => {
        setModule(s => {
            const newModule = {
                ...s,
                lessons: s.lessons.map(x => {
                    if (x === activeLesson) {
                        return value;
                    }
                    return x;
                }),
            };
            setTimeout(() => {
                props.onChange?.(newModule);
            });
            return newModule;
        });
        setActiveLesson(value);
    };
    const changeModuleTitle = (value: string) => {
        setModule(s => {
            const newModule = {
                ...s,
                title: value,
            };
            setTimeout(() => {
                props.onChange?.(newModule);
            });
            return newModule;
        });
    };

    return (
        <>

            <View style={styles.container}>
                <TabsComponent
                    header='Module'
                    items={[`lesson` as const, `json` as const]}
                    getKey={x => x}
                    getLabel={x => x}
                    selected={mode}
                    onSelect={setMode}
                />
                <TextInput
                    style={styles.jsonText}
                    value={module.title}
                    onChange={changeModuleTitle}
                    autoCompleteType='off'
                    keyboardType='default'
                />
                {mode === `lesson` && (
                    <>
                        <TabsListEditorComponent
                            style={{ selectedTabText: { color: `#88FF88` } }}
                            header='Lessons'
                            items={module.lessons}
                            onChange={x => setModule(s => ({ ...s, lessons: x }))}
                            getKey={x => x.key}
                            getLabel={x => x.title}
                            selected={activeLesson}
                            onSelect={x => setActiveLesson(x)}
                            onCreateNewItem={() => cloneLesson(activeLesson) ?? createDefaultLesson()}
                        />
                        {activeLesson && (
                            <>
                                <LessonEditor key={activeLesson.key} value={activeLesson} onChange={changeActiveLesson} setProjectState={props.setProjectState} />
                            </>
                        )}
                    </>
                )}
                {mode === `json` && (
                    <>
                        <Text style={styles.sectionHeaderText}>Module Data</Text>
                        <View>
                            <TextInput
                                style={styles.jsonText}
                                value={JSON.stringify(module, null, 2)}
                                onChange={x => setModule(JSON.parse(x))}
                                autoCompleteType='off'
                                keyboardType='default'
                                multiline
                                numberOfLines={20}
                            />
                        </View>
                    </>
                )}
            </View>
        </>
    );
};
