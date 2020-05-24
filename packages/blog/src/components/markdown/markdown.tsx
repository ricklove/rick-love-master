/* eslint-disable react/no-danger */
import React, { } from 'react';
import ReactMarkdown from 'react-markdown';

// import './markdown-github.css';
// import './markdown-retro.css';
import { MarkdownCode } from './markdown-code';
// import { CodeWrapper } from './markdown-code-wrapper';
// import { CodeWrapper_Zoom } from './markdown-code-wrapper-zoom';
import { CodeWrapper_ZoomButtons } from './markdown-code-wrapper-zoom-buttons';
// import { CodeWrapper_Normal } from './markdown-code-wrapper-normal';

// export type MarkdownStyle = {
//     root?: TextStyle,
//     view?: TextStyle,
//     codeBlock?: TextStyle,
//     codeInline?: TextStyle,
//     del?: TextStyle,
//     em?: TextStyle,
//     headingContainer?: TextStyle,
//     heading?: TextStyle,
//     heading1?: TextStyle,
//     heading2?: TextStyle,
//     heading3?: TextStyle,
//     heading4?: TextStyle,
//     heading5?: TextStyle,
//     heading6?: TextStyle,
//     hr?: TextStyle,
//     blockquote?: TextStyle,
//     inlineCode?: TextStyle,
//     list?: TextStyle,
//     listItem?: TextStyle,
//     listUnordered?: TextStyle,
//     listUnorderedItem?: TextStyle,
//     listUnorderedItemIcon?: TextStyle,
//     listUnorderedItemText?: TextStyle,
//     listOrdered?: TextStyle,
//     listOrderedItem?: TextStyle,
//     listOrderedItemIcon?: TextStyle,
//     listOrderedItemText?: TextStyle,
//     paragraph?: TextStyle,
//     hardbreak?: TextStyle,
//     strong?: TextStyle,
//     table?: TextStyle,
//     tableHeader?: TextStyle,
//     tableHeaderCell?: TextStyle,
//     tableRow?: TextStyle,
//     tableRowCell?: TextStyle,
//     text?: TextStyle,
//     strikethrough?: TextStyle,
//     link?: TextStyle,
//     blocklink?: TextStyle,
//     u?: TextStyle,
//     image?: TextStyle,
// };
// const loadLanguages = require(`prismjs/components/index`);
// const renderCodeBlock = (props: { language: string, value: string }) => {
//     // eslint-disable-next-line no-console
//     console.log(`renderCodeBlock`, { props });

//     let html = props.value;
//     let grammer = Prism.languages[props.language];

//     try {
//         if (!grammer) {
//             // if (require) {
//             loadLanguages([props.language]);
//             grammer = Prism.languages[props.language];
//             // }
//         }

//         html = Prism.highlight(props.value, grammer, props.language);
//     } catch (error) {
//         // eslint-disable-next-line no-console
//         console.error(`renderCodeBlock FAILED`, { error, grammer, props });
//     }

//     const cls = `language-${props.language}`;
//     return (
//         <pre className={cls}>
//             <code
//                 dangerouslySetInnerHTML={{ __html: html }}
//                 className={cls}
//             />
//         </pre>
//     );
// };


export const Markdown = (props: { markdown: string }) => {
    return (
        <div className='markdown-body' style={{ padding: 0 }}>
            <div>
                <ReactMarkdown source={props.markdown}
                    renderers={{
                        code: ((p: unknown) => <CodeWrapper_ZoomButtons><MarkdownCode {...p} /></CodeWrapper_ZoomButtons>),
                    }} />
            </div>
        </div>
    );
};
