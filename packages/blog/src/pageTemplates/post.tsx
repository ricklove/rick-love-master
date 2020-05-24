import './post.css';
import React from 'react';
// import { Markdown } from '../components/markdown';
import { SEO } from './layout/seo';
import { Layout } from './layout/layout';

export type PostPageData = {
    sourceFilePath: string;
    sourceFileContent: string;
    headers: { key: string, value: string }[];

    title: string;
    body: string;
    summary: string;
};

export const PostPage = (props: { data: PostPageData }) => {
    const { body, headers, title } = props.data;

    return (
        <Layout>
            <SEO title={title} />
            <div style={{ display: `block`, minWidth: `100%` }}>
                <p>{title}</p>
                <p>
                    {headers.map(x => (
                        <span key={x.key} style={{ display: `flex`, flexDirection: `row` }}>
                            <span style={{ minWidth: `100px` }}>{x.key}</span>
                            <span style={{}}>{x.value}</span>
                        </span>
                    ))}
                </p>
                <div>
                    {body}
                    {/* <Markdown markdown={body} /> */}
                </div>
            </div>
        </Layout>
    );
};
