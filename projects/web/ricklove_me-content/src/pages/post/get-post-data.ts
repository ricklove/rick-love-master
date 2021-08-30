import fsRaw from 'fs';
import { promises as fs } from 'fs';
import path from 'path';
import { getAllFiles, getPathNormalized } from '@ricklove/utils-files';
import { PostPageData } from '../../components/post/post';

const getWebProjectPath = () => process.cwd();
const getBlogContentPath = () => path.join(getWebProjectPath(), `../../../_old/code/blog-content`);
const getPostsPath = () => path.join(getBlogContentPath(), `./posts`);
const getCachePath = () => path.join(getWebProjectPath(), `./cache/markdownCache.json`);
const getPublicPath = () => path.join(getWebProjectPath(), `./public`);
export const getPostSitePath = (slug: string[]) => `/post/${slug.join(`/`)}`;

const calculateBlogContentSitePath = (sourceFilePath: string, mediaPath: string) => {
  const blogContentSourceDir = getBlogContentPath();
  const publicBlogContentRelativePath = `/blog-content`;
  const blogContentDestDir = getPathNormalized(getPublicPath(), publicBlogContentRelativePath);

  const sourceFileRelPath = sourceFilePath.replace(blogContentSourceDir, ``);
  const sourceFileRelDir = path.dirname(sourceFileRelPath);
  const oldPathFull = getPathNormalized(blogContentSourceDir, sourceFileRelDir, mediaPath);
  const newPathFull = getPathNormalized(blogContentDestDir, sourceFileRelDir, mediaPath);

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
  const allFiles = await getAllFiles(getPostsPath());
  const markdownFilePaths = allFiles.filter((x) => x.endsWith(`.md`));
  const fileChangeTimesMs = await Promise.all(
    markdownFilePaths.map(async (f) => {
      const fStat = await fs.stat(f);
      return fStat.ctimeMs;
    }),
  );
  const cacheChangeTimeMs = fsRaw.existsSync(getCachePath())
    ? (await fs.stat(getCachePath()).catch(() => ({ ctimeMs: 0 }))).ctimeMs
    : 0;

  if (fileChangeTimesMs.every((t) => cacheChangeTimeMs > t)) {
    // Use cache file if newer
    console.log(`getMarkdownFileInfosCached - using cache`, { cacheChangeTimeMs });

    const cacheContent = await fs.readFile(getCachePath(), { encoding: `utf-8` });
    return JSON.parse(cacheContent) as PostData[];
  }

  console.log(`getMarkdownFileInfosCached - content changed`, { cacheChangeTimeMs });

  const infosAll = await Promise.all(
    markdownFilePaths.map(async (f) => {
      const content = await fs.readFile(f, { encoding: `utf-8` });
      return await parseMarkdownFile(f, content);
    }),
  );

  const infos = infosAll.filter((x) => x).map((x) => x!);

  // Sort by timestamp desc
  infos.sort((a, b) => -(a.timestamp - b.timestamp));

  // // TODO: Add related posts
  // const tagPostPairs = pagePosts.flatMap(x => x.data.postPage.tags.map(t => ({ item: x, postSitePath: x.sitePath, title: x.data.postPage.title, tag: t, dateLabel: x.data.postPage.dateLabel, order: x.data.postPage.order })));
  // const tagPostSitePaths = groupItems(tagPostPairs, x => x.tag);
  // pagePosts.forEach(x => {
  //     const r = x.data.postPage.tags.flatMap(t => tagPostSitePaths[t]);
  //     const r2 = distinct_key(r, y => y.postSitePath);
  //     x.data.postPage.relatedPages = r2.map(p => ({
  //         postSitePath: p.postSitePath,
  //         title: p.title,
  //         tags: p.item.data.postPage.tags.filter(t => x.data.postPage.tags.includes(t)),
  //         dateLabel: p.dateLabel,
  //         order: p.order,
  //     })).sort((a, b) => a.order - b.order);
  // });

  // Save cache file
  await fs.mkdir(path.dirname(getCachePath()), { recursive: true });
  await fs.writeFile(getCachePath(), JSON.stringify(infos));

  return infos;
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
    const { webPath, oldPathFull, newPathFull } = calculateBlogContentSitePath(sourceFilePath, mediaPath);
    await fs.mkdir(path.dirname(newPathFull), { recursive: true });
    await fs.copyFile(oldPathFull, newPathFull);
    return { newPath: webPath };
  });

  const excerpt = headerValues.find((x) => x.key === `excerpt`)?.value;
  const imageUrlRaw = headerValues.find((x) => x.key === `image`)?.value;
  const imageUrl = !imageUrlRaw ? undefined : calculateBlogContentSitePath(filePath, imageUrlRaw).webPath;

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
