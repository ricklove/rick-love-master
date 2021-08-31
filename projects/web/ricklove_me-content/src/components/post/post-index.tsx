import React from 'react';
import { Layout } from '../layout/layout';
import { SEO } from '../layout/seo';
import { Markdown } from '../markdown/markdown';
import { getNavigation } from '../site';
import { PostCss } from './post-css';

export type PostIndexPageData = {
  posts: { sitePath: string; title: string; summary: string }[];
};

export const PostIndexPage = (props: { data: PostIndexPageData }) => {
  const { posts } = props.data;
  const Link = getNavigation().StaticPageLinkComponent;

  return (
    <Layout>
      <PostCss />
      <SEO title='Posts' />
      <div className='post-item-container'>
        <>
          {posts.map((x) => (
            <div key={x.title} className='post-item'>
              <div>
                <Link to={x.sitePath}>
                  <h2 className='link post-item-title'>{x.title}</h2>
                </Link>
                <div>
                  <Markdown markdown={x.summary} />
                </div>
                <Link to={x.sitePath}>
                  <div className='link'>
                    <p>Read More...</p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </>
      </div>
    </Layout>
  );
};
