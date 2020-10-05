/* eslint-disable unicorn/no-for-loop */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native-lite';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prism-themes/themes/prism-vsc-dark-plus.css';
import { active, keys } from 'd3';
import { LessonProjectFile, LessonProjectFileSelection } from '../lesson-types';

export const FileCodeEditor = ({ file, selection, mode }: { file: LessonProjectFile, selection?: LessonProjectFileSelection, mode: 'display' | 'type' }) => {
    return (
        <View style={{}}>
            <View style={{ background: `#1e1e1e`, alignSelf: `flex-start`, padding: 4 }}>
                <Text>{`📝 ${file.path}`}</Text>
            </View>
            <View style={{ padding: 0 }}>
                <CodeEditor code={file.content} language={file.language} selection={selection} mode={mode} />
            </View>
        </View >
    );
};

export const CodeEditor = ({ code, language, selection, mode }: { code: string, language: 'tsx', selection?: LessonProjectFileSelection, mode: 'display' | 'type' }) => {

    // const [html_full, setHtml_full] = useState(``);
    const [html_before, setHtml_before] = useState(``);
    const [html_focus, setHtml_focus] = useState(``);
    const [html_after, setHtml_after] = useState(``);
    const [code_focus, setCode_focus] = useState(``);

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

        console.log(`CodeEditor`, {
            // code_before,
            // code_focus,
            // code_after,
            // htmlWithSelection,
            // htmlWithoutSelection,
            htmlBefore,
            htmlFocus,
            htmlAfter,
        });

        // setHtml_full(`<span style='opacity:0.5'>${htmlBefore}</span><span style='opacity:1'>${htmlFocus}</span><span style='opacity:0.5'>${htmlAfter}</span>`);
        setHtml_before(htmlBefore);
        setHtml_focus(htmlFocus);
        setHtml_after(htmlAfter);

        updateAutoComplete(codeFocus);
    }, [code]);

    const [inputHtml, setInputHtml] = useState(``);
    const [inputText, setInputText] = useState(``);
    const [isActive, setIsActive] = useState(true);
    const [isBlink, setIsBlink] = useState(true);
    const [feedback, setFeedback] = useState({ message: ``, isCorrect: true, isDone: false });
    const [autoComplete, setAutoComplete] = useState([] as { textCompleted: string, text: string, isSelected: boolean, isWrong: boolean }[]);

    const updateAutoComplete = (codeFocus: string, completed?: string) => {
        if (completed == null) {
            setAutoComplete([]);
            return;
        }


        const textNext = codeFocus.substr(completed.length);

        setAutoComplete([
            { textCompleted: completed, text: textNext, isSelected: true, isWrong: false },
            { textCompleted: completed, text: `WRONG`, isSelected: false, isWrong: false },
            { textCompleted: completed, text: `WRONG2`, isSelected: false, isWrong: false },
            { textCompleted: completed, text: `WRONG3`, isSelected: false, isWrong: false },
        ]);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const TABKEY = 9;
        const UPKEY = 38;
        const DOWNKEY = 40;
        console.log(`CodeEditor onKeyPress`, { keyCode: e.keyCode });

        if (e.keyCode === TABKEY) {
            // console.log(`CodeEditor onKeyPress onTabKey`);
            e.preventDefault();
            e.stopPropagation();

            changeInputText(`${inputText}\t`);
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
        const activeAutoComplete = autoComplete.find(x => x.isSelected);
        const value = !wasTab ? valueRaw : inputText + activeAutoComplete?.text ?? ``;

        const wasCorrect = code_focus.startsWith(value);
        const wasCorrect_ignoreCase = code_focus.toLowerCase().startsWith(value.toLowerCase());

        if (code_focus === inputText) {
            setFeedback({ message: `You're already done.`, isCorrect: false, isDone: true });
            return;
        }
        if (wasBackspace) {
            setFeedback({ message: `You're right so far, no need to backspace.`, isCorrect: false, isDone: false });
            return;
        }
        if (!wasCorrect) {
            if (wasTab && activeAutoComplete) {
                activeAutoComplete.isWrong = true;
            }
            updateAutoComplete(code_focus, ``);
            setFeedback({ message: ``, isCorrect: false, isDone: false });
            return;
        }

        const isDone = code_focus === value;

        setFeedback({ isCorrect: true, message: ``, isDone });
        setInputText(value);
        setInputHtml(value);
        setIsActive(true);
        updateAutoComplete(code_focus, value);
    };

    useEffect(() => {
        if (mode !== `type`) { return () => { }; }

        const intervalId = setInterval(() => {
            setIsBlink(s => !s);
        }, 500);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const css_feedbackWrapper = `display: inline-block; position: relative; bottom: 40px; width:0px;`;
    const css_feedback_correct = `display: inline-block; padding: 4px; position: absolute; color:#88FF88; background:#000000; border-radius:4px`;
    const css_feedback_incorrect = `display: inline-block; padding: 4px; position: absolute; color:#FF8888; background:#000000; border-radius:4px`;
    const html_feedback = mode !== `type` ? `` : (
        feedback.isDone ? `<span style='${css_feedbackWrapper}'><span style='${css_feedback_correct}'>✔${feedback.message}</span></span>`
            : !feedback.isCorrect ? `<span style='${css_feedbackWrapper}'><span style='${css_feedback_incorrect}'>❌ ${feedback.message}</span></span>`
                : ``
    );

    const css_autoCompleteWrapper = `display: inline-block; position: relative; top: 4px; width:0px;`;
    const css_autoCompleteInner = `display: block; position: absolute; background:#000000; border-radius:4px;`;
    const css_autoCompleteItem = `display: block; padding: 4px; color:#FFFFFF;`;
    const css_autoCompleteItem_selected = `display: block; padding: 4px; color:#CCCCFF; background:#111133;`;
    const css_autoCompleteItem_textCompleted = `color:#CCCCFF;`;
    const css_autoCompleteItem_textNew = ``;
    const html_autoComplete = mode !== `type` ? `` :
        `<span style='${css_autoCompleteWrapper}'><span style='${css_autoCompleteInner}'>${autoComplete.map(x => (
            `<span style='${x.isSelected ? css_autoCompleteItem_selected : css_autoCompleteItem}'>${true
            && `<span style='${css_autoCompleteItem_textCompleted}'>${x.isWrong ? `❌ ` : ``}${x.textCompleted}</span><span style='${css_autoCompleteItem_textNew}'>${x.text}</span>`
            }</span>`

        )).join(``)}</span></span>`
        ;
    const autoCompletePadding = mode !== `type` ? 0 : 100;

    const html_cursor = `<span style='display: inline-block; width: 0px; margin: 0px; position: relative; left: -4px;'>${(isBlink ? `|` : ` `)}</span>`;
    const html_full = `<span style='opacity:0.5'>${html_before}</span><span style='opacity:1'>${inputHtml}${mode === `type` && isActive ? html_cursor : ``}${html_feedback}${html_autoComplete}</span><span style='opacity:0.5'>${html_after}</span>`;

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
            {mode === `type` && (
                <View style={{ position: `absolute`, top: 0, left: 0, right: 0, bottom: 0, opacity: 0 }}>
                    <input type='text' style={{ width: `100%`, height: `100%`, background: `#FF0000` }}
                        value={inputText}
                        onChange={(e) => changeInputText(e.target.value)}
                        onFocus={() => setIsActive(true)}
                        onBlur={() => setIsActive(false)}
                        onKeyDown={(e) => onKeyDown(e)}
                    />
                </View>
            )}
        </View>
    );
};

// export const EditArea = ({
//     html,
// }: {
//     html: string;
// }) => {

//     return (
//         <span style={{ opacity: 1 }} dangerouslySetInnerHTML={{ __html: html_selection }} />
//     );
// };