/* eslint-disable react/no-danger */
import './post.css';
import React from 'react';
import { Markdown } from '../components/markdown/markdown';
import { SEO } from './layout/seo';
import { Layout } from './layout/layout';
import { getNavigation } from '../site/store';

export type PostPageData = {
    sourceFilePath: string;
    sourceFileContent: string;
    headers: { key: string, value: string }[];

    title: string;
    body: string;
    summary: string;
    excerpt?: string;
    imageUrl?: string;
};

export const PostPage = (props: { data: PostPageData }) => {
    const { body, headers, title } = props.data;
    const Link = getNavigation().StaticPageLinkComponent;

    return (
        <Layout>
            <SEO title={title} description={props.data.excerpt} imageUrl={props.data.imageUrl} />
            <div style={{ display: `block`, minWidth: `100%` }} >
                <div className='post-item'>
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
                        <Markdown markdown={body} />
                    </div>
                    <div dangerouslySetInnerHTML={{
                        __html: `
                        <script src="https://utteranc.es/client.js"
                                repo="ricklove/ricklove-blog-comments"
                                issue-term="pathname"
                                label="Comment"
                                theme="github-dark"
                                crossorigin="anonymous"
                                async>
                        </script>
                    `}} />
                </div>
            </div>
            <Link to='/'>
                <div>
                    <p>Root</p>
                </div>
            </Link>


        </Layout>
    );
};
