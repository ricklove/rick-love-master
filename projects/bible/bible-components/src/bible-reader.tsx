import React, { useMemo, useState } from 'react';
import { useCallback } from 'react';
import { C } from '@ricklove/react-controls';
import { useAsyncWorker } from '@ricklove/utils-react';
import { createMemoryPassagesFromBible } from './bible-memory-passage';
import { MemoryPassage } from './bible-memory-types';
import { BiblePassage, BiblePassageRange, BibleServiceConfig, createBibleService } from './bible-service';

export const BiblePassageLoader = ({
  config,
  onPassageLoaded,
}: {
  config: BibleServiceConfig;
  onPassageLoaded: (passage: BiblePassage) => void;
}) => {
  const [passageReference, setPassageReference] = useState(``);
  const bibleService = useMemo(() => createBibleService(config), []);

  const changePassageReference = useCallback((e: { target: { value: string } }) => {
    setPassageReference(e.target.value);
  }, []);

  const { loading, error, doWork } = useAsyncWorker();
  const loadPassage = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      doWork(async (stopIfObsolete) => {
        const result = await bibleService.getPassage(passageReference);
        stopIfObsolete();
        onPassageLoaded(result);
      });
    },
    [passageReference],
  );

  return (
    <>
      <C.Loading loading={loading} />
      <C.ErrorBox error={error} />
      <form onSubmit={loadPassage}>
        <input type='text' value={passageReference} onChange={changePassageReference} />
        <button onClick={loadPassage}>Load</button>
      </form>
    </>
  );
};

export type BibleReaderOptions = {
  autoRead: boolean;
};
export const defaultBibleReaderOptions: BibleReaderOptions = {
  autoRead: true,
};

export const BibleReaderOptionsView = ({
  value,
  onChange,
}: {
  value: BibleReaderOptions;
  onChange: (value: BibleReaderOptions) => void;
}) => {
  const toggleAutoRead = useCallback(() => {
    onChange({ ...value, autoRead: !value.autoRead });
  }, [value]);

  return (
    <div>
      <label>
        <input type='checkbox' checked={value.autoRead} onChange={toggleAutoRead} />
        Auto read
      </label>
    </div>
  );
};

export const BibleReaderView = ({
  passage,
  readerOptions,
  onPassageRead,
  onStartMemorize,
}: {
  passage: BiblePassage;
  readerOptions: BibleReaderOptions;
  onPassageRead: (passageRange: BiblePassageRange) => void;
  onStartMemorize?: (passages: MemoryPassage[]) => void;
}) => {
  const openExternalUrl = useCallback(() => {
    window.open(passage?.copyright.url, `_blank`);
  }, []);

  return (
    <>
      <div style={{ margin: 4, padding: 4, background: `#EEEEEE`, minHeight: 100 }}>
        <div>
          <div>
            <h2>
              {passage?.passageReference}
              <span
                style={{ fontSize: `0.5em`, cursor: `pointer` }}
                title={passage?.copyright.long}
                onClick={openExternalUrl}
              >
                &nbsp;{passage?.copyright.short}
                {`🔗`}
              </span>
            </h2>
          </div>
          {passage?.sections.map((s) => (
            <BiblePassage
              key={s.key}
              passage={passage}
              section={s}
              readerOptions={readerOptions}
              onPassageRead={onPassageRead}
              onStartMemorize={onStartMemorize}
            />
          ))}
        </div>
      </div>
      {/* Ensure reader can scroll to top of screen */}
      <div style={{ height: `100vh`, background: `#CCCCCC` }} />
    </>
  );
};

const BiblePassage = ({
  passage,
  section,
  readerOptions,
  onPassageRead,
  onStartMemorize,
}: {
  passage: BiblePassage;
  section: BiblePassage['sections'][number];
  readerOptions: BibleReaderOptions;
  onPassageRead: (passageRange: BiblePassageRange) => void;
  onStartMemorize?: (passages: MemoryPassage[]) => void;
}) => {
  const startMemorizeSection = useCallback(() => {
    onStartMemorize?.(createMemoryPassagesFromBible({ passage, startSection: section }));
  }, [section]);

  const [isRead, setIsRead] = useState(false);
  const markRead = useCallback(() => {
    setIsRead(true);
    onPassageRead({
      bookName: passage.bookName,
      start: section.verses[0],
      end: section.verses[section.verses.length - 1],
    });
  }, [passage, section]);

  return (
    <>
      <h3 style={{ marginTop: 32, fontWeight: `bold` }}>
        {section.header}
        <span style={{ fontSize: `0.7em` }}> {section.passageReference}</span>
        <button style={{ width: 24, margin: 0, padding: 0, background: `unset`, border: `unset` }} onClick={markRead}>
          {isRead ? `📖` : `📕`}
        </button>
        {onStartMemorize && (
          <button
            style={{ margin: 0, padding: 0, background: `unset`, border: `unset` }}
            onClick={startMemorizeSection}
          >
            🧠
          </button>
        )}
      </h3>
      <div style={{ whiteSpace: `pre-wrap` }}>
        {section.verses.map((x) => (
          <BibleVerse
            key={`${x.chapterNumber}:${x.verseNumber}`}
            passage={passage}
            verse={x}
            readerOptions={readerOptions}
            onPassageRead={onPassageRead}
            onStartMemorize={onStartMemorize}
          />
        ))}
      </div>
    </>
  );
};

const BibleVerse = ({
  passage,
  verse,
  readerOptions,
  onPassageRead,
  onStartMemorize,
}: {
  passage: BiblePassage;
  verse: BiblePassage['sections'][number]['verses'][number];
  readerOptions: BibleReaderOptions;
  onPassageRead: (passageRange: BiblePassageRange) => void;
  onStartMemorize?: (passages: MemoryPassage[]) => void;
}) => {
  const [isRead, setIsRead] = useState(false);
  const startMemorizeVerse = useCallback(() => {
    onStartMemorize?.(createMemoryPassagesFromBible({ passage, startVerse: verse }));
  }, [verse]);

  const markRead = useCallback(() => {
    setIsRead(true);
    onPassageRead({
      bookName: passage.bookName,
      start: {
        chapterNumber: verse.chapterNumber,
        verseNumber: verse.verseNumber,
      },
      end: {
        chapterNumber: verse.chapterNumber,
        verseNumber: verse.verseNumber,
      },
    });
  }, [passage, verse]);

  return (
    <>
      <button style={{ width: 24, margin: 0, padding: 0, background: `unset`, border: `unset` }} onClick={markRead}>
        {isRead ? `📖` : `📕`}
      </button>
      {readerOptions.autoRead && (
        <C.LazyComponent
          onLoad={markRead}
          options={{ debugName: `${verse.chapterNumber}:${verse.verseNumber}`, onscreenDistanceFromTopLoadHeight: 100 }}
        >
          <span />
        </C.LazyComponent>
      )}
      {onStartMemorize && (
        <button style={{ margin: 0, padding: 0, background: `unset`, border: `unset` }} onClick={startMemorizeVerse}>
          🧠
        </button>
      )}
      <span>{verse.text}</span>
    </>
  );
};
