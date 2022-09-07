import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiblePassageRange, BiblePassageRangeString } from '@ricklove/bible-types';
import { C } from '@ricklove/react-controls';
import { BibleHeatmapView } from './bible-heatmap';
import { BibleMemoryHost } from './bible-memory-proto';
import { MemoryPassage } from './bible-memory-types';
import { BiblePassageLoader, useBiblePassageLoader } from './bible-passage-loader';
import { BibleReaderOptionsView, BibleReaderView, defaultBibleReaderOptions } from './bible-reader';
import { BiblePassage, BibleServiceConfig } from './bible-service';
import { BibleUserHistoryView } from './bible-user-history';
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
  history: {
    timestamp: number;
    passageRange: BiblePassageRangeString;
  }[];
};

type VerseProgress = {
  lastRead?: number;
  lastMemorized?: number;
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

const addPassageHistory = (progressState: BibleToolsUserProgress, passageRange: BiblePassageRange) => {
  progressState.history = progressState.history ?? [];
  progressState.history.push({ passageRange: BiblePassageRange.encode(passageRange), timestamp: Date.now() });
};

const getVerseState = (userProgress: BibleToolsUserProgress) => {
  const verseState = Object.entries(userProgress.books).flatMap(([bookName, b]) =>
    Object.entries(b).flatMap(([chapterNumber, c]) =>
      Object.entries(c).flatMap(([verseNumber, v]) => ({
        bookName,
        chapterNumber: Number(chapterNumber),
        verseNumber: Number(verseNumber),
        scoreRatioA: Math.min(1, Math.max(0, 1 - (Date.now() - (v.lastRead ?? 0)) / (365 * 24 * 60 * 60 * 1000))),
        scoreRatioB:
          (v.memoryScoreRatio ?? 0) *
          Math.min(
            1,
            Math.max(0, 1 - (Date.now() - (v.lastMemorized ?? v.lastRead ?? 0)) / (365 * 24 * 60 * 60 * 1000)),
          ),
        // scoreRatioC: v.memoryScoreRatio ?? 0,
      })),
    ),
  );

  console.log(`getVerseState`, { verseState });
  return verseState;
};

export type BibleToolsConfig = BibleServiceConfig & UserProgressConfig;
export const BibleToolsRoot = ({ config }: { config: BibleToolsConfig }) => {
  const [tab, setTab] = useState(`reader` as 'reader' | 'heatmap' | 'history');

  const userProgressService = useRef(
    createUserProgressService<BibleToolsUserProgress>(config, { storageName: `bible-tools-progress` }),
  );

  const updateUserProgress = (updateState: (previousState: BibleToolsUserProgress) => void) => {
    const s = userProgressService.current.getUserData() ?? { books: {}, history: [] };
    updateState(s);

    userProgressService.current.setUserData(s);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    userProgressService.current.saveUserProgress();
  };

  const recordPassageMemorized = useCallback((passage: MemoryPassage, scoreRatio: number) => {
    if (!userProgressService.current) {
      return;
    }
    const passageRange = passage.passageRange;
    if (!passageRange) {
      return;
    }

    updateUserProgress((s) => {
      setPassageProgress(s, passageRange, {
        memoryScoreRatio: Number(scoreRatio.toFixed(2)),
        lastMemorized: Date.now(),
        lastRead: Date.now(),
      });
    });
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

      updateUserProgress((s) => {
        setPassageProgress(s, passageRange, {
          lastRead: Date.now(),
        });
      });
    },
    [],
  );

  const [passage, setPassage] = useState(undefined as undefined | BiblePassage);
  const changePassage = useCallback((value: BiblePassage) => {
    setPassage(value);
    setMemoryPassages(undefined);

    updateUserProgress((s) => {
      addPassageHistory(s, value.passageRange);
    });
  }, []);
  const {
    loading,
    error,
    loadPassage: loadPassageInner,
  } = useBiblePassageLoader({ config, onPassageLoaded: changePassage });
  const loadPassage = useCallback((value: string) => {
    loadPassageInner(value);
    setTab(`reader`);
  }, []);

  const [memoryPassages, setMemoryPassages] = useState(undefined as undefined | MemoryPassage[]);
  const startMemorize = useCallback((passages: MemoryPassage[]) => {
    setMemoryPassages(passages);
  }, []);

  const [, setReloadId] = useState(0);
  const reload = useCallback(() => {
    setReloadId((s) => s + 1);
  }, []);

  const mode = tab === `reader` && memoryPassages ? `memory` : tab;
  const [readerOptions, setReaderOptions] = useState(defaultBibleReaderOptions);

  return (
    <>
      <AutoStickyHeader>
        <div style={{ background: `#333333`, color: `#FFFFFF` }}>
          <div
            style={{
              display: `flex`,
              flexDirection: `row`,
              flexWrap: `wrap`,
              background: `#444444`,
            }}
          >
            <button onClick={() => setTab(`reader`)}>Read & Memorize</button>
            <button onClick={() => setTab(`heatmap`)}>Progress</button>
            <button onClick={() => setTab(`history`)}>History</button>
            <div style={{ flex: 1 }} />
            <UserSettings userProgressServiceRef={userProgressService} onChange={reload} />
          </div>
          <div>
            {mode === `reader` && (
              <>
                <BiblePassageLoader config={config} onPassageLoaded={changePassage} />
                <BibleReaderOptionsView value={readerOptions} onChange={setReaderOptions} />
              </>
            )}
          </div>
        </div>
      </AutoStickyHeader>
      <C.Loading loading={loading} />
      <C.ErrorBox error={error} />
      <div>
        {mode === `reader` && passage && (
          <BibleReaderView
            passage={passage}
            readerOptions={readerOptions}
            onPassageRead={recordPassageRead}
            onStartMemorize={startMemorize}
          />
        )}
        {mode === `memory` && memoryPassages && (
          <div style={{ background: `#000000`, minHeight: `100vh` }}>
            <BibleMemoryHost passages={memoryPassages} onPassageComplete={recordPassageMemorized} />
          </div>
        )}
        {mode === `heatmap` && userProgressService.current && (
          <>
            <BibleHeatmapView
              verseState={getVerseState(userProgressService.current.getUserData() ?? { books: {}, history: [] })}
            />
          </>
        )}
        {mode === `history` && userProgressService.current && (
          <>
            <BibleUserHistoryView
              history={(userProgressService.current.getUserData() ?? { books: {}, history: [] }).history}
              onLoadPassage={loadPassage}
            />
          </>
        )}
      </div>
    </>
  );
};

const AutoStickyHeader = ({ children }: { children: JSX.Element }) => {
  const [isHeaderSticky, setIsHeaderSticky] = useState(true);
  useEffect(() => {
    let lastPos = 0;
    const callback = () => {
      const diff = window.scrollY - lastPos;
      lastPos = window.scrollY;
      setIsHeaderSticky(diff < 0);
    };
    window.addEventListener(`scroll`, callback);
    return () => window.removeEventListener(`scroll`, callback);
  }, []);

  return <div style={isHeaderSticky ? { position: `sticky`, top: 0 } : {}}>{children}</div>;
};
