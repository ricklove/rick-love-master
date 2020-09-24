import './post.css';
import React from 'react';
import { Markdown } from '../components/markdown/markdown';
import { SEO } from './layout/seo';
import { Layout } from './layout/layout';
import { getNavigation } from '../site/store';

export type PostIndexPageData = {
    posts: { sitePath: string, title: string, summary: string, date: string }[];
}

export const PostIndexPage = (props: { data: PostIndexPageData }) => {
    const { posts } = props.data;
    const Link = getNavigation().StaticPageLinkComponent;

    posts.sort((a, b) => -a.date.localeCompare(b.date));

    return (
        <Layout>
            <SEO title='Posts' />
            <div style={{ display: `block`, minWidth: `100%` }}>
                <div>
                    {posts.map(x => (
                        <div key={x.title} className='post-item'>
                            <div>
                                <p>
                                    <Link to={x.sitePath}>{x.title}</Link>
                                </p>
                            </div>
                            <div>
                                <Markdown markdown={x.summary} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};
