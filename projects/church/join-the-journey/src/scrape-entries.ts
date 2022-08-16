import { IAttribute, INode, ITag, parse, SyntaxKind, walk } from 'html5parser';
import { delay, hashCode, replaceAll } from '@ricklove/utils-core';
import { fetchWithTimeout } from '@ricklove/utils-fetch';
import { VirtualFileSystem } from '../../../../features/networking/upload-api/common-client/lib';

const fetchWithDelay = async (url: string, timeMs: number) => {
  const result = await fetchWithTimeout(url, { method: `get` });
  // Prevent bot detection
  await delay(Math.floor(timeMs * (0.75 + 0.5 * Math.random())));
  return result;
};

type ScrapeEntriesDependencies = {
  storage: VirtualFileSystem;
};

export const scrapeEntries = async (dependencies: ScrapeEntriesDependencies): Promise<void> => {
  const { storage } = dependencies;

  const url = `https://jointhejourneycollegeside.us5.list-manage.com/generate-js/?u=f15ff1bd1f3d1b2775c098f64&fid=34242&show=365`;
  const result = await fetchWithDelay(url, 0);
  const resultTextRaw = (await result.text()).trim();
  await storage.saveTextFile(`./output/resultTextRaw.log`, resultTextRaw);

  /*
    document.write("<div class=\"display_archive\"><div class=\"campaign\">08\/12\/2022 -
    <a href=\"http:\/\/us5.campaign-archive.com\/?u=f15ff1bd1f3d1b2775c098f64&id=013a5e3cad\"
    title=\"August 12- Join the Journey\" target=\"_blank\">August 12- Join the Journey<\/a><\/div>
    <div class=\"campaign\">08\/11\/2022 - <a href=\"http:\/\/us5.campaign-archive.com\/?u=f15ff1bd1f3d1b2775c098f64&id=83c61363ae\"
    title=\"August 11- Join the Journey\" target=\"_blank\">August 11- Join the Journey<\/a><\/div>
    ...
    <div class=\"campaign\">01\/01\/2022 - <a href=\"http:\/\/us5.campaign-archive.com\/?u=f15ff1bd1f3d1b2775c098f64&id=f87d101d33\"
    title=\"January 1-Join the Journey\" target=\"_blank\">January 1-Join the Journey<\/a><\/div><\/div>");
    ")
  */
  const resultString = resultTextRaw.substring(`document.write(`.length, resultTextRaw.length - `);`.length);
  await storage.saveTextFile(`./output/resultString.log`, resultString);
  const resultContent = JSON.parse(resultString) as string;
  await storage.saveTextFile(`./output/resultContent.log`, resultContent);

  // <a href="http://us5.campaign-archive.com/?u=f15ff1bd1f3d1b2775c098f64&id=013a5e3cad"
  const urlMatches = [...resultContent.matchAll(/href="([^"]+)"/g)];
  const urls = urlMatches.map((m) => m[1] ?? ``).filter((x) => x);
  // console.log(urls, { urlMatches, urls });
  await storage.saveTextFile(`./output/urls.log`, urls.join(`\n`));

  const ARTICLES_CONTENT_DOCUMENT_PATH = `./articles-content.json`;
  const ARTICLES_INDEX_DOCUMENT_PATH = `./articles-index.json`;
  const existing = await storage.loadJsonFile<ArticlesContentDocument>(ARTICLES_CONTENT_DOCUMENT_PATH);

  const urlsToScrape = urls.reverse();
  // TESTING
  //.slice(0, 10);

  const saveArticles = async (articlesRaw: ArticleItem[]) => {
    const articles = [...articlesRaw].sort((a, b) => a.metadata.date.localeCompare(b.metadata.date));

    const articlesContentDoc: ArticlesContentDocument = {
      articles,
    };
    const articlesIndexDoc: ArticlesIndexDocument = {
      articles: articles.map((x) => ({ index: x.index, metadata: x.metadata })),
    };
    await storage.saveJsonFile(ARTICLES_CONTENT_DOCUMENT_PATH, articlesContentDoc);
    await storage.saveJsonFile(ARTICLES_INDEX_DOCUMENT_PATH, articlesIndexDoc);

    const indexMarkdown = articles
      .map(
        (x) => `
- ${x.metadata.title}
    - ${x.metadata.verse}
    - ${x.metadata.author}
    - ![](${x.metadata.image})
  `,
      )
      .join(``);

    await storage.saveTextFile(`./output/index.md`, indexMarkdown);
  };

  const items = existing?.articles ?? [];
  for (const [iUrl, url] of urlsToScrape.entries()) {
    const a = items.find((a) => a.metadata.url === url);
    if (a) {
      console.log(`SKIP - already found [${iUrl}]: ${url}`);
      continue;
    }

    console.log(`scraping [${iUrl}]: ${url}`);
    items.push(await scrapeEntry(dependencies, url, iUrl));
    await saveArticles(items);
  }

  for (const x of items) {
    if (x.isCloned) {
      continue;
    }
    await cloneAndUpdateArticleImages(dependencies, x);
    await saveArticles(items);
  }

  // return {
  //   items,
  // };
};

type ArticlesIndexDocument = {
  articles: Omit<ArticleItem, 'markdown'>[];
};
type ArticlesContentDocument = {
  articles: ArticleItem[];
};
type ArticleItem = {
  index: number;
  isCloned?: boolean;
  metadata: {
    title: string | undefined;
    author: string | undefined;
    image: string;
    verse: string | undefined;
    date: string;
    url: string;
  };
  markdown: string;
};
const scrapeEntry = async (
  dependencies: ScrapeEntriesDependencies,
  url: string,
  iDebugUrl: number,
): Promise<ArticleItem> => {
  const { storage } = dependencies;

  const getArticleText = async () => {
    const RAW_TEXT_FILE_PATH = `./output/articles/url-${iDebugUrl}-resultTextRaw.log`;

    const articleTextSaved = await storage.loadTextFile(RAW_TEXT_FILE_PATH);

    if (articleTextSaved) {
      return articleTextSaved;
    }

    const result = await fetchWithDelay(url, 1000);
    const resultTextRaw = (await result.text()).trim();
    await storage.saveTextFile(RAW_TEXT_FILE_PATH, resultTextRaw);

    return resultTextRaw;
  };

  const articleText = await getArticleText();
  const htmlNodes = parse(articleText);

  const extractTags = (nodes: INode[], filter: (x: ITag) => boolean) => {
    const allItems = [] as ITag[];

    const visited = new Set<INode>();
    walk(nodes, {
      enter: (node) => {
        if (visited.has(node)) {
          return;
        }
        visited.add(node);

        if (node.type === SyntaxKind.Tag && filter(node)) {
          allItems.push(node);
        }
      },
    });

    return allItems;
  };

  const extractAttributes = (nodes: INode[], filterAttribute: (x: IAttribute) => boolean) => {
    const allItems = [] as IAttribute[];

    const visited = new Set<INode>();
    walk(nodes, {
      enter: (node) => {
        if (visited.has(node)) {
          return;
        }
        visited.add(node);

        if (node.type === SyntaxKind.Tag) {
          const a = node.attributes.filter(filterAttribute);
          allItems.push(...a);
        }
      },
    });

    return allItems;
  };

  const unescapeText = (t: string) => {
    return t
      .replace(/&nbsp;/g, ` `)
      .replace(/&amp;/g, `&`)
      .replace(/%20/g, ` `);
  };

  const extractText = (nodes: INode[]) => {
    const allTextContent = [] as string[];

    const visited = new Set<INode>();
    walk(nodes, {
      enter: (node) => {
        if (visited.has(node)) {
          return;
        }
        visited.add(node);

        if (node.type === SyntaxKind.Text) {
          allTextContent.push(unescapeText(node.value));
          return;
        }
      },
    });

    return allTextContent;
  };

  const extractMarkdown = (nodes: INode[]) => {
    const allContent = [] as string[];

    const visited = new Set<INode>();
    walk(nodes, {
      enter: (node) => {
        if (visited.has(node)) {
          return;
        }
        visited.add(node);

        if (node.type === SyntaxKind.Text) {
          allContent.push(unescapeText(node.value));
          return;
        }

        if (node.type === SyntaxKind.Tag && node.name === `img`) {
          const imgSrc = node.attributes.find((a) => a.name.value === `src`)?.value?.value;
          if (!imgSrc) {
            return;
          }

          allContent.push(`![](${imgSrc})`);
          return;
        }

        if (node.type === SyntaxKind.Tag && node.name === `a`) {
          const link = node.attributes.find((a) => a.name.value === `href`)?.value?.value;
          if (!link) {
            return;
          }

          const title = node.attributes.find((a) => a.name.value === `title`)?.value?.value;
          const text = extractText([node])
            .map((x) => x.trim())
            .filter((x) => x)
            .join(` `);
          allContent.push(`[${title || text || link}](${link})`);
          return;
        }
      },
    });

    return allContent;
  };

  const bodyNodes = extractTags(htmlNodes, (x) => x.name === `body`);
  const contentNodes = extractTags(bodyNodes, (x) =>
    x.attributes.some((a) => a.name.value === `id` && a.value?.value === `templateBody`),
  );
  const textContentNodes = extractTags(bodyNodes, (x) =>
    x.attributes.some(
      (a) =>
        a.name.value === `class` && (a.value?.value === `mcnTextContent` || a.value?.value.endsWith(`ImageContent`)),
    ),
  );

  const clickToReadTag = extractTags(bodyNodes, (x) => x.name === `a`).filter((x) =>
    x.attributes.some((a) => a.name?.value === `title` && a.value?.value.includes(`READ`)),
  )?.[0];
  const iClickToReadTag = clickToReadTag?.start || 0;

  // const textContentNodes = textContentNodesRaw.slice(0,textContentNodesRaw.findIndex(x=>x.))
  // console.log(`scrapeEntry textContentNodes`, { textContentNodes });

  const links = extractAttributes(htmlNodes, (x) => x.name.value === `href`)
    .map((a) => a.value?.value ?? ``)
    .filter((x) => x);

  // https://www.biblegateway.com/passage/?search=Jeremiah+34-36&version=NIV
  const verse = /biblegateway\.com\/passage\/\?search=([^&]+)&/g
    .exec(links.join(` `))?.[1]
    .replace(`%20`, ` `)
    .replace(/\+/g, ` `);
  // console.log(`scrapeEntry links`, { links, verse });

  const markdownContentLines_beforeClickToRead = extractMarkdown(
    textContentNodes.filter((x) => x.end < iClickToReadTag),
  )
    .join(``)
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x);

  const markdownContentLines_afterClickToRead = extractMarkdown(
    textContentNodes.filter((x) => x.start > iClickToReadTag),
  )
    .join(``)
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x);

  const markdownContentLines = [
    ...markdownContentLines_beforeClickToRead,
    `---`,
    ...markdownContentLines_afterClickToRead,
  ];

  // Inject verse

  const iVerse = markdownContentLines.findIndex((x) => x === verse);
  const iDevotional = markdownContentLines.findIndex((x) => x.includes(`Devotional`));
  if (iVerse) {
    markdownContentLines[iVerse] = `[${verse}](https://www.esv.org/${verse?.replace(/ /g, `+`)})`;
  } else if (iDevotional) {
    markdownContentLines.splice(iDevotional, 0, `[${verse}](https://www.esv.org/${verse?.replace(/ /g, `+`)})`);
  }

  // Trim Footer
  const iEndContent = Math.min(
    ...[
      markdownContentLines.findIndex((l) => l.toLocaleLowerCase().includes(`love the journey`)),
      markdownContentLines.findIndex((l) => l.toLocaleLowerCase().includes(`mailing address`)),
      markdownContentLines.findIndex((l) => l.toLocaleLowerCase().includes(`copyright`)),
    ].filter((x) => x > 0),
  );

  // console.log(iEndContent, { iEndContent });

  const markdownContent = markdownContentLines.slice(0, iEndContent).join(`\n\n`);

  // <meta property="og:title" content="August 12- Join the Journey">
  const titleRaw = extractTags(
    htmlNodes,
    (n) => n.name === `meta` && n.attributes.some((a) => a.value?.value === `og:title`),
  )?.[0]?.attributes.find((a) => a.name?.value === `content`)?.value?.value;
  const title = titleRaw?.replace(/\s*-\s+/g, ` - `);

  const dateRaw = /([\w]+\s*[\d]+)/.exec(title ?? ``)?.[1];
  const date = new Date(Date.parse(`${dateRaw}, 2022`));

  const imageLine = markdownContentLines.slice(markdownContentLines.indexOf(`---`)).filter((x) => x.includes(`![`))[0];
  const image = imageLine.replace(/^!\[\]\(/, ``).replace(/\)$/, ``);

  // Author is first text after image
  const authorRaw = markdownContentLines.slice(markdownContentLines.indexOf(imageLine)).find((x) => !x.includes(`[`));
  const author = authorRaw?.includes(`2022`) ? undefined : authorRaw;

  const metadata = {
    title: title,
    author: author,
    image: image,
    verse: verse,
    date: date.toISOString().substring(0, 10),
    url: url,
  };

  const markdownPost = `
---
${Object.entries(metadata)
  .filter(([k, v]) => v)
  .map(([k, v]) => `${k}: "${v}"`)
  .join(`\n`)}
---

${markdownContent}
    `.trim();

  await storage.saveTextFile(`./output/articles/url-${iDebugUrl}-bodyText.md`, markdownPost);
  // console.log(`scrapeEntry nodes`, { allSpanText: extractText([bodyNode]) });

  return {
    index: iDebugUrl,
    metadata,
    markdown: markdownContent,
  };
};

const cloneAndUpdateArticleImages = async (dependencies: ScrapeEntriesDependencies, article: ArticleItem) => {
  if (article.isCloned) {
    return;
  }

  // ![](https://mcusercontent.com/f15ff1bd1f3d1b2775c098f64/images/d054f0de-b7cd-3636-ec98-7835843d9cf5.png)
  const markdownImages = [...article.markdown.matchAll(/!\[\]\(([^)]+)\)/g)].map((m) => m[1]);
  const imageUrls = [...new Set([article.metadata.image, ...markdownImages])];

  const getImageFilePath = (imageUrl: string) => {
    const hash = hashCode(imageUrl, 42);
    const filePath = `./image/${hash}`;
    return filePath;
  };

  const images = imageUrls.map((x) => ({
    imageUrl: x,
    filePath: getImageFilePath(x),
    clonedImageUrl: undefined as undefined | string,
  }));

  for (const image of images) {
    const clonedImageUrl = await dependencies.storage.getFilePublicUrl(image.filePath);
    if (clonedImageUrl) {
      image.clonedImageUrl = clonedImageUrl;
      continue;
    }

    const result = await fetchWithDelay(image.imageUrl, 100);
    const contentType = result.headers.get(`Content-Type`) ?? ``;
    await dependencies.storage.saveBinaryFile(image.filePath, await result.arrayBuffer(), contentType);
    image.clonedImageUrl = await dependencies.storage.getFilePublicUrl(image.filePath);
  }

  // Replace article content
  const getFinalImageUrl = async (imageUrl: string) => {
    return images.find((x) => x.imageUrl === imageUrl)?.clonedImageUrl ?? imageUrl;
  };

  // eslint-disable-next-line require-atomic-updates
  article.metadata.image = await getFinalImageUrl(article.metadata.image);

  for (const image of images) {
    if (!image.clonedImageUrl) {
      return;
    }

    article.markdown = replaceAll(article.markdown, image.imageUrl, image.clonedImageUrl);
  }

  // console.log(`cloneImages`, { images });
};
