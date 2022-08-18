import React from 'react';
import ReactMarkdown from 'react-markdown';

export const Markdown = ({ markdown }: { markdown: string }) => {
  return (
    <div className='markdown-body' style={{ padding: 0 }}>
      <ReactMarkdown
        components={{
          img: (props) => (
            <p style={{ textAlign: `center` }}>
              <img
                {...props}
                style={{
                  maxWidth: `100%`,
                }}
              />
            </p>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
