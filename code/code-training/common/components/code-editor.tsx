/* eslint-disable unicorn/no-for-loop */
/* eslint-disable react/no-danger */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native-lite';
import { distinct, shuffle } from 'utils/arrays';
import { StringSpan } from 'utils/string-span';
import { randomItem } from 'utils/random';
import { LessonProjectFile, LessonProjectFileSelection, LessonProjectState } from '../lesson-types';
import { CodePartsData, getAutoComplete, getCodeParts, getCodePartsCompleted, isSimilarCodeToken } from './code-editor-helpers';
import { CodeDisplay } from './code-display';

const styles = {
    editorModeTabRowView: {
        flexDirection: `row`,
        paddingLeft: 16,
    },
    editorModeTabView: {
        background: `#1e1e1e`,
        alignSelf: `flex-start`,
        padding: 4,
        marginRight: 1,
    },
    editorModeTabView_selected: {
        background: `#292a2d`,
        alignSelf: `flex-start`,
        padding: 4,
        marginRight: 1,
    },
    editorModeTabText: {
        fontSize: 14,
        color: `#FFFFFFF`,
    },
    editorModeTabText_selected: {
        fontSize: 14,
        color: `#FFFF88`,
    },
} as const;

export type ProjectEditorMode = 'display' | 'edit';
export const ProjectCodeEditor = ({
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
    projectEditorMode: ProjectEditorMode;
    fileEditorMode_focus: FileEditorMode;
    fileEditorMode_noFocus: FileEditorMode;
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
    const [filePathEdit, setFilePathEdit] = useState(focus.filePath);
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

        const p = focusFile?.path ?? projectState.files[0].path;

        setActiveFilePath(p);
        setFilePathEdit(p);
    }, [projectState, focus]);

    const selectFileTab = (filePath: string) => {
        setActiveFilePath(filePath);
        setFilePathEdit(filePath);
    };
    const selectNewFileTab = () => {
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
        projectState.files.push(newFile);
        setActiveFilePath(newFile.path);
        setFilePathEdit(newFile.path);
    };
    const changeFileName = () => {
        const file = projectState.files.find(x => x.path === activeFilePath);
        if (!file) { return; }

        file.path = filePathEdit;
        setActiveFilePath(filePathEdit);
        onProjectDataChange({ projectState });
    };
    const deleteFile = () => {
        if (projectState.files.length <= 1) { return; }
        const file = projectState.files.find(x => x.path === activeFilePath);
        if (!file) { return; }

        const files = projectState.files.filter(x => x.path !== activeFilePath);
        if (file.path === activeFilePath) {
            const f = files[0];
            onProjectDataChange({
                focus: {
                    filePath: f.path,
                    index: 0,
                    length: f.content.length,
                },
                projectState: { files },
            });
            return;
        }
        onProjectDataChange({ projectState: { files } });
    };
    const changeCode = (code: string) => {
        const file = projectState.files.find(x => x.path === activeFilePath);
        if (!file) { return; }

        file.content = code;
        onProjectDataChange({ projectState: { files: projectState.files } });
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
    const activeFile = projectState.files.find(x => x.path === activeFilePath) ?? projectState.files[0];
    return (
        <>
            <View style={styles.editorModeTabRowView}>
                {projectState.files.map(x => (
                    <TouchableOpacity key={x.path + activeFilePath + focus.filePath} onPress={() => selectFileTab(x.path)}>
                        <View style={x.path === activeFilePath ? styles.editorModeTabView_selected : styles.editorModeTabView}>
                            <Text style={x.path === activeFilePath ? styles.editorModeTabText_selected : styles.editorModeTabText}>{`${focus.filePath === x.path ? `📝 ` : ``} ${x.path}`}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
                {projectEditorMode === `edit` && (
                    <>
                        <TouchableOpacity onPress={() => selectNewFileTab()}>
                            <View style={styles.editorModeTabView}>
                                <Text style={styles.editorModeTabText}>{`${`➕`} Add File`}</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                )}
            </View>
            {projectEditorMode === `edit` && (
                <>
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
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity onPress={() => deleteFile()}>
                            <View style={styles.editorModeTabView}>
                                <Text style={styles.editorModeTabText}>{`${`❌`} Delete File`}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {[activeFile].map(x => (
                <FileCodeEditor key={x.path}
                    file={x} selection={focus.filePath === x.path ? focus : undefined}
                    mode={focus.filePath === x.path ? fileEditorMode_focus : fileEditorMode_noFocus}
                    onCodeChange={changeCode} onSelectionChange={changeSelection} />
            ))}
        </>
    );
};

export type FileEditorMode = 'display' | 'edit' | 'type-selection';
export const FileCodeEditor = ({
    file,
    selection,
    mode,
    onCodeChange,
    onSelectionChange,
}: {
    file: LessonProjectFile;
    selection?: LessonProjectFileSelection;
    mode: FileEditorMode;
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
                    <CodeEditor_Display code={file.content} language={file.language} selection={selection} />
                )}
                {mode === `edit` && (
                    <CodeEditor_Edit code={file.content} language={file.language} selection={selection} onCodeChange={onCodeChange} onSelectionChange={onSelectionChange} />
                )}
                {mode === `type-selection` && (
                    <CodeEditor_TypeSelection code={file.content} language={file.language} selection={selection} />
                )}
            </View>
        </View >
    );
};

const CodeEditor_Display = ({ code, language, selection }: { code: string, language: 'tsx', selection?: LessonProjectFileSelection }) => {
    const codeParts = getCodeParts(code, language, selection);
    return (
        <CodeDisplay codeParts={codeParts.codeParts} language={language} />
    );
};

const CodeEditor_Edit = ({ code, language, selection, onCodeChange, onSelectionChange,
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

const CodeEditor_TypeSelection = ({ code, language, selection }: { code: string, language: 'tsx', selection?: LessonProjectFileSelection }) => {

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
