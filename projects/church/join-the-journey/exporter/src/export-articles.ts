import { createUploadApiVirtualFileSystem } from '@ricklove/upload-api-common-client';
import { JoinTheJourneyConfig } from './config';
import { scrapeEntries } from './scrape-entries';

export const exportArticles = async (config: JoinTheJourneyConfig) => {
  // TODO: Make server implementation

  const uploadApiFileSystem = createUploadApiVirtualFileSystem({
    ...config,
    uploadUrlPrefix: `join-the-journey`,
  });

  // // TEST
  // await uploadApiFileSystem.saveTextFile(`./test`, `Hello Again 03!`);
  // if (2 === 2 + 1 - 1) {
  //   console.log(`DONE`);
  //   return;
  // }

  await scrapeEntries({
    storage: uploadApiFileSystem,
  });
};
