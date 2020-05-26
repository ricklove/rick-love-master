/* eslint-disable react/prop-types */
import React, { } from 'react';
import Lowlight from 'react-lowlight';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import cs from 'highlight.js/lib/languages/csharp';
import xml from 'highlight.js/lib/languages/xml';

// import './markdown-code.css';

Lowlight.registerLanguage(`html`, xml);
Lowlight.registerLanguage(`js`, js);
Lowlight.registerLanguage(`javascript`, js);
// Lowlight.registerAlias({ js: [`javascript`] });
Lowlight.registerLanguage(`typescript`, ts);
Lowlight.registerLanguage(`ts`, ts);
// Lowlight.registerAlias({ ts: [`typescript`] });
Lowlight.registerLanguage(`csharp`, cs);
// Lowlight.registerAlias({ cs: [`csharp`] });

export const MarkdownCode = (props) => {
    // eslint-disable-next-line no-console
    console.log(`renderCodeBlock`, { props });

    return (
        <Lowlight
            language={props.language || `js`}
            value={props.value}
            inline={props.inline}
        />
    );
};
