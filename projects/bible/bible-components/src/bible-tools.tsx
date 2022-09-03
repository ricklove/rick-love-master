import React, { useCallback, useRef, useState } from 'react';
import { BibleHeatmapView } from './bible-heatmap';
import { BibleMemoryHost } from './bible-memory-proto';
import { MemoryPassage } from './bible-memory-types';
import { BiblePassageLoader, BibleReaderView } from './bible-reader';
import { BiblePassage, BibleServiceConfig } from './bible-service';
import { createUserProgressService, UserProgressConfig } from './user-data';
import { UserSettings } from './user-settings';

type BibleToolsUserProgress = {
  books: {
    [bookName: string]: {
      [chapterNumber: number]: {
        [verseNumber: number]: { memoryScoreRatio?: number };
      };
    };
  };
};

const getVerseState = (userProgress: BibleToolsUserProgress) => {
  const verseState = Object.entries(userProgress.books).flatMap(([bookName, b]) =>
    Object.entries(b).flatMap(([chapterNumber, c]) =>
      Object.entries(c).flatMap(([verseNumber, v]) => ({
        bookName,
        chapterNumber: Number(chapterNumber),
        verseNumber: Number(verseNumber),
        scoreRatio: v.memoryScoreRatio ?? 0,
      })),
    ),
  );

  console.log(`getVerseState`, { verseState });
  return verseState;
};

export type BibleToolsConfig = BibleServiceConfig & UserProgressConfig;
export const BibleToolsRoot = ({ config }: { config: BibleToolsConfig }) => {
  const [tab, setTab] = useState(`reader` as 'reader' | 'heatmap');

  const userProgressService = useRef(
    createUserProgressService<BibleToolsUserProgress>(config, { storageName: `bible-tools-progress` }),
  );
  const recordPassageComplete = useCallback((passage: MemoryPassage, scoreRatio: number) => {
    if (!userProgressService.current) {
      return;
    }
    const passageRange = passage.passageRange;
    if (!passageRange) {
      return;
    }

    const s = userProgressService.current.getUserData() ?? { books: {} };
    console.log(`recordPassageComplete`, { passageRange, s, passage, scoreRatio });

    for (let c = passageRange.start.chapterNumber; c <= passageRange.end.chapterNumber; c++) {
      for (let v = passageRange.start.verseNumber; v <= passageRange.end.verseNumber; v++) {
        const books = s.books;
        const book = (books[passageRange.bookName] = books[passageRange.bookName] ?? {});
        const chapter = (book[c] = book[c] ?? {});
        const verse = (chapter[v] = chapter[v] ?? {});
        verse.memoryScoreRatio = Number(scoreRatio.toFixed(2));
      }
    }

    userProgressService.current.setUserData(s);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    userProgressService.current.saveUserProgress();
  }, []);

  const [passage, setPassage] = useState(undefined as undefined | BiblePassage);
  const changePassage = useCallback((value: BiblePassage) => {
    setPassage(value);
    setMemoryPassages(undefined);
  }, []);
  const [memoryPassages, setMemoryPassages] = useState(undefined as undefined | MemoryPassage[]);
  const startMemorize = useCallback((passages: MemoryPassage[]) => {
    setMemoryPassages(passages);
  }, []);

  const [, setReloadId] = useState(0);
  const reload = useCallback(() => {
    setReloadId((s) => s + 1);
  }, []);

  return (
    <>
      <div style={{ display: `flex`, flexDirection: `row`, flexWrap: `wrap`, background: `#333333`, color: `#FFFFFF` }}>
        <button onClick={() => setTab(`reader`)}>Read & Memorize</button>
        <button onClick={() => setTab(`heatmap`)}>Progress</button>
        <div style={{ flex: 1 }} />
        <UserSettings userProgressServiceRef={userProgressService} onChange={reload} />
      </div>
      {tab === `reader` && (
        <>
          <BiblePassageLoader config={config} onPassageLoaded={changePassage} />
          {memoryPassages && (
            <div style={{ background: `#000000`, minHeight: `100vh` }}>
              <BibleMemoryHost passages={memoryPassages} onPassageComplete={recordPassageComplete} />
            </div>
          )}
          {!memoryPassages && passage && <BibleReaderView passage={passage} onStartMemorize={startMemorize} />}
        </>
      )}
      {tab === `heatmap` && userProgressService.current && (
        <>
          <BibleHeatmapView verseState={getVerseState(userProgressService.current.getUserData() ?? { books: {} })} />
        </>
      )}
    </>
  );
};
