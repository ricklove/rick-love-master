import fsRaw from 'fs';
import path from 'path';
import { joinPathNormalized } from '@ricklove/utils-files';
const fs = fsRaw.promises;

export const createNextJsWebPages = async (
  destPath: string,
  pageFiles: {
    pageName: string;
    relativePath: string;
    absolutePath: string;
  }[],
) => {
  await fs.rmdir(destPath, { recursive: true });

  for (const { pageName, relativePath } of pageFiles) {
    const destFilePath = joinPathNormalized(destPath, relativePath) + `.tsx`;
    await fs.mkdir(path.dirname(destFilePath), { recursive: true });

    const hasStaticPaths = relativePath.includes(`[`);

    const content = `
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Page_${pageName} } from '@ricklove/ricklove_me-content';
export default Page_${pageName};

import { page_${pageName} } from '@ricklove/ricklove_me-content/lib/index-static';

export const getStaticProps = async (context: any) => {
    return await page_${pageName}.getStaticProps(context);
};
${
  hasStaticPaths
    ? `
export const getStaticPaths = async () => {
    return await page_${pageName}.getStaticPaths();
};
`
    : ``
}
`.trimStart();

    const oldFileContent = fsRaw.existsSync(destFilePath)
      ? await fs.readFile(destFilePath, { encoding: `utf-8` })
      : null;
    if (oldFileContent === content) {
      return;
    }

    console.log(`createWebPages - create page`, { pageName, destFilePath });
    await fs.writeFile(destFilePath, content);
  }
};

/** Setup NextJs dependencies to be used
 *
 * 1. setupNavigation for nextjs using Link component
 */
export const createNextJsAppJs = async (destPath: string) => {
  await fs.writeFile(
    joinPathNormalized(destPath, `_app.tsx`),
    `
import Link from 'next/link';
import React from 'react';
import { setupNavigation } from '@ricklove/ricklove_me-content/lib/src/components/site';

setupNavigation({
  StaticPageLinkComponent: ({ children, to }) => <Link href={to}>{children}</Link>,
});

const CustomApp = ({ Component, pageProps }: { Component: (props: unknown) => JSX.Element; pageProps: unknown }) => {
  return <Component {...pageProps} />;
};

export default CustomApp;
`.trimStart(),
  );
};
