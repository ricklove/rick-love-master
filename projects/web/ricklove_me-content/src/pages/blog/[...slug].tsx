import React from 'react';
import { PostPage, PostPageData } from './_helpers/post';

export type PageProps = {
  params: { slug: string[] };
  post: PostPageData;
};

export const Page = (props: PageProps) => {
  return <PostPage data={props.post} />;
};
