import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownCode } from './markdown-code';
import { CodeWrapper_ZoomButtons } from './markdown-code-wrapper-zoom-buttons';

export const Markdown = ({ markdown }: { markdown: string }) => {
  return (
    <div className='markdown-body' style={{ padding: 0 }}>
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, {}]]}
        components={{
          // text: ((p: { children: ReactNode }) => <p className='markdown-text-container'>{p.children}</p>),
          a: (p) => (
            <a {...p} href={p.href?.replace(/https:\/\/ricklove.me\//g, `/`)}>
              {p.children}
            </a>
          ),
          img: (p: unknown) => (
            <span className='markdown-image-container'>
              <img {...(p as never)} />
            </span>
          ),
          code: (p) => {
            if (p.inline) {
              return <code>{p.children}</code>;
            }

            return (
              <CodeWrapper_ZoomButtons>
                <MarkdownCode
                  inline={p.inline}
                  value={String(p.children)}
                  language={p.className?.replace(`language-`, ``)}
                />
              </CodeWrapper_ZoomButtons>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
