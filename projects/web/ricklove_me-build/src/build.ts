import fsRaw from 'fs';
import path from 'path';
const fs = fsRaw.promises;

export const createPages = async () => {
  const pageFiles = await fs.readdir(path.resolve(__dirname, `../../ricklove_me-content/src/pages`));

  // await fs.rm(`../pages`, { recursive: true });
  // await fs.mkdir(`../pages`, { recursive: true });

  for (const f of pageFiles) {
    const pageName = path.parse(f).name;
    const destPath = path.resolve(__dirname, `../../ricklove_me/pages`, f);
    const content = `
import { page_${pageName} } from '@ricklove/ricklove_me-content';
const { Page, getStaticProps, getStaticPaths } = page_${pageName};
export { getStaticProps, getStaticPaths };
export default Page;
`.trim();

    console.log(`createPages - create page`, { pageName, destPath });

    // await fs.writeFile(destPath, content);
  }
};

void createPages();
