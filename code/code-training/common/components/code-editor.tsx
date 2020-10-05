/* eslint-disable unicorn/no-for-loop */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prism-themes/themes/prism-vsc-dark-plus.css';
import { LessonProjectFileSelection } from '../lesson-types';

export const CodeEditor = ({ code, language, selection }: { code: string, language: 'tsx', selection?: LessonProjectFileSelection }) => {

    const [html_before, setHtml_before] = useState(code as null | string);
    const [html_selection, setHtml_selection] = useState(``);
    const [html_after, setHtml_after] = useState(``);

    useEffect(() => {
        // console.log(`highlight`, { code, language });

        let code_before = code;
        let code_focus = ``;
        let code_after = ``;

        if (selection) {
            code_before = code.substr(0, selection.index);
            code_focus = code.substr(selection.index, selection.length);
            code_after = code.substr(selection.index + selection.length);
        }

        const htmlWithSelection = highlight(code, languages[language], language);
        const htmlWithoutSelection = highlight(code_before + code_after, languages[language], language);

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

        setHtml_before(htmlBefore);
        setHtml_selection(htmlFocus);
        setHtml_after(htmlAfter);
    }, [code]);

    if (!html_before) {
        return <></>;
    }

    return (
        <div>
            <pre className={`language-${language}`}>
                <code className={`language-${language}`} >
                    <span style={{ opacity: 0.5 }} dangerouslySetInnerHTML={{ __html: html_before }} />
                    <span style={{ opacity: 1 }} dangerouslySetInnerHTML={{ __html: html_selection }} />
                    <span style={{ opacity: 0.5 }} dangerouslySetInnerHTML={{ __html: html_after }} />
                </code>
            </pre>
        </div>
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
