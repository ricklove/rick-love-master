/* eslint-disable unicorn/no-for-loop */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native-lite';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prism-themes/themes/prism-vsc-dark-plus.css';
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
    }, [code]);

    const [inputHtml, setInputHtml] = useState(``);
    const [inputText, setInputText] = useState(``);
    const [isActive, setIsActive] = useState(true);
    const [isBlink, setIsBlink] = useState(true);
    const [feedback, setFeedback] = useState(``);

    const changeInputText = (valueRaw: string) => {
        const wasBackspace = valueRaw.length < inputText.length;
        const wasCorrect = code_focus.startsWith(valueRaw);
        const wasCorrect_ignoreCase = code_focus.toLowerCase().startsWith(valueRaw.toLowerCase());
        if (wasBackspace) {
            setFeedback(`You're right so far, no need to backspace.`);
            return;
        }
        if (!wasCorrect) {
            setFeedback(`No`);
            return;
        }
        const value = valueRaw;

        setFeedback(``);
        setInputText(value);
        setInputHtml(value);
        setIsActive(true);
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
    const css_feedback = `display: inline-block; padding: 4px; position: absolute; color:#FF8888; background:#000000; border-radius:4px`;
    const html_feedback = feedback ? `<span style='${css_feedbackWrapper}'><span style='${css_feedback}'>${feedback}</span></span>` : ``;
    const html_cursor = `<span style='display: inline-block; width: 0px; margin: 0px; position: relative; left: -4px;'>${(isBlink ? `|` : ` `)}</span>`;
    const html_full = `<span style='opacity:0.5'>${html_before}</span><span style='opacity:1'>${html_feedback}${inputHtml}${mode === `type` && isActive ? html_cursor : ``}</span><span style='opacity:0.5'>${html_after}</span>`;

    if (!html_full) {
        return <></>;
    }

    // console.log(`CodeEditor`, { mode });

    return (
        <View style={{ position: `relative` }}>
            <View>
                <pre style={{ margin: 0 }} className={`language-${language}`}>
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
