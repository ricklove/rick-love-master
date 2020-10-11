import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native-lite';
import { randomItem } from 'utils/random';
import { LessonProjectFileSelection } from '../lesson-types';
import { CodePartsData, getAutoComplete, getCodeParts, getCodePartsCompleted } from './code-editor-helpers';
import { CodeDisplay, CodeDisplayFeedback, CodeDisplayPrompt } from './code-display';

export const LessonFileContentEditor_ConstructCode = ({ code, language, selection, onDone, prompt }: {
    code: string; language: 'tsx';
    selection?: LessonProjectFileSelection;
    onDone: () => void;
    prompt?: CodeDisplayPrompt;
}) => {
    const [codeParts, setCodeParts] = useState(null as null | CodePartsData);
    const inputRef = useRef(null as null | HTMLTextAreaElement);

    useEffect(() => {
        const parts = getCodeParts(code, language, selection);
        setCodeParts(parts);
        setAutoComplete(null);

        const timeoutId = setTimeout(() => {
            inputRef.current?.focus();
        }, 250);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [code]);

    const [inputText, setInputText] = useState(``);
    const [isActive, setIsActive] = useState(false);
    const [feedback, setFeedback] = useState(null as null | CodeDisplayFeedback);
    const [autoComplete, setAutoComplete] = useState(null as null | { choices: { textCompleted: string, text: string, isSelected: boolean, isWrong: boolean }[], activeIndex: number });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setFeedback(s => ({
                message: `⬇ Type Here`,
                emoji: `😀`,
                timestamp: Date.now(),
                timeout: 15 * 1000,
            }));
        }, 3000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [code]);

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
        const value = wasCorrect_ignoreWhitespace ? codeFocus.substr(0, codeFocus.length - remaining.trimStart().length + newInput.length) : value2;

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
            setFeedback({ emoji: randomItem(`😎 😁 😆`.split(` `)), message: `✔ You're already done.`, timestamp: Date.now() });
            return;
        }
        if (wasBackspace) {
            setFeedback({ isNegative: true, emoji: randomItem(`😥 😪 😫 😝 😲 🙀 😾 😿`.split(` `)), message: `❌ You're right so far, no need to backspace.`, timestamp: Date.now() });
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
            setFeedback({ isNegative: true, emoji: randomItem(`😥 😪 😫 😝 😲 🙀 😾 😿`.split(` `)), message: `❌ ${randomItem([`Wrong`, `Incorrect`, `No`, `Try Again`])}`, timestamp: Date.now() });
            return;
        }

        const isDone = codeFocus === value;
        onDone();

        setIsActive(true);
        setInputText(value);
        setFeedback(!isDone ? null : { emoji: randomItem(`😎 😁 😆`.split(` `)), message: `✔`, timestamp: Date.now() });
        const a = getAutoComplete(codeParts, value);
        setAutoComplete(a);

        inputRef.current?.focus();
    };

    const onAutocomplete = (text: string) => {
        if (!autoComplete) { return; }

        autoComplete.choices.forEach(x => { x.isSelected = false; });
        const choice = autoComplete.choices.find(x => x.text === text);
        if (!choice) { return; }

        choice.isSelected = true;
        changeInputText(inputText + text);
    };


    if (!codeParts || !code) {
        return <></>;
    }

    const s = selection ?? { index: 0, length: code.length };
    const cursorIndex = s.index + inputText.length;
    const activeIndex = autoComplete?.activeIndex ?? cursorIndex;
    const promptIndex = code.lastIndexOf(`\n`, code.lastIndexOf(`\n`, s.index) - 1);
    const activeCodeParts = getCodePartsCompleted(codeParts.codeParts, { index: cursorIndex, length: codeParts.codeFocus.length - inputText.length }, { showBlank: true });
    const nextChar = code.substr(cursorIndex, 1);
    console.log(`CodeEditor_TypeSelection`, { nextChar, inputText, codeParts, activeCodeParts, isActive, cursorIndex, activeIndex, feedback, autoComplete: autoComplete?.choices });

    return (
        <>
            <View style={{ position: `relative` }}>
                <View>
                    <CodeDisplay codeParts={activeCodeParts} language={language} inputOptions={{
                        isActive, cursorIndex, activeIndex, promptIndex,
                        feedback: feedback ?? undefined,
                        prompt: prompt ?? undefined,
                        autoComplete: autoComplete?.choices,
                        onAutocomplete,
                    }} />
                </View>
                <View style={{ position: `absolute`, top: 0, left: 0, right: 0, bottom: 0, opacity: 0 }}>
                    <textarea style={{ width: `100%`, height: `100%`, background: `#FF0000` }}
                        value={inputText}
                        onChange={(e) => changeInputText(e.target.value)}
                        onFocus={() => setIsActive(true)}
                        onBlur={() => setIsActive(false)}
                        onKeyDown={(e) => onKeyDown(e)}
                        ref={inputRef}
                    />
                </View>
            </View>
            {/* <Text>{inputText}</Text> */}
        </>
    );
};
