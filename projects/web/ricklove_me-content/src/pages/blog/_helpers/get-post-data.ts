import fsRaw from 'fs';
import { promises as fs } from 'fs';
import path from 'path';
import { groupItems } from '@ricklove/utils-core';
import { getAllFiles, joinPathNormalized } from '@ricklove/utils-files';
import { getMonoRepoRoot, getWebProjectPath } from '../../../components/paths';
import { PostPageData } from './post';

const getPaths = async () => {
  const monoRepoRoot = await getMonoRepoRoot();

  const blogContentPath = joinPathNormalized(monoRepoRoot, `./_old/code/blog-content`);
  const postsPath = joinPathNormalized(blogContentPath, `./posts`);
  const postsIgnorePath = joinPathNormalized(blogContentPath, `./posts/future`);
  const cachePath = joinPathNormalized(await getWebProjectPath(), `./cache/markdownCache.json`);
  const publicPath = joinPathNormalized(await getWebProjectPath(), `./public`);
  const publicBlogContentRelativePath = `/_media/blog-content`;

  return {
    blogContentPath,
    postsPath,
    postsIgnorePath,
    cachePath,
    publicPath,
    publicBlogContentRelativePath,
  };
};

export const getPostSitePath = (slug: string[]) => `/blog/${slug.join(`/`)}`;

const calculateBlogContentSitePath = async (sourceFilePath: string, mediaPath: string) => {
  const { blogContentPath, publicPath, publicBlogContentRelativePath } = await getPaths();

  const blogContentSourceDir = joinPathNormalized(blogContentPath);
  const blogContentDestDir = joinPathNormalized(publicPath, publicBlogContentRelativePath);

  const sourceFileRelPath = joinPathNormalized(sourceFilePath).replace(blogContentSourceDir, ``);
  const sourceFileRelDir = path.dirname(sourceFileRelPath);
  const oldPathFull = joinPathNormalized(blogContentSourceDir, sourceFileRelDir, mediaPath);
  const newPathFull = joinPathNormalized(blogContentDestDir, sourceFileRelDir, mediaPath);

  // Website Path
  const webPath = newPathFull.replace(blogContentDestDir, publicBlogContentRelativePath);

  return { webPath, oldPathFull, newPathFull };
};

type PostData = {
  filePath: string;
  slug: string[];
  timestamp: number;
  postPage: PostPageData;
};

export const getPostDataCached = async (): Promise<PostData[]> => {
  const { postsPath, postsIgnorePath, cachePath } = await getPaths();

  const allFiles = await getAllFiles(postsPath);
  const ignorePostsPath = joinPathNormalized(postsIgnorePath);
  const markdownFilePaths = allFiles
    .filter((x) => x.endsWith(`.md`))
    .map((x) => joinPathNormalized(x))
    .filter((x) => !x.startsWith(ignorePostsPath));

  const fileChangeTimesMs = await Promise.all(
    markdownFilePaths.map(async (f) => {
      const fStat = await fs.stat(f);
      return fStat.ctimeMs;
    }),
  );
  const cacheChangeTimeMs = fsRaw.existsSync(cachePath)
    ? (await fs.stat(cachePath).catch(() => ({ ctimeMs: 0 }))).ctimeMs
    : 0;

  if (fileChangeTimesMs.every((t) => cacheChangeTimeMs > t)) {
    // Use cache file if newer
    console.log(`getMarkdownFileInfosCached - using cache`, { cacheChangeTimeMs });

    const cacheContent = await fs.readFile(cachePath, { encoding: `utf-8` });
    return JSON.parse(cacheContent) as PostData[];
  }

  console.log(`getMarkdownFileInfosCached - content changed`, { cacheChangeTimeMs });

  const itemsAll = await Promise.all(
    markdownFilePaths.map(async (f) => {
      const content = await fs.readFile(f, { encoding: `utf-8` });
      return await parseMarkdownFile(f, content);
    }),
  );

  const items = itemsAll.filter((x) => x).map((x) => x!);

  // Sort by timestamp desc
  items.sort((a, b) => -(a.timestamp - b.timestamp));

  // Add related posts
  const tagPostPairs = items.flatMap((x) =>
    x.postPage.tags.map((t) => ({
      item: x,
      postSitePath: getPostSitePath(x.slug),
      title: x.postPage.title,
      tag: t,
      dateLabel: x.postPage.dateLabel,
      timestamp: x.timestamp,
    })),
  );
  const tagPostSitePaths = groupItems(tagPostPairs, (x) => x.tag);
  items.forEach((x) => {
    const r = x.postPage.tags.flatMap((t) => tagPostSitePaths[t]);
    const r2 = new Map(r.map((y) => [y.postSitePath, y]));
    x.postPage.relatedPages = [...r2.values()]
      .map((p) => ({
        postSitePath: p.postSitePath,
        title: p.title,
        tags: p.item.postPage.tags.filter((t) => x.postPage.tags.includes(t)),
        dateLabel: p.dateLabel,
        timestamp: p.timestamp,
      }))
      .sort((a, b) => -(a.timestamp - b.timestamp));
  });

  // Save cache file
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, JSON.stringify(items));

  return items;
};

const parseMarkdownFile = async (filePath: string, content: string): Promise<PostData> => {
  const parts = content.split(`---`);
  const header = parts.slice(1, 1 + 1)[0];
  const headerValues =
    header
      ?.split(`\n`)
      .map((x) => {
        const vParts = x.trim().split(`:`);
        const key = vParts[0];
        const value = vParts.slice(1).join(`:`);
        const valueNoQuotes = value.replace(/^\s*"/g, ``).replace(/"\s*$/g, ``).trim();
        return { key, value: valueNoQuotes };
      })
      .filter((x) => x.key && x.value) ?? [];
  const contentWithoutHeader = headerValues.length > 0 ? parts.slice(2).join(`---`) : content;

  // Copy media files to public
  const contentCleaned = await handleMediaFiles(filePath, contentWithoutHeader, async (sourceFilePath, mediaPath) => {
    const { webPath, oldPathFull, newPathFull } = await calculateBlogContentSitePath(sourceFilePath, mediaPath);
    await fs.mkdir(path.dirname(newPathFull), { recursive: true });
    await fs.copyFile(oldPathFull, newPathFull);
    return { newPath: webPath };
  });

  const excerpt = headerValues.find((x) => x.key === `excerpt`)?.value;
  const imageUrlRaw = headerValues.find((x) => x.key === `image`)?.value;
  const imageUrl = !imageUrlRaw ? undefined : (await calculateBlogContentSitePath(filePath, imageUrlRaw)).webPath;

  const sitePath = `/${
    headerValues.find((x) => x.key === `path`)?.value.replace(/^\//g, ``) ??
    path.basename(filePath).replace(/\.md$/, ``)
  }`;
  const summary = `${contentCleaned.split(`\`\`\``)[0].split(`\n`).slice(0, 16).join(`\n`).trim()}\n\n...`;
  const title = headerValues.find((x) => x.key === `title`)?.value ?? sitePath;
  const date = headerValues.find((x) => x.key === `date`)?.value;
  const timestamp = date ? new Date(date).getTime() : 0;
  const tags =
    headerValues
      .find((x) => x.key === `tags`)
      ?.value.split(`,`)
      .map((x) => x.trim())
      .filter((x) => x) ?? [];

  return {
    filePath,
    slug: sitePath.replace(/^\//, ``).split(`/`),
    timestamp,
    postPage: {
      title,
      headers: headerValues,
      body: contentCleaned,
      summary,
      excerpt,
      imageUrl,
      tags,
      dateLabel: date,
    },
  };
};

const handleMediaFiles = async (
  sourceFilePath: string,
  text: string,
  onMediaFile: (sourceFilePath: string, mediaPath: string) => Promise<{ newPath: string }>,
) => {
  console.log(`handleMediaFiles START`, { text: text.substr(0, 50) });

  // From: https://stackoverflow.com/questions/44227270/regex-to-parse-image-link-in-markdown
  const markdownMediaRegex = /!\[(?<mediaAltText>[^\]]*)]\((?<mediaPath>.*?)(?="|\))(?<mediaTitle>".*")?\)/g;

  const matches = text.matchAll(markdownMediaRegex);
  const replacements = [] as { find: string; replace: string }[];
  for (const m of matches) {
    const mIndex = m.index;
    const mediaPath = m.groups?.mediaPath;
    if (!m || mIndex == null || !mediaPath) {
      continue;
    }
    const mText = text.substr(mIndex, m[0].length);

    // eslint-disable-next-line no-await-in-loop
    const { newPath: newMediaPath } = await onMediaFile(sourceFilePath, mediaPath);

    const mFinal = mText.replace(mediaPath, newMediaPath);
    replacements.push({ find: mText, replace: mFinal });
  }

  let textCorrected = text;
  replacements.forEach((x) => {
    textCorrected = textCorrected.replace(x.find, x.replace);
  });

  // console.log(`handleMediaFiles END`, { replacements });
  return textCorrected;
};
