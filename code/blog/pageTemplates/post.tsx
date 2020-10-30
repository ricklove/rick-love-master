import React, { } from 'react';
import './post.css';
import { Utterances } from 'comments/utterances';
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
            <div className='post-item-container' >
                <div className='post-item'>
                    <h2 className='post-item-title'>{title}</h2>
                    <p className='post-item-meta'>
                        {headers.map(x => (
                            <span key={x.key} style={{ display: `flex`, flexDirection: `row` }}>
                                <span style={{ minWidth: `100px` }}>{x.key}</span>
                                <span style={{}}>{x.value}</span>
                            </span>
                        ))}
                    </p>
                    <div className='post-item-markdown'>
                        <Markdown markdown={body} />
                    </div>
                    <Utterances repo='ricklove/ricklove-blog-comments' />
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
