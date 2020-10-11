/* eslint-disable unicorn/no-for-loop */
/* eslint-disable react/no-danger */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput } from 'react-native-lite';
import { randomItem } from 'utils/random';
import { LessonProjectFile, LessonProjectFileSelection, LessonProjectState } from '../lesson-types';
import { CodePartsData, getAutoComplete, getCodeParts, getCodePartsCompleted } from './code-editor-helpers';
import { CodeDisplay } from './code-display';
import { TabsListEditorComponent } from './tabs';

export type LessonProjectEditorMode = 'display' | 'edit';
export const LessonProjectFilesEditor = ({
    projectData,
    projectEditorMode,
    fileEditorMode_focus,
    fileEditorMode_noFocus,
    onProjectDataChange,
}: {
    projectData: {
        projectState: LessonProjectState;
        focus: LessonProjectFileSelection;
    };
    projectEditorMode: LessonProjectEditorMode;
    fileEditorMode_focus: LessonFileEditorMode;
    fileEditorMode_noFocus: LessonFileEditorMode;
    onProjectDataChange: (value: {
        projectState?: LessonProjectState;
        focus?: LessonProjectFileSelection;
    }) => void;
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
                    onChange={changeFile} onSelectionChange={changeSelection} />
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
}: {
    projectEditorMode: LessonProjectEditorMode;
    fileEditorMode: LessonFileEditorMode;
    file: LessonProjectFile;
    onChange: (value: LessonProjectFile) => void;
    selection?: LessonProjectFileSelection;
    onSelectionChange: (value: { index: number, length: number }) => void;
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
            />
        </>
    );
};

export type LessonFileEditorMode = 'display' | 'edit' | 'type-selection';
export const LessonFileContentEditor = ({
    file,
    selection,
    mode,
    onCodeChange,
    onSelectionChange,
}: {
    file: LessonProjectFile;
    selection?: LessonProjectFileSelection;
    mode: LessonFileEditorMode;
    onCodeChange: (code: string) => void;
    onSelectionChange: (value: { index: number, length: number }) => void;
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
                {mode === `type-selection` && (
                    <LessonFileContentEditor_TypeSelection code={file.content} language={file.language} selection={selection} />
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

const LessonFileContentEditor_TypeSelection = ({ code, language, selection }: { code: string, language: 'tsx', selection?: LessonProjectFileSelection }) => {

    const [codeParts, setCodeParts] = useState(null as null | CodePartsData);

    useEffect(() => {
        const parts = getCodeParts(code, language, selection);
        setCodeParts(parts);
        setAutoComplete(null);
    }, [code]);

    const [inputText, setInputText] = useState(``);
    const [isActive, setIsActive] = useState(false);
    const [feedback, setFeedback] = useState({ message: ``, isCorrect: true, isDone: false, timestamp: 0 });
    const [autoComplete, setAutoComplete] = useState(null as null | { choices: { textCompleted: string, text: string, isSelected: boolean, isWrong: boolean }[], activeIndex: number });

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const TABKEY = 9;
        const RETURNKEY = 13;
        const UPKEY = 38;
        const DOWNKEY = 40;
        // console.log(`CodeEditor onKeyPress`, { keyCode: e.keyCode });

        if (e.keyCode === TABKEY) {
            // console.log(`CodeEditor onKeyPress onTabKey`);
            e.preventDefault();
            e.stopPropagation();

            changeInputText(`${inputText}\t`);
            return false;
        }
        if (e.keyCode === RETURNKEY) {
            // console.log(`CodeEditor onKeyPress onTabKey`);
            e.preventDefault();
            e.stopPropagation();

            changeInputText(`${inputText}\n`);
            return false;
        }
        if (e.keyCode === UPKEY) {
            setAutoComplete(s => {
                if (!s) { return null; }
                const iSelected = s.choices.findIndex(x => x.isSelected);
                const iSelectedNew = Math.max(0, iSelected - 1);
                return { ...s, choices: [...s.choices.map((x, i) => ({ ...x, isSelected: iSelectedNew === i }))] };
            });
        }
        if (e.keyCode === DOWNKEY) {
            setAutoComplete(s => {
                if (!s) { return null; }
                const iSelected = s.choices.findIndex(x => x.isSelected);
                const iSelectedNew = Math.min(s.choices.length - 1, iSelected + 1);
                return { ...s, choices: [...s.choices.map((x, i) => ({ ...x, isSelected: iSelectedNew === i }))] };
            });
        }
        return true;
    };

    const changeInputText = (valueRaw: string) => {
        if (!codeParts) { return; }
        const {
            codeFocus,
        } = codeParts;

        const newInput = valueRaw.substr(inputText.length);
        const wasBackspace = valueRaw.length < inputText.length;
        const wasTab = valueRaw.endsWith(`\t`);
        const wasReturn = valueRaw.endsWith(`\n`);
        const wasPeriod = valueRaw.endsWith(`.`);
        const wasSpace = valueRaw.endsWith(` `);

        const remaining = codeFocus.substr(inputText.length);
        const isWhitespace = remaining.trimStart() !== remaining;
        const wasCorrectRaw = codeFocus.startsWith(valueRaw);
        const wasAutoComplete = autoComplete && !wasCorrectRaw && (wasTab || wasReturn || wasPeriod || wasSpace);
        const activeAutoComplete = autoComplete?.choices.find(x => x.isSelected);

        const value2 = wasCorrectRaw ? valueRaw
            : wasAutoComplete ? inputText + (activeAutoComplete?.text ?? ``)
                : (wasReturn || wasTab || wasSpace) && isWhitespace ? codeFocus.substr(0, codeFocus.length - remaining.trimStart().length)
                    : valueRaw
            ;

        const wasCorrect_ignoreWhitespace = remaining.trimStart().startsWith(newInput);
        const value = wasCorrect_ignoreWhitespace ? codeFocus.substr(0, codeFocus.length - remaining.trimStart().length + 1) : value2;

        const wasCorrect = codeFocus.startsWith(value);

        console.log(`changeInputText`, {
            wasBackspace,
            wasTab,
            wasReturn,
            wasPeriod,
            wasSpace,
            wasCorrectRaw,
            wasAutoComplete,
            activeAutoComplete,
            value,
            value2,
            valueRaw,
            codeFocus,
            remaining,
            isWhitespace,
            wasCorrect,
            wasCorrect_ignoreWhitespace,
        });

        if (codeFocus === inputText) {
            setFeedback({ message: `You're already done.`, isCorrect: false, isDone: true, timestamp: Date.now() });
            return;
        }
        if (wasBackspace) {
            setFeedback({ message: `You're right so far, no need to backspace.`, isCorrect: false, isDone: false, timestamp: Date.now() });
            return;
        }
        if (!wasCorrect) {
            if (wasAutoComplete && activeAutoComplete) {
                activeAutoComplete.isWrong = true;
            }
            if (!activeAutoComplete) {
                const a = getAutoComplete(codeParts, inputText);
                setAutoComplete(a);
            }
            setFeedback({ message: randomItem([`Wrong`, `Incorrect`, `No`, `Try Again`]), isCorrect: false, isDone: false, timestamp: Date.now() });
            return;
        }

        const isDone = codeFocus === value;

        setIsActive(true);
        setInputText(value);
        setFeedback({ isCorrect: true, message: ``, isDone, timestamp: Date.now() });
        const a = getAutoComplete(codeParts, value);
        setAutoComplete(a);
    };


    if (!codeParts) {
        return <></>;
    }

    const s = selection ?? { index: 0, length: code.length };
    const cursorIndex = s.index + inputText.length;
    const activeIndex = autoComplete?.activeIndex ?? cursorIndex;
    const activeCodeParts = getCodePartsCompleted(codeParts.codeParts, { index: cursorIndex, length: codeParts.codeFocus.length - inputText.length }, { showBlank: true });
    const nextChar = code.substr(cursorIndex, 1);
    console.log(`CodeEditor_TypeSelection`, { nextChar, inputText, codeParts, activeCodeParts, isActive, cursorIndex, activeIndex, feedback, autoComplete: autoComplete?.choices });

    return (
        <>
            <View style={{ position: `relative` }}>
                <View>
                    <CodeDisplay codeParts={activeCodeParts} language={language} inputOptions={{ isActive, cursorIndex, activeIndex, feedback, autoComplete: autoComplete?.choices }} />
                </View>
                <View style={{ position: `absolute`, top: 0, left: 0, right: 0, bottom: 0, opacity: 0 }}>
                    <textarea style={{ width: `100%`, height: `100%`, background: `#FF0000` }}
                        value={inputText}
                        onChange={(e) => changeInputText(e.target.value)}
                        onFocus={() => setIsActive(true)}
                        onBlur={() => setIsActive(false)}
                        onKeyDown={(e) => onKeyDown(e)}
                    />
                </View>
            </View>
            {/* <Text>{inputText}</Text> */}
        </>
    );
};
