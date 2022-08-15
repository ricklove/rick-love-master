import './fetch-polyfill';
import fs from 'fs/promises';
import { scrapeEntries } from './scrape-entries';

export const exportArticles = async () => {
  // TODO: Make server implementation
  //   const createUploadApiStorage = () => {
  //     const uploadApiWebClient = createUploadApiWebClient(args);
  //   };

  await scrapeEntries({
    storage: {
      saveTextFile: (x, content) => fs.writeFile(x, content),
      loadTextFile: async (x) => {
        try {
          const content = await fs.readFile(x, { encoding: `utf-8` });
          return content;
        } catch (err: unknown) {
          if (!(err as { message?: string })?.message?.includes(`ENOENT`)) {
            // Ignore file error
            console.log(`Count not load file`, { err });
          }
          return undefined;
        }
      },
    },
  });
};
