import path from 'path';
import { extractBibleTextFeatures } from './bible-textual-analysis/extract-text-features';

export const run = async () => {
  // This requires a text source of the entire bible which is not included in the repo because of copyright restrictions
  await extractBibleTextFeatures(path.resolve(`./data/esv-bible-raw-analysis-text.txt`), path.resolve(`./output/`));
};

run().catch((err) => console.error(err));
