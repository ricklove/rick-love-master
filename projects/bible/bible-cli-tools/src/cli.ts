import path from 'path';
import { analyzeBibleTextCli } from './bible-textual-analysis/analyze-bible-text';
import { parseBibleEsv } from './bible-textual-analysis/parsers/esv-parser';

export const run = async () => {
  // This requires a text source of the entire bible which is not included in the repo because of copyright restrictions
  await analyzeBibleTextCli(
    path.resolve(`./data/esv-bible-raw-analysis-text.txt`),
    path.resolve(`./output/esv/`),
    parseBibleEsv,
  );
};

run().catch((err) => console.error(err));
