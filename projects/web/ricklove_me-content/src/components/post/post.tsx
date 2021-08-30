import React, { } from 'react';
import { Layout } from '../layout/layout';
import { SEO } from '../layout/seo';
import { Markdown } from '../markdown/markdown';
import { getNavigation } from '../site';
import { Utterances } from './utterances';

export type PostPageData = {
    headers: { key: string; value: string }[];

    title: string;
    body: string;
    summary: string;
    dateLabel?: string;
    excerpt?: string;
    imageUrl?: string;
    tags: string[];
    relatedPages?: { postSitePath: string; title: string; dateLabel?: string; tags: string[] }[];
};

export const PostPage = (props: { data: PostPageData }) => {
    const { body, headers, title, relatedPages } = props.data;
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

                    <div className='post-item-related'>
                        <h3>Related Articles</h3>
                        <p>
                            <span style={{ display: `flex`, flexDirection: `column` }}>
                                {relatedPages?.map(p => (
                                    <Link key={p.postSitePath} to={p.postSitePath}>
                                        <span className='link' style={{ display: `flex`, flexDirection: `row`, ...(p.title === title ? { color: `#bbbbbb` } : {}) }}>
                                            <span style={{ display: `inline-block`, minWidth: 100 }}>{p.dateLabel}</span>
                                            <span style={{ display: `flex`, flex: 3 }}>{p.title}</span>
                                            <span style={{ display: `flex`, flex: 2, fontSize: 12 }}>{p.tags.join(`, `)}</span>
                                        </span>
                                    </Link>
                                ))}
                            </span>
                        </p>
                    </div>
                    <div className='post-item-comments'>
                        <h3>Comments</h3>
                        <Utterances repo='ricklove/ricklove-blog-comments' />
                    </div>
                </div>
            </div>
            <Link to='/'>
                <div className='link'>
                    <p>Root</p>
                </div>
            </Link>


        </Layout>
    );
};
