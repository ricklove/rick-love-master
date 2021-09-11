import React from 'react';
import { Layout } from '../components/layout/layout';
import { Markdown } from '../components/markdown/markdown';
import { getNavigation } from '../components/site';
import { PostCss } from './blog/_helpers/post-css';

export type PageProps = {};
export const Page = (_props: PageProps) => {
  const Link = getNavigation().StaticPageLinkComponent;

  const title = `404 - Not Found`;
  const content = `

## Mamma always said...

Life is like a random website url... You never know what you are going to get.

## Some other stuff

- [Cool Stuff](/blog/cool-stuff)

`;

  return (
    <Layout>
      <PostCss />
      <div className='post-item-container'>
        <div key={title} className='post-item'>
          <div>
            <h2 className='post-item-title'>{title}</h2>
            <div>
              <Markdown markdown={content} />
            </div>
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
