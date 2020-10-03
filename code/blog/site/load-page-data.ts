/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-console */
/* eslint-disable unicorn/consistent-function-scoping */
import { processDirectoryFiles, getFileName, readFile, getPathNormalized, getDirectoryPath, copyFile, watchFileChanges, writeFile, deleteFile } from 'utils/files';
import { createSubscribable, Subscribe } from 'utils/subscribable';
import { PageData } from './create-page';
import { componentTestList } from '../pageTemplates/component-tests-list';
import { componentGamesList } from '../pageTemplates/component-games-list';

export type SitePageData<T> = {
    pages: SitePageInfo<T>[];
    subscribePageChange?: Subscribe<SitePageInfo<T>>;
};
export type SitePageInfo<T> = {
    sitePath: string;
    data: T;
};

export const loadStaticPageData = async (): Promise<SitePageData<PageData>> => {
    const sub = createSubscribable<SitePageInfo<PageData>>();

    // Register Pages here (node api available => Load all data that is needed for all pages here)

    console.log(`loadStaticPages START`);
    const startTime = Date.now();

    const handleMediaFiles = async (sourceFilePath: string, text: string, onMediaFile: (sourceFilePath: string, mediaPath: string) => Promise<{ newPath: string }>) => {

        console.log(`handleMediaFiles START`, { text: text.substr(0, 50) });

        // From: https://stackoverflow.com/questions/44227270/regex-to-parse-image-link-in-markdown
        const markdownMediaRegex = /!\[(?<mediaAltText>[^\]]*)]\((?<mediaPath>.*?)(?="|\))(?<mediaTitle>".*")?\)/g;

        const matches = text.matchAll(markdownMediaRegex);
        const replacements = [] as { find: string, replace: string }[];
        for (const m of matches) {
            const mIndex = m.index;
            const mediaPath = m.groups?.mediaPath;
            if (!m || mIndex == null || !mediaPath) { continue; }
            const mText = text.substr(mIndex, m[0].length);

            // eslint-disable-next-line no-await-in-loop
            const { newPath: newMediaPath } = await onMediaFile(sourceFilePath, mediaPath);

            const mFinal = mText.replace(mediaPath, newMediaPath);
            replacements.push({ find: mText, replace: mFinal });
        }

        let text_corrected = text;
        replacements.forEach(x => { text_corrected = text_corrected.replace(x.find, x.replace); });

        // console.log(`handleMediaFiles END`, { replacements });
        return text_corrected;
    };

    const createPageData_fromMarkdownFile = async (filePath: string, kind: 'post' | 'page', onMediaFile: (sourceFilePath: string, mediaPath: string) => Promise<{ newPath: string }>): Promise<SitePageInfo<PageData>> => {

        const filename = getFileName(filePath);
        const content = await readFile(filePath);

        // TODO: Parse Header when Creating Pages (to use path)
        const parts = content.split(`---`);
        const header = parts.slice(1, 1 + 1)[0];
        const headerValues = header?.split(`\n`).map(x => {
            const vParts = x.trim().split(`:`);
            const key = vParts[0];
            const value = vParts.slice(1).join(`:`);
            const valueNoQuotes = value.replace(/^\s*"/g, ``).replace(/"\s*$/g, ``);
            return { key, value: valueNoQuotes };
        }).filter(x => x.key && x.value) ?? [];
        const contentWithoutHeader = headerValues.length > 0 ? parts.slice(2).join(`---`) : content;

        const contentCleaned = await handleMediaFiles(filePath, contentWithoutHeader, onMediaFile);

        const sitePath = `/${headerValues.find(x => x.key === `path`)?.value.replace(/^\//g, ``) ?? filename.replace(/\.md$/, ``)}`;
        const summary = `${contentCleaned.split(`\`\`\``)[0].split(`\n`).slice(0, 16).join(`\n`).trim()}\n\n...`;
        const title = headerValues.find(x => x.key === `title`)?.value ?? sitePath;
        const date = headerValues.find(x => x.key === `date`)?.value;
        const timestamp = date ? new Date(date).getTime() : 0;

        // console.log(`createPageData`, { sitePath });
        const page: SitePageInfo<PageData> = {
            sitePath,
            data: {
                postPage: {
                    sourceFilePath: filePath,
                    sourceFileContent: content,
                    title,
                    headers: headerValues,
                    body: contentCleaned,
                    summary,
                    order: -timestamp,
                },
            },
        };
        return page;
    };

    const pages = [] as SitePageInfo<PageData>[];
    const posts = [] as SitePageInfo<PageData>[];

    const blogContentDir = getPathNormalized(__dirname, `../../blog-content`);
    const webBlogContentPath = `/blog-content`;
    const publicDestDir = getPathNormalized(process.cwd(), `public${webBlogContentPath}`);

    // Copy Files to public (this is just to get media files)
    const onMediaFile = async (sourceFilePath: string, mediaPath: string): Promise<{ newPath: string }> => {
        const sourceFileRelPath = sourceFilePath.replace(blogContentDir, ``);
        const sourceFileRelDir = getDirectoryPath(sourceFileRelPath);
        const oldPathFull = getPathNormalized(blogContentDir, sourceFileRelDir, mediaPath);
        const newPathFull = getPathNormalized(publicDestDir, sourceFileRelDir, mediaPath);

        // Website Path
        const webPath = newPathFull.replace(publicDestDir, webBlogContentPath);
        // console.log(`onMediaFile`, { path: mediaPath, newPath: webPath, sourceFileRelPath, sourceFileRelDir, newPathFull, oldPathFull, blogContentDir, publicDestDir });

        // Copy File
        await copyFile(oldPathFull, newPathFull, { overwrite: true });

        return { newPath: webPath };
    };

    // console.log(`loadStaticPageData blogContentDir`, { blogContentDir });
    // await processDirectoryFiles(`${blogContentDir}`, async x => { if (x.endsWith(`.md`)) { pages.push(await createPageData_fromMarkdownFile(x, `post`)); } });
    await processDirectoryFiles(`${blogContentDir}/posts`, async x => { if (x.endsWith(`.md`)) { posts.push(await createPageData_fromMarkdownFile(x, `post`, onMediaFile)); } });
    await processDirectoryFiles(`${blogContentDir}/pages`, async x => { if (x.endsWith(`.md`)) { pages.push(await createPageData_fromMarkdownFile(x, `page`, onMediaFile)); } });

    // Subscribe to dirs
    await watchFileChanges({ pathRoot: blogContentDir, runOnStart: false }, async (files) => {
        const postFiles = files.filter(x => x.startsWith(`${blogContentDir}/posts`) && x.endsWith(`.md`));
        for (const f of postFiles) {
            console.log(`File Changed: post`, { f });
            // eslint-disable-next-line no-await-in-loop
            sub.onStateChange(await createPageData_fromMarkdownFile(f, `post`, onMediaFile));
        }
        const pageFiles = files.filter(x => x.startsWith(`${blogContentDir}/pages`) && x.endsWith(`.md`));
        for (const f of pageFiles) {
            console.log(`File Changed: page`, { f });
            // eslint-disable-next-line no-await-in-loop
            sub.onStateChange(await createPageData_fromMarkdownFile(f, `page`, onMediaFile));
        }

        // console.log(`File Changed DONE`, { postFiles, pageFiles });
        if (postFiles.length <= 0 && pageFiles.length <= 0) { return; }

        // Trigger gatsby watch to rebuild (with a file change)
        setTimeout(async () => {
            const filename = getPathNormalized(__dirname, `./_rebuild-trigger.ts`);
            console.log(`Writing to Rebuild Trigger`, { filename });
            await writeFile(filename, `export const __trigger = ${Date.now()};\n`, { overwrite: true });
        }, 100);
    });

    posts.sort((a, b) => (a.data.postPage?.order ?? 0) - (b.data.postPage?.order ?? 0));
    pages.unshift(...posts);

    pages.push({
        sitePath: `/`,
        data: {
            postIndexPage: {
                posts: pages.map(x => ({
                    sitePath: x.sitePath,
                    title: x.data.postPage?.title ?? ``,
                    summary: x.data.postPage?.summary ?? ``,
                })),
            },
        },
    });


    pages.push({
        sitePath: `/games`,
        data: {
            componentGamesPage: { showList: true },
        },
    });

    componentGamesList.forEach(x => {
        pages.push({
            sitePath: `/games/${x.name}`,
            data: {
                componentGamesPage: { gameName: x.name },
            },
        });
    });

    // pages.push({
    //     sitePath: `/tests/stripe`,
    //     data: {
    //         componentTestsPage: { testName: `stripe` },
    //     },
    // });

    componentTestList.forEach(x => {
        pages.push({
            sitePath: `/tests/${x.name}`,
            data: {
                componentTestsPage: { testName: x.name },
            },
        });
    });

    pages.push({
        sitePath: `/404.html`,
        data: {
            notFoundPage: {},
        },
    });

    console.log(`loadStaticPages END`, { time: `${(Date.now() - startTime) / 1000} secs`, pages });
    return {
        pages,
        subscribePageChange: sub.subscribe,
    };
};
