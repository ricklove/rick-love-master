import React, { useCallback, useRef, useState } from 'react';
import { BibleHeatmapView } from './bible-heatmap';
import { BibleMemoryHost } from './bible-memory-proto';
import { MemoryPassage } from './bible-memory-types';
import { BiblePassageLoader, BibleReaderView } from './bible-reader';
import { BiblePassage, BiblePassageRange, BibleServiceConfig } from './bible-service';
import { createUserProgressService, UserProgressConfig } from './user-data';
import { UserSettings } from './user-settings';

type BibleToolsUserProgress = {
  books: {
    [bookName: string]: {
      [chapterNumber: number]: {
        [verseNumber: number]: VerseProgress;
      };
    };
  };
};

type VerseProgress = {
  lastRead?: number;
  memoryScoreRatio?: number;
};

const setVerseProgress = ({
  progressState,
  bookName,
  chapterNumber: c,
  verseNumber: v,
  verseProgress,
}: {
  progressState: BibleToolsUserProgress;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  verseProgress: VerseProgress;
}) => {
  const books = progressState.books;
  const book = (books[bookName] = books[bookName] ?? {});
  const chapter = (book[c] = book[c] ?? {});
  const verse = (chapter[v] = chapter[v] ?? {});
  chapter[v] = { ...verse, ...verseProgress };
};

const setPassageProgress = (
  progressState: BibleToolsUserProgress,
  passageRange: BiblePassageRange,
  verseProgress: VerseProgress,
) => {
  for (let c = passageRange.start.chapterNumber; c <= passageRange.end.chapterNumber; c++) {
    for (let v = passageRange.start.verseNumber; v <= passageRange.end.verseNumber; v++) {
      setVerseProgress({
        progressState,
        bookName: passageRange.bookName,
        chapterNumber: c,
        verseNumber: v,
        verseProgress,
      });
    }
  }
};

const getVerseState = (userProgress: BibleToolsUserProgress) => {
  const verseState = Object.entries(userProgress.books).flatMap(([bookName, b]) =>
    Object.entries(b).flatMap(([chapterNumber, c]) =>
      Object.entries(c).flatMap(([verseNumber, v]) => ({
        bookName,
        chapterNumber: Number(chapterNumber),
        verseNumber: Number(verseNumber),
        scoreRatioA: Math.min(1, Math.max(0, 1 - (Date.now() - (v.lastRead ?? 0)) / (365 * 24 * 60 * 60 * 1000))),
        scoreRatioB: v.memoryScoreRatio ?? 0,
        // scoreRatioC: v.memoryScoreRatio ?? 0,
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
  const recordPassageMemorized = useCallback((passage: MemoryPassage, scoreRatio: number) => {
    if (!userProgressService.current) {
      return;
    }
    const passageRange = passage.passageRange;
    if (!passageRange) {
      return;
    }

    const s = userProgressService.current.getUserData() ?? { books: {} };
    console.log(`recordPassageMemorized`, { passageRange, s, passage, scoreRatio });

    setPassageProgress(s, passageRange, {
      memoryScoreRatio: Number(scoreRatio.toFixed(2)),
      lastRead: Date.now(),
    });

    userProgressService.current.setUserData(s);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    userProgressService.current.saveUserProgress();
  }, []);
  const recordPassageRead = useCallback(
    (passageRange: {
      bookName: string;
      start: { chapterNumber: number; verseNumber: number };
      end: { chapterNumber: number; verseNumber: number };
    }) => {
      if (!userProgressService.current) {
        return;
      }

      const s = userProgressService.current.getUserData() ?? { books: {} };
      console.log(`recordPassageRead`, { passageRange, s, passage });

      setPassageProgress(s, passageRange, {
        lastRead: Date.now(),
      });

      userProgressService.current.setUserData(s);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      userProgressService.current.saveUserProgress();
    },
    [],
  );

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
              <BibleMemoryHost passages={memoryPassages} onPassageComplete={recordPassageMemorized} />
            </div>
          )}
          {!memoryPassages && passage && (
            <BibleReaderView passage={passage} onPassageRead={recordPassageRead} onStartMemorize={startMemorize} />
          )}
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
