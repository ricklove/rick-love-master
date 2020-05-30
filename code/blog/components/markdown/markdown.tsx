import React, { } from 'react';
import ReactMarkdown from 'react-markdown';

import { MarkdownCode } from './markdown-code';
import { CodeWrapper_ZoomButtons } from './markdown-code-wrapper-zoom-buttons';

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
