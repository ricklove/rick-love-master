import React from 'react';
import { ArtworkPage, ArtworkPageData } from './_helpers/art';

export type PageProps = {
  params: { name: string };
  pageData: ArtworkPageData;
};

export const Page = (props: PageProps) => {
  return <ArtworkPage data={props.pageData} />;
};
