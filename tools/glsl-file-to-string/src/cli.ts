import { promises as fs } from 'fs';
import { getAllFiles } from '@ricklove/utils-files';

export const run = async () => {
  const argv = process.argv;

  const argDestDir =
    argv.includes(`--d`) || argv.includes(`--dest`)
      ? argv.slice(argv.findIndex((a) => a.startsWith(`--d`)) + 1)[0]
      : undefined;

  console.log(`glsl-file-to-string`, { argDestDir });

  if (!argDestDir) {
    console.error(`No -d path provided`);
    return;
  }

  const allFiles = await getAllFiles(argDestDir);
  const glslFiles = allFiles.filter((x) => x.endsWith(`.vert`) || x.endsWith(`.frag`));

  for (const x of glslFiles) {
    const content = await fs.readFile(x, { encoding: `utf-8` });
    const final = `export const glsl = \`${content}\`;\n`;
    console.log(`writeFile`, { filePath: `${x}.ts`, final: final.substr(0, 50) });
    await fs.writeFile(`${x}.ts`, final);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
