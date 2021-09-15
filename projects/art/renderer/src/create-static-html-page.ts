import typescript from '@rollup/plugin-typescript';
import { rollup } from 'rollup';
import { joinPathNormalized } from '@ricklove/utils-files';

export const createStaticHtmlPage = async (projectPath: string, workingDirPath: string, destHtmlFilePath: string) => {
  // Run rollup to get single file

  console.log(`# createStaticHtmlPage`, { projectPath, workingDirPath, destHtmlFilePath });

  const bundle = await rollup({
    input: joinPathNormalized(projectPath, `./src/test.ts`),
    plugins: [
      typescript({
        tsconfig: joinPathNormalized(projectPath, `./tsconfig.json`),
      }),
    ],
  });

  // const { output } = await bundle.generate();
  await bundle.write({
    file: joinPathNormalized(workingDirPath, `script.js`),
    format: `iife`,
  });
  await bundle.close();
};
