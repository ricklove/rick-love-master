import React from 'react';
import ReactMarkdown from 'react-markdown';

export const Markdown = ({ markdown }: { markdown: string }) => {
  return (
    <div className='markdown-body' style={{ padding: 0 }}>
      <ReactMarkdown
        components={{
          img: (p: unknown) => (
            <span>
              <img
                {...(p as never)}
                style={{
                  maxWidth: `100%`,
                }}
              />
            </span>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
