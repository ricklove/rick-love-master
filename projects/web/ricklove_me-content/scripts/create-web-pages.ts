import fsRaw from 'fs';
import path from 'path';
const fs = fsRaw.promises;

export const createWebPages = async (
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
