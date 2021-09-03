import React from 'react';
import { GamePage, GamePageData } from '../../components/games/games';

export type PageProps = {
  params: { name: string };
  pageData: GamePageData;
};

export const Page = (props: PageProps) => {
  return <GamePage data={props.pageData} />;
};
