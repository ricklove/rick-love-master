import { promises as fs } from 'fs';
import path from 'path';
import React from 'react';
import { getAllFiles } from '../../../../../../features/_utils/files/lib';
import { createPage } from '../../types';

const Page = (props: { slug: string; markdownContent: string }) => {
  return (
    <>
      <div style={{ whiteSpace: `pre` }}>{props.slug}</div>
      <div style={{ whiteSpace: `pre` }}>{props.markdownContent}</div>
    </>
  );
};


const getSourcePath = () => path.join(process.cwd(), `../../../_old/code/blog-content/posts`);
const getCacheSourcePath = () => path.join(process.cwd(), `./cache/markdownCache.json`);

type MarkdownFileInfo = { slug: string; filePath: string };
const getMarkdownFileInfosCached = async (): Promise<MarkdownFileInfo[]> => {
  console.log(`getMarkdownFileInfosCached`);

  const allFiles = await getAllFiles(getSourcePath());
  const markdownFilePaths = allFiles.filter(x => x.endsWith(`.md`));
  const fileChangeTimesMs = await Promise.all(markdownFilePaths.map(async (f) => {
    const fStat = await fs.stat(f);
    return fStat.ctimeMs;
  }));
  const cacheChangeTimeMs = (await fs.stat(getCacheSourcePath()).catch(() => ({ ctimeMs: 0 }))).ctimeMs;
  if (fileChangeTimesMs.every(t => cacheChangeTimeMs > t)){
    // Use cache file if newer
    const cacheContent = await fs.readFile(getCacheSourcePath(), { encoding: `utf-8` });
    return JSON.parse(cacheContent) as MarkdownFileInfo[];
  }

  const infosAll = await Promise.all(markdownFilePaths.map(async (f) => {

    const content = await fs.readFile(f, { encoding: `utf-8` });
    const pathLine = content.match(/\npath:\s*"([^"]+)"/);
    if (!pathLine){ return; }
    const slug = pathLine[1];
    if (!slug){ return; }

    return {
      slug,
      filePath: f,
    };
  }));

  const infos = infosAll.filter(x => x).map(x => x!);

  // Save cache file
  await fs.writeFile(getCacheSourcePath(), JSON.stringify(infos));

  return infos;
};

export const page = createPage({
  Page,
  getStaticPaths: async () => {
    const files = await getMarkdownFileInfosCached();

    return {
      fallback: false,
      paths: files.map(x => ({ params: { slug: x.slug } })),
    };
  },
  getStaticProps: async ({ params }) => {
    const files = await getMarkdownFileInfosCached();
    const file = files.find(f => f.slug === params.slug);
    if (!file){
      throw new Error(`Markdown File not found for slug: ${params.slug}`);
    }

    const content = await fs.readFile(file.filePath, { encoding: `utf-8` });

    return {
      props: {
        slug: file.slug,
        markdownContent: content,
      },
    };
  },
});
