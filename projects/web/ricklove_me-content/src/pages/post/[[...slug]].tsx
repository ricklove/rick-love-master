import React from 'react';
import { PostPage, PostPageData } from '../../components/post/post';
import { PostIndexPage, PostIndexPageData } from '../../components/post/post-index';

type PageProps_Index = {
  posts: PostIndexPageData['posts'];

  params: { slug?: undefined };
  post?: undefined;
};
type PageProps_Page = {
  posts: undefined;

  params: { slug: string[] };
  post: PostPageData;
};

export type PageProps = PageProps_Index | PageProps_Page;

export const Page = (props: PageProps) => {

  if (!props.post){
    return <PostIndexPage data={{
        posts: props.posts?.map(x => ({ ...x, sitePath: `/post/${x.sitePath}` })) ?? [],
    }}/>;
  }

  return <PostPage data={props.post}/>;
};
