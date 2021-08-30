import fsRaw from 'fs';
import path from 'path';
import { getAllFiles } from '@ricklove/utils-files';
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
    const destFilePath = path.join(destPath, relativePath) + `.tsx`;
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

export const createNextJsAppJs = async (destPath: string, sourcePath: string) => {
  const allFiles = await getAllFiles(sourcePath);
  const globalCssFiles = allFiles.filter((x) => x.endsWith(`.css`) && !x.endsWith(`.module.css`));
  const cssContent = await Promise.all(
    globalCssFiles.map(async (fileSourcePath) => {
      return await fs.readFile(fileSourcePath, { encoding: `utf-8` });
    }),
  );

  const allCss = cssContent.join(`\n\n\n`);
  await fs.writeFile(path.join(destPath, `_app.css`), allCss);
  await fs.writeFile(
    path.join(destPath, `_app.js`),
    `
import './_app.css';
import Link from 'next/link'
import { setupNavigation } from '@ricklove/ricklove_me-content/lib/src/components/site';

setupNavigation({
  StaticPageLinkComponent: ({children, to}) => <Link href={to}>{children}</Link>,
});

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
`.trimStart(),
  );
};
