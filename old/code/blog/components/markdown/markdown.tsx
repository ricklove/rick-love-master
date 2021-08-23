import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';

import { MarkdownCode } from './markdown-code';
import { CodeWrapper_ZoomButtons } from './markdown-code-wrapper-zoom-buttons';

export const Markdown = (props: { markdown: string }) => {
    return (
        <div className='markdown-body' style={{ padding: 0 }}>
            <ReactMarkdown source={props.markdown}
                renderers={{
                    // text: ((p: { children: ReactNode }) => <p className='markdown-text-container'>{p.children}</p>),
                    // eslint-disable-next-line jsx-a11y/alt-text
                    image: ((p: unknown) => <span className='markdown-image-container'><img {...(p as never)} /></span>),
                    code: ((p: unknown) => <CodeWrapper_ZoomButtons><MarkdownCode {...p} /></CodeWrapper_ZoomButtons>),
                }} />
        </div>
    );
};
