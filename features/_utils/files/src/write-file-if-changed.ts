import fsRaw from 'fs';
const fs = fsRaw.promises;

export const writeFileIfChanged = async (filePath: string, fileContent: string) => {
  const oldIndexFileContent = fsRaw.existsSync(filePath) ? await fs.readFile(filePath, { encoding: `utf-8` }) : null;
  if (oldIndexFileContent === fileContent) {
    return;
  }

  console.log(`createIndex - creating index file`, { indexFilePath: filePath });
  await fs.writeFile(filePath, fileContent);
};
