import esbuild from 'esbuild';
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { joinPathNormalized } from '@ricklove/utils-files';

export const createStaticHtmlPage = async ({
  projectPath,
  workingDirPath,
  destHtmlFilePath,
}: {
  projectPath: string;
  workingDirPath: string;
  destHtmlFilePath: string;
}) => {
  // Run rollup to get single file

  console.log(`# createStaticHtmlPage`, { projectPath, workingDirPath, destHtmlFilePath });

  const entryPoint = joinPathNormalized(projectPath, `./index.ts`);
  const outputScriptFile = joinPathNormalized(workingDirPath, `script.js`);

  console.log(`createScript`, { outputScriptFile });
  await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    outfile: outputScriptFile,
    target: `es2019`,
    // minify: true,
  });

  const scriptContent = await fs.readFile(outputScriptFile, { encoding: `utf-8` });
  const title =
    scriptContent
      .match(/title:([^\n]+)/)?.[1]
      .replace(/^\s*('|"|`)\s*/, ``)
      .replace(/\s*('|"|`)\s*,?\s*$/, ``) ?? ``;

  const tokenId = `0`;
  const maxSize = 1000;
  const scriptAutostart = scriptContent.replace(
    `})();`,
    `
new p5((s) => {
  const tokenId = '${tokenId}';
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

})();`,
  );

  // Inject into html
  const htmlTemplate = `<!DOCTYPE html><title>${title}</title>
  <style>
  html,body,div{ padding:0; margin:0; background:#000; width:100%; height:100%; }
  #host{ display: flex; align-items: center; justify-content: center; }
  </style>
  <div id='host'></div>
  <script src='https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.min.js'></script>
  <script>${scriptAutostart}</script>`;
  await fs.mkdir(dirname(destHtmlFilePath), { recursive: true });
  await fs.writeFile(destHtmlFilePath, htmlTemplate);
};
