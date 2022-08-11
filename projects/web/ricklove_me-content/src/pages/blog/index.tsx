import React from 'react';
import { PostIndexPage, PostIndexPageData } from './_helpers/post-index';

export type PageProps = {
  posts: PostIndexPageData['posts'];
};

export const Page = (props: PageProps) => {
  return (
    <PostIndexPage
      data={{
        posts: props.posts,
      }}
    />
  );
};