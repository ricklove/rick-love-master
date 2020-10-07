/* eslint-disable unicorn/no-for-loop */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native-lite';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prism-themes/themes/prism-vsc-dark-plus.css';
import { distinct, shuffle } from 'utils/arrays';
import { StringSpan } from 'utils/string-span';
import { randomItem } from 'utils/random';
import { LessonProjectFile, LessonProjectFileSelection } from '../lesson-types';
import { isSimilarCodeToken } from './code-editor-helpers';

export type FileEditorMode = 'display' | 'edit' | 'type-selection';
export const FileCodeEditor = ({ file, selection, mode }: { file: LessonProjectFile, selection?: LessonProjectFileSelection, mode: FileEditorMode }) => {
    return (
        <View style={{}}>
            <View style={{ background: `#1e1e1e`, alignSelf: `flex-start`, padding: 4 }}>
                <Text>{`📝 ${file.path}`}</Text>
            </View>
            <View style={{ padding: 0 }}>
                {mode === `display` && (
                    <CodeEditor_Display code={file.content} language={file.language} selection={selection} />
                )}
                {mode === `edit` && (
                    <CodeEditor_Edit code={file.content} language={file.language} selection={selection} />
                )}
                {mode === `type-selection` && (
                    <CodeEditor_TypeSelection code={file.content} language={file.language} selection={selection} />
                )}
            </View>
        </View >
    );
};

const CodeEditor_Display = ({ code, language }: { code: string, language: 'tsx', selection?: LessonProjectFileSelection }) => {
    const htmlWithSelection = highlight(code, languages[language], language);

    return (
        <View >
            <View>
                <pre style={{ margin: 0 }} className={`language-${language}`}>
                    <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: htmlWithSelection }} />
                </pre>
            </View>
        </View>
    );
};

const CodeEditor_Edit = ({ code, language }: { code: string, language: 'tsx', selection?: LessonProjectFileSelection }) => {
    const [inputText, setInputText] = useState(code);
    const [inputHtml, setInputHtml] = useState(``);
    const changeInputText = (value: string) => {
        setInputText(value);
        setInputHtml(highlight(value, languages[language], language));
    };
    const onBlur = () => {
        setInputText(inputText);
        setInputHtml(highlight(inputText, languages[language], language));
    };
    useEffect(() => {
        setInputHtml(highlight(inputText, languages[language], language));
    }, [code]);

    return (
        <View >
            <View style={{}}>
                <TextInput
                    value={inputText}
                    onChange={changeInputText}
                    onBlur={onBlur}
                    autoCompleteType='off'
                    keyboardType='default'
                    multiline
                    numberOfLines={16}
                />
            </View>
            <View>
                <pre style={{ margin: 0 }} className={`language-${language}`}>
                    <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: inputHtml }} />
                </pre>
            </View>

        </View>
    );
};

const CodeEditor_TypeSelection = ({ code, language, selection }: { code: string, language: 'tsx', selection?: LessonProjectFileSelection }) => {

    // const [html_full, setHtml_full] = useState(``);
    const [html_before, setHtml_before] = useState(``);
    const [html_focus, setHtml_focus] = useState(``);
    const [html_after, setHtml_after] = useState(``);
    const [code_focus, setCode_focus] = useState(``);
    const [codeParts, setCodeParts] = useState([] as StringSpan[]);

    // const [codeHtmlPairs, setCodeHtmlPairs] = useState([] as CodeHtmlPair[]);

    useEffect(() => {
        // console.log(`highlight`, { code, language });

        let codeBefore = code;
        let codeFocus = ``;
        let codeAfter = ``;

        if (selection) {
            codeBefore = code.substr(0, selection.index);
            codeFocus = code.substr(selection.index, selection.length);
            codeAfter = code.substr(selection.index + selection.length);
        }

        setCode_focus(codeFocus);

        const htmlWithSelection = highlight(code, languages[language], language);
        const htmlWithoutSelection = highlight(codeBefore + codeAfter, languages[language], language);

        let lengthSameStart = 0;
        let lengthSameEnd = 0;
        for (let i = 0; i < htmlWithSelection.length && i < htmlWithoutSelection.length; i++) {
            if (htmlWithSelection.charAt(i) !== htmlWithoutSelection.charAt(i)) { break; }
            lengthSameStart++;
        }
        for (let i = 0; i < htmlWithSelection.length && i < htmlWithoutSelection.length; i++) {
            if (htmlWithSelection.charAt(htmlWithSelection.length - i) !== htmlWithoutSelection.charAt(htmlWithoutSelection.length - i)) { break; }
            lengthSameEnd++;
        }

        // Move back to start of <span
        const iFocus = htmlWithSelection.lastIndexOf(`<span`, lengthSameStart);
        // Move forward to end of </span>
        const iFocusEnd = htmlWithSelection.indexOf(`</span>`, htmlWithSelection.length - lengthSameEnd - 1 - `</span>`.length) + `</span>`.length;

        const htmlBefore = htmlWithSelection.substr(0, iFocus);
        const htmlFocus = htmlWithSelection.substr(iFocus, iFocusEnd - iFocus);
        const htmlAfter = htmlWithSelection.substr(iFocusEnd);

        // const pairs = splitCodeSpanTags(htmlFocus);
        // setCodeHtmlPairs(pairs);
        const cPartsRaw = new StringSpan(codeFocus, 0, codeFocus.length).splitOnRegExp(/\W/g);
        const cParts = cPartsRaw.flatMap(x => x.length <= 1 ? [x] : [x.transform(0, -(x.length - 1)), x.transform(1, 0)]).filter(x => x.length > 0);
        // const cParts = new StringSpan(codeFocus, 0, codeFocus.length).splitOnRegExp(/\W/g).flatMap(x => x.length === 1 ? [x] : [x.transform(0, -(x.length - 1)), x.transform(1, 0)]);

        console.log(`CodeEditor`, {
            // code_before,
            // code_focus,
            // code_after,
            // htmlWithSelection,
            // htmlWithoutSelection,
            htmlBefore,
            htmlFocus,
            htmlAfter,
            cParts,
        });

        // setHtml_full(`<span style='opacity:0.5'>${htmlBefore}</span><span style='opacity:1'>${htmlFocus}</span><span style='opacity:0.5'>${htmlAfter}</span>`);
        setHtml_before(htmlBefore);
        setHtml_focus(htmlFocus);
        setHtml_after(htmlAfter);
        setCodeParts(cParts);

        updateAutoComplete();
    }, [code]);

    const [inputHtml, setInputHtml] = useState(``);
    const [inputText, setInputText] = useState(``);
    const [isActive, setIsActive] = useState(true);
    const [isBlink, setIsBlink] = useState(true);
    const [feedback, setFeedback] = useState({ message: ``, isCorrect: true, isDone: false });
    const [autoComplete, setAutoComplete] = useState([] as { textCompleted: string, text: string, isSelected: boolean, isWrong: boolean }[]);

    const updateAutoComplete = (completed?: string) => {
        if (!code_focus || completed == null
            || code_focus === completed
        ) {
            setAutoComplete([]);
            return;
        }


        // const remaining = code_focus.substr(completed.length);

        let iNext = 0;
        const nextPartIndexRaw = codeParts.findIndex(x => {
            if (iNext > completed.length) {
                return true;
            }
            iNext += x.length;
            return false;
        });
        const nextPartIndex = nextPartIndexRaw < 0 ? codeParts.length : nextPartIndexRaw;
        const activePartText = codeParts[nextPartIndex - 1]?.toString();
        const iDone = codeParts[nextPartIndex - 1]?.start;
        // console.log(`updateAutoComplete`, { iNext, iDone, activePart: activePartText, codeParts, completed });

        if (!activePartText?.trim()) {
            setAutoComplete([]);
            return;
        }

        const activePartTextCompleted = activePartText.substr(0, completed.length - iDone);
        const matchWords = distinct(codeParts
            .filter(x =>
                (!!activePartTextCompleted && x.startsWith(activePartTextCompleted))
                || (!activePartTextCompleted && isSimilarCodeToken(x.toString(), activePartText)))
            .map(x => x.toString())
            .filter(x => x.toString() !== activePartText)
            .filter(x => !!x.trim()),
        );

        // console.log(`updateAutoComplete`, { iNext, iDone, activePart: activePartText, completed, codeParts, activePartTextCompleted, matchWords });

        const choices = [activePartText, ...shuffle(matchWords).slice(0, 3)].map(x => ({ textCompleted: x.substr(0, completed.length - iDone), text: x.substr(completed.length - iDone) }));
        setAutoComplete(shuffle(choices).map((x, i) => ({ ...x, isSelected: i === 0, isWrong: false })));
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
                const iSelected = s.findIndex(x => x.isSelected);
                const iSelectedNew = Math.max(0, iSelected - 1);
                return [...s.map((x, i) => ({ ...x, isSelected: iSelectedNew === i }))];
            });
        }
        if (e.keyCode === DOWNKEY) {
            setAutoComplete(s => {
                const iSelected = s.findIndex(x => x.isSelected);
                const iSelectedNew = Math.min(autoComplete.length - 1, iSelected + 1);
                return [...s.map((x, i) => ({ ...x, isSelected: iSelectedNew === i }))];
            });
        }
        return true;
    };

    const changeInputText = (valueRaw: string) => {
        const wasBackspace = valueRaw.length < inputText.length;
        const wasTab = valueRaw.endsWith(`\t`);
        const wasReturn = valueRaw.endsWith(`\n`);
        const wasPeriod = valueRaw.endsWith(`.`);
        const wasSpace = valueRaw.endsWith(` `);

        const wasCorrectRaw = code_focus.startsWith(valueRaw);
        const wasAutoComplete = !wasCorrectRaw && (wasTab || wasReturn || wasPeriod || wasSpace);
        const activeAutoComplete = autoComplete.find(x => x.isSelected);

        const value = wasCorrectRaw ? valueRaw
            : wasAutoComplete ? inputText + activeAutoComplete?.text ?? ``
                : valueRaw
            ;

        const wasCorrect = code_focus.startsWith(value);
        const wasCorrect_ignoreCase = code_focus.toLowerCase().startsWith(value.toLowerCase());

        if (code_focus === inputText) {
            setFeedbackOpacity(1);
            setFeedback({ message: `You're already done.`, isCorrect: false, isDone: true });
            return;
        }
        if (wasBackspace) {
            setFeedbackOpacity(1);
            setFeedback({ message: `You're right so far, no need to backspace.`, isCorrect: false, isDone: false });
            return;
        }
        if (!wasCorrect) {
            if (wasAutoComplete && activeAutoComplete) {
                activeAutoComplete.isWrong = true;
            }
            if (!activeAutoComplete) {
                updateAutoComplete(``);
            }
            setFeedbackOpacity(1);
            setFeedback({ message: randomItem([`Wrong`, `Incorrect`, `No`, `Try Again`]), isCorrect: false, isDone: false });
            return;
        }

        const isDone = code_focus === value;

        // console.log(`changeInputText`, {
        //     value,
        //     valueRaw,
        // });

        setFeedbackOpacity(1);
        setFeedback({ isCorrect: true, message: ``, isDone });
        setInputText(value);

        const valueHtml = highlight(value, languages[language], language);
        setInputHtml(valueHtml);
        setIsActive(true);
        updateAutoComplete(value);
    };

    const [feedbackOpacity, setFeedbackOpacity] = useState(0);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsBlink(s => !s);
            setFeedbackOpacity(s => s - 0.1);
        }, 500);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const css_feedbackWrapper = `display: inline-block; position: relative; bottom: 40px; width:0px; opacity:${feedbackOpacity > 0.7 ? 1 : 0}`;
    const css_feedback_correct = `  display: inline-block; padding: 4px; position: absolute; color:#88FF88; background:#000000; border-radius:4px`;
    const css_feedback_incorrect = `display: inline-block; padding: 4px; position: absolute; color:#FF8888; background:#000000; border-radius:4px`;
    const html_feedback = (
        feedback.isDone ? `<span style='${css_feedbackWrapper}'><span style='${css_feedback_correct}'>${`✔ ${feedback.message}`.trim()}</span></span>`
            : !feedback.isCorrect ? `<span style='${css_feedbackWrapper}'><span style='${css_feedback_incorrect}'>❌ ${feedback.message}</span></span>`
                : ``
    );

    const css_autoCompleteWrapper = `display: inline-block; position: relative; top: 4px; width:0px;`;
    const css_autoCompleteInner = `display: block; position: absolute; background:#000000; border: solid 1px #CCCCFF;`;
    const css_autoCompleteItem = `display: block; padding: 4px; color:#FFFFFF;`;
    const css_autoCompleteItem_selected = `display: block; padding: 4px; color:#CCCCFF; background:#111133; min-width: 60px;`;
    const css_autoCompleteItem_textCompleted = `color:#CCCCFF;`;
    const css_autoCompleteItem_textNew = ``;
    const html_autoComplete = autoComplete.length <= 0 ? `` :
        `<span style='${css_autoCompleteWrapper}'><span style='${css_autoCompleteInner}'>${autoComplete.map(x => (
            `<span style='${x.isSelected ? css_autoCompleteItem_selected : css_autoCompleteItem}'>${true
            && `<span style='${css_autoCompleteItem_textCompleted}'>${x.isWrong ? `❌ ` : ``}${x.textCompleted}</span><span style='${css_autoCompleteItem_textNew}'>${x.text}</span>`
            }</span>`

        )).join(``)}</span></span>`
        ;
    const autoCompletePadding = 100;

    const html_cursor = `<span style='display: inline-block; width: 0px; margin: 0px; position: relative; left: -4px;'>${(isBlink ? `|` : ` `)}</span>`;
    const html_full = `<span style='opacity:0.5'>${html_before}</span><span style='opacity:1'>${inputHtml}${isActive ? html_cursor : ``}${html_feedback}${html_autoComplete}</span><span style='opacity:0.5'>${html_after}</span>`;

    if (!html_full) {
        return <></>;
    }

    // console.log(`CodeEditor`, { mode });

    return (
        <View style={{ position: `relative` }}>
            <View>
                <pre style={{ margin: 0, paddingBottom: autoCompletePadding }} className={`language-${language}`}>
                    <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: html_full }} />
                </pre>
            </View>
            <View style={{ position: `absolute`, top: 0, left: 0, right: 0, bottom: 0, opacity: 0 }}>
                <input type='text' style={{ width: `100%`, height: `100%`, background: `#FF0000` }}
                    value={inputText}
                    onChange={(e) => changeInputText(e.target.value)}
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setIsActive(false)}
                    onKeyDown={(e) => onKeyDown(e)}
                />
            </View>
        </View>
    );
};
