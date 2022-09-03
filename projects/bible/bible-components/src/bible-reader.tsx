import React, { useMemo, useState } from 'react';
import { useCallback } from 'react';
import { C } from '@ricklove/react-controls';
import { useAsyncWorker } from '@ricklove/utils-react';
import { createMemoryPassagesFromBible } from './bible-memory-passage';
import { MemoryPassage } from './bible-memory-types';
import { BiblePassage, BibleServiceConfig, createBibleService } from './bible-service';

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

export const BibleReaderView = ({
  passage,
  onStartMemorize,
}: {
  passage: BiblePassage;
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
            <BiblePassage key={s.key} passage={passage} section={s} onStartMemorize={onStartMemorize} />
          ))}
        </div>
      </div>
    </>
  );
};

const BiblePassage = ({
  passage,
  section,
  onStartMemorize,
}: {
  passage: BiblePassage;
  section: BiblePassage['sections'][number];
  onStartMemorize?: (passages: MemoryPassage[]) => void;
}) => {
  const startMemorizeSection = useCallback(() => {
    onStartMemorize?.(createMemoryPassagesFromBible({ passage, startSection: section }));
  }, [section]);

  return (
    <>
      <h3 style={{ marginTop: 32, fontWeight: `bold` }}>
        {section.header}
        <span style={{ fontSize: `0.7em` }}> {section.passageReference}</span>
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
  onStartMemorize,
}: {
  passage: BiblePassage;
  verse: BiblePassage['sections'][number]['verses'][number];
  onStartMemorize?: (passages: MemoryPassage[]) => void;
}) => {
  const startMemorizeVerse = useCallback(() => {
    onStartMemorize?.(createMemoryPassagesFromBible({ passage, startVerse: verse }));
  }, [verse]);

  return (
    <>
      <button style={{ margin: 0, padding: 0, background: `unset`, border: `unset` }} onClick={startMemorizeVerse}>
        🧠
      </button>
      <span>{verse.text}</span>
    </>
  );
};
