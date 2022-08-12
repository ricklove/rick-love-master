import { IAttribute, INode, ITag, parse, SyntaxKind, walk } from 'html5parser';

type DebugTools = {
  fs: { writeFile: (filePath: string, content: string) => Promise<void> };
};

export const scrapeEntries = async (debugTools: DebugTools) => {
  const { fs } = debugTools;

  const url = `https://jointhejourneycollegeside.us5.list-manage.com/generate-js/?u=f15ff1bd1f3d1b2775c098f64&fid=34242&show=365`;
  const result = await fetch(url);
  const resultTextRaw = (await result.text()).trim();
  await fs.writeFile(`./output/resultTextRaw.log`, resultTextRaw);

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
  await fs.writeFile(`./output/resultString.log`, resultString);
  const resultContent = JSON.parse(resultString);
  await fs.writeFile(`./output/resultContent.log`, resultContent);

  // <a href="http://us5.campaign-archive.com/?u=f15ff1bd1f3d1b2775c098f64&id=013a5e3cad"
  const urlMatches = [...resultContent.matchAll(/href="([^"]+)"/g)];
  const urls = urlMatches.map((m) => m[1] ?? ``).filter((x) => x);
  // console.log(urls, { urlMatches, urls });
  await fs.writeFile(`./output/urls.log`, urls.join(`\n`));

  const urlsToScrape = urls.slice(0, 1);
  const items = await Promise.all(urlsToScrape.map(async (x, i) => await scrapeEntry(x, i, debugTools)));
};

const scrapeEntry = async (url: string, iUrl: number, debugTools: DebugTools) => {
  const { fs } = debugTools;

  const result = await fetch(url);
  const resultTextRaw = (await result.text()).trim();
  await fs.writeFile(`./output/url-${iUrl}-resultTextRaw.log`, resultTextRaw);

  const htmlNodes = parse(resultTextRaw);

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
          allTextContent.push(node.value.replace(/&nbsp;/g, ` `));
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
          allContent.push(node.value.replace(/&nbsp;/g, ` `));
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

  // const textContentNodes = textContentNodesRaw.slice(0,textContentNodesRaw.findIndex(x=>x.))
  // console.log(`scrapeEntry textContentNodes`, { textContentNodes });

  const links = extractAttributes(htmlNodes, (x) => x.name.value === `href`)
    .map((a) => a.value?.value ?? ``)
    .filter((x) => x);

  // https://www.biblegateway.com/passage/?search=Jeremiah+34-36&version=NIV
  const verse = /biblegateway\.com\/passage\/\?search=([^&]+)&/g.exec(links.join(` `))?.[1].replace(/\+/g, ` `);
  console.log(`scrapeEntry links`, { links, verse });

  const markdownContentLines = extractMarkdown(textContentNodes)
    .join(``)
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x);

  const markdownContent = markdownContentLines
    // Trim Footer
    .slice(
      0,
      markdownContentLines.findIndex((l) => l === `Love the Journey?`),
    )
    .join(`\n\n`);

  const author = markdownContentLines[0];

  // <meta property="og:title" content="August 12- Join the Journey">
  const titleRaw = extractTags(
    htmlNodes,
    (n) => n.name === `meta` && n.attributes.some((a) => a.value?.value === `og:title`),
  )?.[0]?.attributes.find((a) => a.name?.value === `content`)?.value?.value;
  const title = titleRaw?.replace(/\s*-\s+/g, ` - `);

  const dateRaw = title?.replace(/\s*-\s*Join the Journey/, ``).trim();
  const date = new Date(Date.parse(`${dateRaw}, 2022`));

  const markdown = `
---
title: "${title}"
author: "${author}"
verse: "${verse}"
date: "${date.toISOString().substring(0, 10)}"
---

[${verse}](https://www.esv.org/${verse?.replace(/ /g, `+`)})

${markdownContent}
  `.trim();

  await fs.writeFile(`./output/url-${iUrl}-bodyText.md`, markdown);
  // console.log(`scrapeEntry nodes`, { allSpanText: extractText([bodyNode]) });
};
