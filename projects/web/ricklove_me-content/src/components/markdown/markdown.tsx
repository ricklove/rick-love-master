import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MarkdownCode } from './markdown-code';
import { CodeWrapper_ZoomButtons } from './markdown-code-wrapper-zoom-buttons';

export const Markdown = (props: { markdown: string }) => {
    return (
        <div className='markdown-body' style={{ padding: 0 }}>
            <ReactMarkdown
                components={{
                    // text: ((p: { children: ReactNode }) => <p className='markdown-text-container'>{p.children}</p>),
                    image: ((p: unknown) => <span className='markdown-image-container'><img {...(p as never)} /></span>),
                    code: ((p: unknown) => <CodeWrapper_ZoomButtons><MarkdownCode {...(p as { language: string; value: string; inline: string })} /></CodeWrapper_ZoomButtons>),
                }}>{props.markdown}</ReactMarkdown>
        </div>
    );
};
