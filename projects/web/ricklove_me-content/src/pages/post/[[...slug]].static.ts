import fsRaw from 'fs';
import { promises as fs } from 'fs';
import path from 'path';
import { getAllFiles, getPathNormalized } from '@ricklove/utils-files';
import { createPage } from '../../types';
import { PageProps } from './[[...slug]]';

const getWebDirPath = () => process.cwd();
const getBlogContentPath = () => path.join(getWebDirPath(), `../../../_old/code/blog-content`);
const getPostsPath = () => path.join(getBlogContentPath(), `./posts`);
const getCachePath = () => path.join(getWebDirPath(), `./cache/markdownCache.json`);
const getPublicPath = () => path.join(getWebDirPath(), `./public`);

const calculateWebPath = (sourceFilePath: string, mediaPath: string) => {
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

type MarkdownFileInfo = {
  filePath: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
};

const getMarkdownFileInfosCached = async (): Promise<MarkdownFileInfo[]> => {
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
    return JSON.parse(cacheContent) as MarkdownFileInfo[];
  }

  console.log(`getMarkdownFileInfosCached - content changed`, { cacheChangeTimeMs });

  const infosAll = await Promise.all(
    markdownFilePaths.map(async (f) => {
      const content = await fs.readFile(f, { encoding: `utf-8` });
      return await parseMarkdownFile(f, content);
    }),
  );

  const infos = infosAll.filter((x) => x).map((x) => x!);

  // Save cache file
  await fs.mkdir(path.dirname(getCachePath()), { recursive: true });
  await fs.writeFile(getCachePath(), JSON.stringify(infos));

  return infos;
};

const parseMarkdownFile = async (filePath: string, content: string) => {
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
    const { webPath, oldPathFull, newPathFull } = calculateWebPath(sourceFilePath, mediaPath);
    await fs.copyFile(oldPathFull, newPathFull);
    return { newPath: webPath };
  });

  const excerpt = headerValues.find((x) => x.key === `excerpt`)?.value;
  const imageUrlRaw = headerValues.find((x) => x.key === `image`)?.value;
  const imageUrl = !imageUrlRaw ? undefined : calculateWebPath(filePath, imageUrlRaw).webPath;

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
    slug: sitePath.replace(/^\//, ``),
    contentRaw: content,
    content: contentCleaned,
    summary,
    title,
    timestamp,
    tags,
    excerpt,
    imageUrl,
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

export const page = createPage<PageProps>({
  getStaticPaths: async () => {
    const files = await getMarkdownFileInfosCached();

    return {
      fallback: false,
      paths: [...files.map((x) => ({ params: { slug: [x.slug] } })), { params: { slug: undefined } }],
    };
  },
  getStaticProps: async ({ params }) => {
    const { slug } = params;

    if (!slug) {
      const files = await getMarkdownFileInfosCached();

      return {
        props: {
          params,
          posts: files.map((x) => ({
            slug: x.slug,
            title: x.title,
            summary: x.summary,
          })),
        },
      };
    }

    const files = await getMarkdownFileInfosCached();
    const file = files.find((f) => f.slug === slug[0]);
    if (!file) {
      throw new Error(`Markdown File not found for slug: ${slug[0]}`);
    }

    return {
      props: {
        params,
        post: {
          slug: file.slug,
          title: file.title,
          summary: file.summary,
          content: file.content,
        },
      },
    };
  },
});
