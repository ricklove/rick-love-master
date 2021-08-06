/* eslint-disable no-console */
import { processDirectoryFiles, getFileName, readFile, getPathNormalized, getDirectoryPath, copyFile, watchFileChanges, writeFile, deleteFile, copyDirectory } from 'utils/files';
import { createSubscribable, Subscribe } from 'utils/subscribable';
import { createLessonApiServer_localFileServer } from 'code-training/lesson-server/server/lesson-api-local-file-server';
import { distinct_key, groupItems } from 'utils/arrays';
import { PageData } from './create-page';
import { componentTestList } from '../pageTemplates/component-tests-list';
import { componentGamesList } from '../pageTemplates/component-games-list';
import { artIndex } from 'art/art-index';
// import { artItems } from 'art/art-items';

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

    type PostPage = SitePageInfo<Required<{ postPage: NonNullable<PageData['postPage']> }>>;
    const createPageData_fromMarkdownFile = async (filePath: string, kind: 'post' | 'page', onMediaFile: (sourceFilePath: string, mediaPath: string) => Promise<{ newPath: string }>): Promise<PostPage> => {

        const filename = getFileName(filePath);
        const content = await readFile(filePath);

        // TODO: Parse Header when Creating Pages (to use path)
        const parts = content.split(`---`);
        const header = parts.slice(1, 1 + 1)[0];
        const headerValues = header?.split(`\n`).map(x => {
            const vParts = x.trim().split(`:`);
            const key = vParts[0];
            const value = vParts.slice(1).join(`:`);
            const valueNoQuotes = value.replace(/^\s*"/g, ``).replace(/"\s*$/g, ``).trim();
            return { key, value: valueNoQuotes };
        }).filter(x => x.key && x.value) ?? [];
        const contentWithoutHeader = headerValues.length > 0 ? parts.slice(2).join(`---`) : content;

        const contentCleaned = await handleMediaFiles(filePath, contentWithoutHeader, onMediaFile);

        const excerpt = headerValues.find(x => x.key === `excerpt`)?.value;
        const imageUrlRaw = headerValues.find(x => x.key === `image`)?.value;
        const imageUrl = !imageUrlRaw ? undefined : calculateWebPath(filePath, imageUrlRaw).webPath;

        const sitePath = `/${headerValues.find(x => x.key === `path`)?.value.replace(/^\//g, ``) ?? filename.replace(/\.md$/, ``)}`;
        const summary = `${contentCleaned.split(`\`\`\``)[0].split(`\n`).slice(0, 16).join(`\n`).trim()}\n\n...`;
        const title = headerValues.find(x => x.key === `title`)?.value ?? sitePath;
        const date = headerValues.find(x => x.key === `date`)?.value;
        const timestamp = date ? new Date(date).getTime() : 0;
        const tags = headerValues.find(x => x.key === `tags`)?.value.split(`,`).map(x => x.trim()).filter(x => x) ?? [];

        // console.log(`createPageData`, { sitePath });
        const page: PostPage = {
            sitePath,
            data: {
                postPage: {
                    sourceFilePath: filePath,
                    sourceFileContent: content,
                    title,
                    headers: headerValues,
                    body: contentCleaned,
                    summary,
                    excerpt,
                    imageUrl,
                    tags,
                    order: -timestamp,
                    dateLabel: date,
                },
            },
        };
        return page;
    };

    const pagePosts = [] as PostPage[];
    const posts = [] as PostPage[];

    const blogContentDir = getPathNormalized(__dirname, `../../blog-content`);
    const webBlogContentPath = `/blog-content`;
    const webBlogPublicDestDir = getPathNormalized(process.cwd(), `public${webBlogContentPath}`);

    const calculateWebPath = (sourceFilePath: string, mediaPath: string) => {
        const sourceFileRelPath = sourceFilePath.replace(blogContentDir, ``);
        const sourceFileRelDir = getDirectoryPath(sourceFileRelPath);
        const oldPathFull = getPathNormalized(blogContentDir, sourceFileRelDir, mediaPath);
        const newPathFull = getPathNormalized(webBlogPublicDestDir, sourceFileRelDir, mediaPath);

        // Website Path
        const webPath = newPathFull.replace(webBlogPublicDestDir, webBlogContentPath);

        return { webPath, oldPathFull, newPathFull };
    };

    // Copy Files to public (this is just to get media files)
    const onMediaFile = async (sourceFilePath: string, mediaPath: string): Promise<{ newPath: string }> => {
        // console.log(`onMediaFile`, { path: mediaPath, newPath: webPath, sourceFileRelPath, sourceFileRelDir, newPathFull, oldPathFull, blogContentDir, publicDestDir });
        const { webPath, oldPathFull, newPathFull } = calculateWebPath(sourceFilePath, mediaPath);
        // Copy File
        await copyFile(oldPathFull, newPathFull, { overwrite: true });

        return { newPath: webPath };
    };

    // console.log(`loadStaticPageData blogContentDir`, { blogContentDir });
    // await processDirectoryFiles(`${blogContentDir}`, async x => { if (x.endsWith(`.md`)) { pages.push(await createPageData_fromMarkdownFile(x, `post`)); } });
    await processDirectoryFiles(`${blogContentDir}/posts`, async x => { if (x.endsWith(`.md`)) { posts.push(await createPageData_fromMarkdownFile(x, `post`, onMediaFile)); } });
    await processDirectoryFiles(`${blogContentDir}/pages`, async x => { if (x.endsWith(`.md`)) { pagePosts.push(await createPageData_fromMarkdownFile(x, `page`, onMediaFile)); } });

    // Trigger gatsby watch to rebuild (with a file change)
    const triggerGatsbyRebuild = () => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setTimeout(async () => {
            const filename = getPathNormalized(__dirname, `./_rebuild-trigger.ts`);
            console.log(`Writing to Rebuild Trigger`, { filename });
            await writeFile(filename, `export const __trigger = 0;\r\n`, { overwrite: true });
        }, 100);
    };

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

        triggerGatsbyRebuild();
    });

    // Artwork content
    const artContentDir = getPathNormalized(__dirname, `../../art`);
    const artWebPublicDestDir = getPathNormalized(process.cwd(), `public/content/art`);

    const isArtMediaFile = (x: string) => {
        const artMediaFileExtsRegex = /\.(vert|frag|png|svg|jpg|gif)$/g;
        return artMediaFileExtsRegex.test(x);
    };

    const copyIfArtFile = async (x: string) => {
        if (!isArtMediaFile(x)) { return; }

        const sourceFileRelDir = x.replace(artContentDir, ``);
        const oldPathFull = getPathNormalized(artContentDir, sourceFileRelDir);
        const newPathFull = getPathNormalized(artWebPublicDestDir, sourceFileRelDir);

        console.log(`Artwork content`, { x, sourceFileRelDir, oldPathFull, newPathFull });
        await copyFile(oldPathFull, newPathFull, { overwrite: true });
    };

    await processDirectoryFiles(`${artContentDir}/artwork`, async x => {
        // console.log(`Artwork content?`, { x });
        await copyIfArtFile(x);
    });
    await watchFileChanges({ pathRoot: artContentDir, runOnStart: false }, async (files) => {
        const mediaFiles = files.filter(x => isArtMediaFile(x));
        for (const f of mediaFiles) {
            console.log(`Art File Changed`, { f });
            // eslint-disable-next-line no-await-in-loop
            await copyIfArtFile(f);

            // TODO
            // sub.onStateChange(await createPageData_fromMarkdownFile(f, `post`, onMediaFile));
        }

        if (mediaFiles.length <= 0) { return; }

        triggerGatsbyRebuild();
    });


    posts.sort((a, b) => a.data.postPage.order - b.data.postPage.order);
    pagePosts.unshift(...posts);

    // Add related posts
    const tagPostPairs = pagePosts.flatMap(x => x.data.postPage.tags.map(t => ({ item: x, postSitePath: x.sitePath, title: x.data.postPage.title, tag: t, dateLabel: x.data.postPage.dateLabel, order: x.data.postPage.order })));
    const tagPostSitePaths = groupItems(tagPostPairs, x => x.tag);
    pagePosts.forEach(x => {
        const r = x.data.postPage.tags.flatMap(t => tagPostSitePaths[t]);
        const r2 = distinct_key(r, y => y.postSitePath);
        x.data.postPage.relatedPages = r2.map(p => ({
            postSitePath: p.postSitePath,
            title: p.title,
            tags: p.item.data.postPage.tags.filter(t => x.data.postPage.tags.includes(t)),
            dateLabel: p.dateLabel,
            order: p.order,
        })).sort((a, b) => a.order - b.order);
    });

    const pages: SitePageInfo<PageData>[] = pagePosts;
    pages.push({
        sitePath: `/`,
        data: {
            postIndexPage: {
                posts: pagePosts.map(x => ({
                    sitePath: x.sitePath,
                    title: x.data.postPage?.title ?? ``,
                    summary: x.data.postPage?.summary ?? ``,
                })),
            },
        },
    });

    pages.push({
        sitePath: `/art`,
        data: { componentArtGalleryPage: { artKey: `TEST` } },
    });

    artIndex.forEach(x => {
        pages.push({
            sitePath: `/art/${x.key}`,
            data: {
                componentArtGalleryPage: {
                    artKey: x.key,
                    artTitle: `${x.title} - NFT Art - Rick Love`,
                    artImageUrl: x.imageUrl,
                },
            },
        });
    });

    pages.push({
        sitePath: `/games`,
        data: { componentGamesPage: { showList: true } },
    });

    componentGamesList.forEach(x => {
        pages.push({
            sitePath: `/games/${x.name}`,
            data: { componentGamesPage: { gameName: x.name } },
        });
    });

    // allPages.push({
    //     sitePath: `/tests/stripe`,
    //     data: {
    //         componentTestsPage: { testName: `stripe` },
    //     },
    // });

    componentTestList.forEach(x => {
        pages.push({
            sitePath: `/tests/${x.name}`,
            data: { componentTestsPage: { testName: x.name } },
        });
    });

    // Lesson Modules
    await createLessonModules(pages);

    pages.push({
        sitePath: `/404.html`,
        data: { notFoundPage: {} },
    });

    console.log(`loadStaticPages END`, { time: `${(Date.now() - startTime) / 1000} secs`, pages: pagePosts });
    return {
        pages,
        subscribePageChange: sub.subscribe,
    };
};


const createLessonModules = async (pages: SitePageInfo<PageData>[]) => {
    console.log(`createLessonModules`);

    const lessonModulesDir = getPathNormalized(__dirname, `../../code-training/data/lesson-modules`);
    const lessonModulesContentPath = `lesson-modules`;
    const publicRootDir = getPathNormalized(process.cwd(), `public`);
    const publicDestDir = getPathNormalized(publicRootDir, `${lessonModulesContentPath}`);

    await copyDirectory(lessonModulesDir, publicDestDir);

    const server = createLessonApiServer_localFileServer({
        lessonModuleFileRootPath: lessonModulesDir,
        // Not used:
        projectStateRootPath: getPathNormalized(__dirname, `../../code-training/lesson-server/server/templates/cra-template/src/project/`),
        renderProjectRootPath: getPathNormalized(__dirname, `../../code-training/lesson-server/server/templates/cra-template`),
    });
    const lessonModules = await server.getLessonModules({});

    // FIX /APP_ROOT_PATH
    for (const l of lessonModules.data) {
        const webPath = `${lessonModulesContentPath}/${l.key}/build`;
        const lessonBuildDir = getPathNormalized(publicRootDir, webPath);

        console.log(`createLessonModules - Fix APP_ROOT_PATH`, { webPath, lessonBuildDir, l });
        // eslint-disable-next-line no-await-in-loop
        await processDirectoryFiles(lessonBuildDir, async f => {
            const fileContent = await readFile(f);
            const corrected = fileContent.replace(/APP_ROOT_PATH/g, webPath);
            await writeFile(f, corrected, { overwrite: true });
        });
    }

    const lessonModuleList = lessonModules.data;
    lessonModuleList.forEach(x => {
        pages.push({
            sitePath: `/lessons/${x.key}`,
            data: { componentLessonModulePage: { lessonModuleKey: x.key, lessonModuleTitle: x.title } },
        });
    });

    // Add index
    lessonModuleList.forEach(x => {
        pages.push({
            sitePath: `/lessons`,
            data: { componentLessonListPage: { lessons: lessonModuleList.map(p => ({ sitePath: `/lessons/${p.key}`, lessonModuleKey: p.key, lessonModuleTitle: p.title })) } },
        });
    });
};
