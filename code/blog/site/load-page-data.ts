/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-console */
/* eslint-disable unicorn/consistent-function-scoping */
import { processDirectoryFiles, getFileName, readFile, getPathNormalized } from 'utils/files';
import { PageData } from './create-page';
import { componentTestList } from '../pageTemplates/component-tests-list';
import { componentGamesList } from '../pageTemplates/component-games-list';

export type SitePages<T> = {
    pages: SitePageInfo<T>[];
};
export type SitePageInfo<T> = {
    sitePath: string;
    data: T;
};

export const loadStaticPageData = async (): Promise<SitePages<PageData>> => {
    // Register Pages here (node api available => Load all data that is needed for all pages here)

    console.log(`loadStaticPages START`);

    const createPageData_fromMarkdownFile = async (filePath: string, kind: 'post' | 'page'): Promise<SitePageInfo<PageData>> => {

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

        const sitePath = `/${headerValues.find(x => x.key === `path`)?.value.replace(/^\//g, ``) ?? filename.replace(/\.md$/, ``)}`;
        const summary = `${contentWithoutHeader.split(`\`\`\``)[0].split(`\n`).slice(0, 16).join(`\n`).trim()}\n\n...`;
        const title = headerValues.find(x => x.key === `title`)?.value ?? sitePath;

        console.log(`createPageData`, { sitePath });
        const page: SitePageInfo<PageData> = {
            sitePath,
            data: {
                postPage: {
                    sourceFilePath: filePath,
                    sourceFileContent: content,
                    title,
                    headers: headerValues,
                    body: contentWithoutHeader,
                    summary,
                },
            },
        };
        return page;
    };

    const pages = [] as SitePageInfo<PageData>[];

    const blogContentDir = getPathNormalized(__dirname, `../../blog-content`);
    // console.log(`loadStaticPageData blogContentDir`, { blogContentDir });
    // await processDirectoryFiles(`${blogContentDir}`, async x => { if (x.endsWith(`.md`)) { pages.push(await createPageData_fromMarkdownFile(x, `post`)); } });
    await processDirectoryFiles(`${blogContentDir}/posts`, async x => { if (x.endsWith(`.md`)) { pages.push(await createPageData_fromMarkdownFile(x, `post`)); } });
    await processDirectoryFiles(`${blogContentDir}/pages`, async x => { if (x.endsWith(`.md`)) { pages.push(await createPageData_fromMarkdownFile(x, `page`)); } });

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

    console.log(`getStaticPages`, { pages });
    return {
        pages,
    };
};
