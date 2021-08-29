import fsRaw from 'fs';
import path from 'path';
const fs = fsRaw.promises;

const sourcePath = path.resolve(__dirname, `../../ricklove_me-content/src/pages`);
const destPath = path.resolve(__dirname, `../../ricklove_me/pages`);

export const createPages = async () => {
  const pageFiles = await fs.readdir(sourcePath);

  await fs.rmdir(destPath, { recursive: true });
  await fs.mkdir(destPath, { recursive: true });

  for (const f of pageFiles) {
    const pageName = path.parse(f).name;
    const destFilePath = path.resolve(destPath, f);
    const content = `
import { page_${pageName} } from '@ricklove/ricklove_me-content';
const { Page, getStaticProps, getStaticPaths } = page_${pageName};
export { getStaticProps, getStaticPaths };
export default Page;
`.trim();

    const oldFileContent = fsRaw.existsSync(destFilePath)
      ? await fs.readFile(destFilePath, { encoding: `utf-8` })
      : null;
    if (oldFileContent === content) {
      return;
    }

    console.log(`createPages - create page`, { pageName, destFilePath });
    await fs.writeFile(destFilePath, content);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
createPages();
