import './post.css';
import React from 'react';
import { Markdown } from '../components/markdown/markdown';
import { SEO } from './layout/seo';
import { Layout } from './layout/layout';
import { getNavigation } from '../site/store';

export type PostIndexPageData = {
    posts: { sitePath: string, title: string, summary: string }[];
}

export const PostIndexPage = (props: { data: PostIndexPageData }) => {
    const { posts } = props.data;
    const Link = getNavigation().StaticPageLinkComponent;

    return (
        <Layout>
            <SEO title='Posts' />
            <div className='post-item-container' >
                <>
                    {posts.map(x => (
                        <div key={x.title} className='post-item'>
                            <Link to={x.sitePath}>
                                <h2 className='post-item-title'>{x.title}</h2>
                                {/* </Link> */}
                                <div>
                                    <Markdown markdown={x.summary} />
                                </div>
                                {/* <Link to={x.sitePath}> */}
                                <div>
                                    <p>
                                        Read More...
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </>
            </div>
        </Layout>
    );
};
