import React, { } from 'react';
import ReactDOMServer from 'react-dom/server';
import { artIndex } from 'art/art-index-simple';
import { ensureDirectoryExists, writeFile } from 'utils/files';
import { ArtRenderer } from './art-renderer';

export const buildArtPages = async () => {

    const BUILD_PATH = `./_build/`;

    for (const a of artIndex){
        const folderPath = `${BUILD_PATH}/${a.key}/`;
        await ensureDirectoryExists(folderPath);
        const indexHtmlPath = `${folderPath}index.html`;

        const art = await a.load();

        const content = ReactDOMServer.renderToString(<ArtRenderer art={art} tokenId={`0`} showInfo={false}/>);
        console.log(`writeFile`, { indexHtmlPath, content: content.substr(0, 50) });
        await writeFile(indexHtmlPath, content, { overwrite: true });
    }
};

void buildArtPages();
