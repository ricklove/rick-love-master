/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, TextInput } from 'react-native-lite';
import { useAutoLoadingError } from 'utils-react/hooks';
import { ErrorBox } from 'controls-react/error-box';
import { Loading } from 'controls-react/loading';
import { LessonModuleMeta } from '../lesson-server/lesson-api-types';
import { createLessonApiClient } from '../lesson-server/client/lesson-api-client';
import { TabsComponent, TabsListEditorComponent } from '../common/components/tabs';
import { LessonData, LessonModule } from '../common/lesson-types';
import { createDefaultLesson, createDefaultLessonModule } from './lesson-defaults';
import { LessonEditor } from './lesson-editor';
import { LessonModuleEditor } from './lesson-module-editor';


const styles = {
    container: {
        background: `#111111`,
    },
    containerPanel: {
        background: `#292a2d`,
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
} as const;

const apiClient = createLessonApiClient({});
export const LessonModulesClientEditor = (props: {}) => {
    const [modules, setModules] = useState(null as null | LessonModuleMeta[]);
    const [activeModule, setActiveModule] = useState(null as null | LessonModule);
    // const [mode, setMode] = useState(`lesson` as 'lesson' | 'json');

    const { loading, error, doWork } = useAutoLoadingError();
    const reloadModules = async (stopIfObsolete: () => void) => {
        const result = await apiClient.getLessonModules({});
        stopIfObsolete();
        setModules(result.data);
    };
    useEffect(() => {
        doWork(async (stopIfObsolete) => {
            await reloadModules(stopIfObsolete);
        });
    }, []);

    const loadModule = (key: string) => {
        doWork(async (stopIfObsolete) => {
            const result = await apiClient.getLessonModule({ key });
            stopIfObsolete();

            setActiveModule(result.data);
        });
    };

    const onChangeModule = (value: LessonModule) => {
        setActiveModule(value);
    };
    const onSaveModule = () => {
        if (!activeModule) { return; }
        doWork(async (stopIfObsolete) => {
            const r2 = await apiClient.setLessonModule({ value: activeModule });
            stopIfObsolete();
        });
    };

    const onAddModule = () => {
        const newItem = createDefaultLessonModule();
        setActiveModule(newItem);

        doWork(async (stopIfObsolete) => {
            const r2 = await apiClient.setLessonModule({ value: newItem });
            stopIfObsolete();

            await reloadModules(stopIfObsolete);
        });
    };
    const onDeleteModule = () => {
        const key = activeModule?.key;
        if (!key) { return; }

        setActiveModule(null);
        doWork(async (stopIfObsolete) => {
            const r2 = await apiClient.deleteLessonModule({ key });
            stopIfObsolete();

            await reloadModules(stopIfObsolete);
        });
    };

    return (
        <>
            <Loading loading={loading} />
            <ErrorBox error={error} />
            <View style={styles.container}>
                {modules && (
                    <TabsComponent
                        style={{ selectedTabText: { color: `#88FF88` } }}
                        header='Modules'
                        items={modules}
                        getKey={x => x.key}
                        getLabel={x => x.title}
                        selected={modules?.find(x => x.key === activeModule?.key)}
                        onSelect={x => loadModule(x.key)}
                        onAdd={onAddModule}
                    />
                )}
                {activeModule && (
                    <>
                        <View style={{ flexDirection: `row`, justifyContent: `flex-end` }}>
                            <TouchableOpacity onPress={onSaveModule}>
                                <View style={styles.buttonView}>
                                    <Text style={styles.buttonText}>{`${`💾`} Save Module`}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onDeleteModule}>
                                <View style={styles.buttonView}>
                                    <Text style={styles.buttonText}>{`${`❌`} Delete Module`}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <LessonModuleEditor key={activeModule.key} value={activeModule} onChange={onChangeModule} />
                    </>
                )}
            </View>
        </>
    );
};
