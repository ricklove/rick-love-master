/* eslint-disable unicorn/no-for-loop */
/* eslint-disable react/no-danger */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput } from 'react-native-lite';
import { randomItem } from 'utils/random';
import { LessonProjectFile, LessonProjectFileSelection, LessonProjectState } from '../lesson-types';
import { CodePartsData, getAutoComplete, getCodeParts, getCodePartsCompleted } from './code-editor-helpers';
import { CodeDisplay } from './code-display';
import { TabsListEditorComponent } from './tabs';
import { LessonFileContentEditor_ConstructCode } from './lesson-file-editor-construct-code';

export type LessonProjectEditorMode = 'display' | 'edit';
export const LessonProjectFilesEditor = ({
    projectData,
    projectEditorMode,
    fileEditorMode_focus,
    fileEditorMode_noFocus,
    onProjectDataChange = () => { },
    onTaskDone = () => { },
}: {
    projectData: {
        projectState: LessonProjectState;
        focus: LessonProjectFileSelection;
    };
    projectEditorMode: LessonProjectEditorMode;
    fileEditorMode_focus: LessonFileEditorMode;
    fileEditorMode_noFocus: LessonFileEditorMode;
    onProjectDataChange?: (value: {
        projectState?: LessonProjectState;
        focus?: LessonProjectFileSelection;
    }) => void;
    onTaskDone?: () => void;
}) => {
    const {
        projectState,
        focus,
    } = projectData;
    const [activeFilePath, setActiveFilePath] = useState(focus.filePath);
    const lastFocusSet = useRef(null as null | LessonProjectFileSelection);

    useEffect(() => {
        const focusFile = projectState.files.find(x => x.path === focus.filePath);
        if (projectState.files.length > 0
            && (!focusFile
                || focus.length <= 0
                || focus.index >= (focusFile?.content.length ?? 0))
            && lastFocusSet.current !== focus
        ) {
            const f = projectState.files.find(x => x.path === focus.filePath) ?? projectState.files[0];
            const newFocus = {
                filePath: f.path,
                index: 0,
                length: f.content.length,
            };
            lastFocusSet.current = newFocus;

            onProjectDataChange({
                focus: newFocus,
            });
            return;
        }

        const p = focusFile?.path ?? projectState.files[0]?.path ?? undefined;

        setActiveFilePath(p);
    }, [projectState, focus]);

    const createNewFile = () => {
        let path = `new.ts`;
        let attempt = 1;
        // eslint-disable-next-line no-loop-func
        while (projectState.files.some(x => x.path === path)) {
            path = `new${attempt}.ts`;
            attempt++;
        }
        const newFile: LessonProjectFile = {
            path,
            content: ``,
            language: `tsx`,
        };
        return newFile;
    };

    const changeFile = (file: LessonProjectFile) => {
        onProjectDataChange({
            projectState: {
                files: projectState.files.map(x => {
                    if (x.path === file.path) { return file; }
                    return x;
                }),
            },
        });
    };
    const changeSelection = (value: { index: number, length: number }) => {
        const file = projectState.files.find(x => x.path === activeFilePath);
        if (!file) { return; }

        console.log(`changeSelection`, { ...value });
        const f = file;
        onProjectDataChange({
            focus: {
                filePath: f.path,
                ...value,
            },
        });
    };

    console.log(`ProjectCodeEditor`, { activeFilePath, focus, projectState });
    const activeFile = projectState.files.find(x => x.path === activeFilePath) ?? projectState.files[0] ?? undefined;
    return (
        <>
            <TabsListEditorComponent
                header='Files'
                items={projectState.files}
                onChange={projectEditorMode !== `edit` ? undefined : (x => onProjectDataChange({ projectState: { files: x } }))}
                getKey={x => x.path}
                getLabel={x => focus.filePath === x.path ? `📝 ${x.path}` : x.path}
                selected={activeFile}
                onSelect={x => setActiveFilePath(x.path)}
                onCreateNewItem={createNewFile}
            />
            {activeFile && (
                <LessonFileEditor
                    key={activeFile.path}
                    projectEditorMode={projectEditorMode}
                    file={activeFile} selection={focus.filePath === activeFile.path ? focus : undefined}
                    fileEditorMode={focus.filePath === activeFile.path ? fileEditorMode_focus : fileEditorMode_noFocus}
                    onChange={changeFile} onSelectionChange={changeSelection}
                    onTaskDone={onTaskDone}
                />
            )}
        </>
    );
};

export const LessonFileEditor = ({
    projectEditorMode,
    fileEditorMode,
    file,
    onChange,
    selection,
    onSelectionChange,
    onTaskDone,
}: {
    projectEditorMode: LessonProjectEditorMode;
    fileEditorMode: LessonFileEditorMode;
    file: LessonProjectFile;
    onChange: (value: LessonProjectFile) => void;
    selection?: LessonProjectFileSelection;
    onSelectionChange: (value: { index: number, length: number }) => void;
    onTaskDone: () => void;
}) => {

    const [filePathEdit, setFilePathEdit] = useState(file.path);
    const changeFileName = () => {
        file.path = filePathEdit;
        onChange({ ...file, path: filePathEdit });
    };

    return (
        <>
            {projectEditorMode === `edit` && (
                <View style={{ flexDirection: `row` }}>
                    <TextInput
                        style={{
                            padding: 4,
                            fontSize: 12,
                            color: `#FFFFFF`,
                            background: `#000000`,
                        }}
                        value={filePathEdit}
                        onChange={setFilePathEdit}
                        onBlur={changeFileName}
                        autoCompleteType='off'
                        keyboardType='default'
                    />
                </View>
            )}
            <LessonFileContentEditor
                file={file}
                onCodeChange={x => onChange({ ...file, content: x })}
                mode={fileEditorMode}
                selection={selection}
                onSelectionChange={onSelectionChange}
                onTaskDone={onTaskDone}
            />
        </>
    );
};

export type LessonFileEditorMode = 'display' | 'edit' | 'construct-code';
export const LessonFileContentEditor = ({
    file,
    selection,
    mode,
    onCodeChange,
    onSelectionChange,
    onTaskDone,
}: {
    file: LessonProjectFile;
    selection?: LessonProjectFileSelection;
    mode: LessonFileEditorMode;
    onCodeChange: (code: string) => void;
    onSelectionChange: (value: { index: number, length: number }) => void;
    onTaskDone: () => void;
}) => {
    return (
        <View style={{}}>
            {/* <View style={{ background: `#1e1e1e`, alignSelf: `flex-start`, padding: 4 }}>
                <Text>{`📝 ${file.path}`}</Text>
            </View> */}
            <View style={{ padding: 0 }}>
                {mode === `display` && (
                    <LessonFileContentEditor_Display code={file.content} language={file.language} selection={selection} />
                )}
                {mode === `edit` && (
                    <LessonFileContentEditor_Edit code={file.content} language={file.language} selection={selection} onCodeChange={onCodeChange} onSelectionChange={onSelectionChange} />
                )}
                {mode === `construct-code` && (
                    <LessonFileContentEditor_ConstructCode code={file.content} language={file.language} selection={selection} onDone={onTaskDone} />
                )}
            </View>
        </View >
    );
};

const LessonFileContentEditor_Display = ({ code, language, selection }: { code: string, language: 'tsx', selection?: LessonProjectFileSelection }) => {
    const codeParts = getCodeParts(code, language, selection);
    return (
        <CodeDisplay codeParts={codeParts.codeParts} language={language} />
    );
};

const LessonFileContentEditor_Edit = ({ code, language, selection, onCodeChange, onSelectionChange,
}: {
    code: string;
    language: 'tsx';
    selection?: LessonProjectFileSelection;
    onCodeChange: (code: string) => void;
    onSelectionChange: (value: { index: number, length: number }) => void;
}) => {

    const [inputText, setInputText] = useState(code);
    const [codeParts, setCodeParts] = useState(null as null | CodePartsData);
    const changeInputText = (value: string) => {
        setInputText(value);
        const parts = getCodeParts(code, language, selection);
        setCodeParts(parts);
    };
    const onBlur = () => {
        setInputText(inputText);
        const parts = getCodeParts(code, language, selection);
        setCodeParts(parts);
        onCodeChange(inputText);
    };
    useEffect(() => {
        const parts = getCodeParts(code, language, selection);
        setCodeParts(parts);
    }, [code, selection]);

    return (
        <View >
            <View style={{}}>
                <TextInput
                    style={{
                        padding: 4,
                        fontSize: 12,
                        color: `#FFFFFF`,
                        background: `#000000`,
                    }}
                    value={inputText}
                    onChange={changeInputText}
                    onBlur={onBlur}
                    autoCompleteType='off'
                    keyboardType='default'
                    multiline
                    numberOfLines={16}
                    onSelectionChange={x => onSelectionChange({ index: x.start, length: x.end - x.start })}
                />
            </View>
            <View>
                {codeParts && (<CodeDisplay codeParts={codeParts.codeParts} language={language} />)}
            </View>
        </View>
    );
};
