/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import { LessonModule, LessonProjectState, SetProjectState } from '@ricklove/code-training-lesson-common';
import { TabsComponent } from '@ricklove/code-training-lesson-components';
import { LessonApiConfig, LessonModuleMeta } from '@ricklove/code-training-lesson-editor-common';
import { createLessonApiClient } from '@ricklove/code-training-lesson-editor-common';
import { LessonModulePlayer } from '@ricklove/code-training-lesson-player';
import { C } from '@ricklove/react-controls';
import { Text, TouchableOpacity, View } from '@ricklove/react-native-lite';
import { useAsyncWorker } from '@ricklove/utils-react';
import { fetchJsonRequest } from '@ricklove/utils-web';
import { createDefaultLessonModule } from './lesson-defaults';
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

export const LessonModulesClientEditor = ({ config }: { config: LessonApiConfig }) => {
  const apiClientRef = useRef(createLessonApiClient({ fetchJsonRequest, config }));
  const apiClient = apiClientRef.current;

  const [mode, setMode] = useState(`edit` as 'edit' | 'play');
  const modes = [
    { value: `edit` as const, label: `Edit` },
    { value: `play` as const, label: `Play` },
  ];

  const [modules, setModules] = useState(null as null | LessonModuleMeta[]);
  const [activeModule, setActiveModule] = useState(null as null | LessonModule);
  // const [mode, setMode] = useState(`lesson` as 'lesson' | 'json');

  const { loading, error, doWork } = useAsyncWorker();
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
    if (!activeModule) {
      return;
    }
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
  const onBuildModule = () => {
    const key = activeModule?.key;
    if (!key) {
      return;
    }

    setActiveModule(null);
    doWork(async (stopIfObsolete) => {
      const r2 = await apiClient.buildLessonModule({ key });
      stopIfObsolete();
      await reloadModules(stopIfObsolete);
    });
  };
  const onDeleteModule = () => {
    const key = activeModule?.key;
    if (!key) {
      return;
    }

    setActiveModule(null);
    doWork(async (stopIfObsolete) => {
      const r2 = await apiClient.deleteLessonModule({ key });
      stopIfObsolete();

      await reloadModules(stopIfObsolete);
    });
  };

  const setProjectState: SetProjectState = async (projectState: LessonProjectState) => {
    await apiClient.setProjectState({ projectState });
    return { iFrameUrl: `http://localhost:3043/?filesHashCode=${projectState.filesHashCode}` };
  };

  return (
    <>
      <C.Loading loading={loading} />
      <C.ErrorBox error={error} />
      <View style={styles.container}>
        <TabsComponent
          style={{ selectedTabText: { color: `#8888FF` } }}
          header='Mode'
          items={modes}
          getKey={(x) => x.value}
          getLabel={(x) => x.label}
          selected={modes.find((x) => x.value === mode)}
          onSelect={(x) => setMode(x.value)}
        />
        {modules && (
          <TabsComponent
            style={{ selectedTabText: { color: `#88FF88` } }}
            header='Modules'
            items={modules}
            getKey={(x) => x.key}
            getLabel={(x) => x.title}
            selected={modules?.find((x) => x.key === activeModule?.key)}
            onSelect={(x) => loadModule(x.key)}
            onAdd={mode === `edit` ? onAddModule : undefined}
          />
        )}
        {activeModule && mode === `edit` && (
          <>
            <View style={{ flexDirection: `row`, justifyContent: `flex-end` }}>
              <TouchableOpacity onPress={onSaveModule}>
                <View style={styles.buttonView}>
                  <Text style={styles.buttonText}>{`${`💾`} Save Module`}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={onBuildModule}>
                <View style={styles.buttonView}>
                  <Text style={styles.buttonText}>{`${`🔨`} Build Module`}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={onDeleteModule}>
                <View style={styles.buttonView}>
                  <Text style={styles.buttonText}>{`${`❌`} Delete Module`}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <LessonModuleEditor
              key={activeModule.key}
              value={activeModule}
              onChange={onChangeModule}
              setProjectState={setProjectState}
            />
          </>
        )}
        {activeModule && mode === `play` && (
          <>
            <View style={{ borderStyle: `solid`, borderBottomWidth: 4, borderBottomColor: `#FFFFFF` }} />
            <LessonModulePlayer key={activeModule.key} module={activeModule} setProjectState={setProjectState} />
          </>
        )}
      </View>
    </>
  );
};
