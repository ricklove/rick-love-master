import esbuild from 'esbuild';
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { joinPathNormalized } from '@ricklove/utils-files';

export const createStaticHtmlPages = async ({
  projectPath,
  workingDirPath,
  destHtmlDirPath,
  tokenIds,
}: {
  projectPath: string;
  workingDirPath: string;
  destHtmlDirPath: string;
  tokenIds: string[];
}) => {
  // Run rollup to get single file
  const minify = false;
  const maxSize = 1000;
  const useScriptFile = true;

  console.log(`# createStaticHtmlPages`, { projectPath, workingDirPath, destHtmlDirPath, tokenIds });

  const entryPoint = joinPathNormalized(projectPath, `./index.ts`);
  const outputScriptFile = joinPathNormalized(workingDirPath, `script.js`);

  console.log(`createScript`, { outputScriptFile });
  await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    outfile: outputScriptFile,
    target: `es2019`,
    minify,
  });

  const scriptContent = await fs.readFile(outputScriptFile, { encoding: `utf-8` });
  const title =
    scriptContent
      .match(/title:([^\n]+)/)?.[1]
      .replace(/^\s*('|"|`)\s*/, ``)
      .replace(/\s*('|"|`)\s*,?\s*$/, ``) ?? ``;

  const scriptLoader = `
window.loadNft = (tokenId) => {
  new p5((s) => {
    const res = artwork.render(tokenId);
    const size = Math.min(${maxSize}, window.innerWidth, window.innerHeight);
    const canvasSize = { x: size, y: size };
    let startTime = Date.now();
    s.setup = () => {
      s.createCanvas(size, size);
      res.setup && res.setup(s, { canvasSize });
    };
    s.draw = () => {
      res.draw(s, { time: (Date.now() - startTime) / 1000, canvasSize });
    };
  }, document.getElementById('host'));
}
`;
  const scriptAutostart = scriptContent.replace(
    `})();`,
    `${!minify ? scriptLoader : scriptLoader.replace(/\s+/g, ``)}})();`,
  );

  // Save script if file
  if (useScriptFile) {
    await fs.mkdir(destHtmlDirPath, { recursive: true });
    await fs.writeFile(joinPathNormalized(destHtmlDirPath, `./script.js`), scriptAutostart);
  }

  // Inject into html
  for (const tokenId of tokenIds) {
    const scriptTag = useScriptFile ? `<script src='script.js'></script>` : `<script>${scriptAutostart}</script>`;
    const htmlContent = `<!DOCTYPE html><title>${title}</title>
<style>
html,body,div{ padding:0; margin:0; background:#000; width:100%; height:100%; }
#host{ display: flex; align-items: center; justify-content: center; }
</style>
<div id='host'></div>
<script src='https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.min.js'></script>
${scriptTag}
<script>loadNft('${tokenId}')</script>
`;

    const filePath = joinPathNormalized(destHtmlDirPath, `./${tokenId}.html`);
    await fs.mkdir(dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, htmlContent);
  }
};
