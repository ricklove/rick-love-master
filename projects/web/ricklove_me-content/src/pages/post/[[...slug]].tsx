import React from 'react';
import { PostPage, PostPageData } from '../../components/post/post';
import { PostIndexPage, PostIndexPageData } from '../../components/post/post-index';

export type PageProps_Index = {
  posts: PostIndexPageData['posts'];

  params: { slug?: undefined };
  post?: undefined;
};
export type PageProps_Page = {
  posts?: undefined;

  params: { slug: string[] };
  post: PostPageData;
};

export type PageProps = PageProps_Index | PageProps_Page;

export const Page = (props: PageProps) => {

  if (!props.post){
    return <PostIndexPage data={{
        posts: props.posts ?? [],
    }}/>;
  }

  return <PostPage data={props.post}/>;
};
