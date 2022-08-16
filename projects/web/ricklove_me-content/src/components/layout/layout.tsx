import React, { ReactNode } from 'react';
import { siteMetadata } from '../site';
import { Header } from './header';
import { LayoutCodeCss } from './layout-code-css';
import { LayoutCss } from './layout-css';
import { LayoutGame } from './layout-game';

export const Layout = ({ children, gameMode }: { children: ReactNode; gameMode?: boolean; zoom?: boolean }) => {
  const data = {
    title: siteMetadata.title,
    author: siteMetadata.author,
  };

  if (gameMode) {
    return (
      <>
        <LayoutCss />
        <LayoutCodeCss />
        <LayoutGame>{children}</LayoutGame>
      </>
    );
  }

  return (
    <>
      <LayoutCss />
      <LayoutCodeCss />
      {!gameMode && <Header siteTitle={`${data.title ?? ``}`} />}
      <div>
        <main>{children}</main>
        <footer>{`© ${new Date().getFullYear()} ${data.author ?? ``}`}</footer>
      </div>
    </>
  );
};
