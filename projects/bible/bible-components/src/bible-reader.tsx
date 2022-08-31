import React, { useMemo, useState } from 'react';
import { useCallback } from 'react';
import { C } from '@ricklove/react-controls';
import { useAsyncWorker } from '@ricklove/utils-react';
import { MemoryPassage } from './bible-memory-types';
import { BiblePassage, BibleServiceConfig, createBibleService } from './bible-service';

export const BiblePassageLoader = ({
  config,
  onPassageLoaded,
}: {
  config: BibleServiceConfig;
  onPassageLoaded: (passage: BiblePassage) => void;
}) => {
  const [passageRef, setPassageRef] = useState(``);
  const bibleService = useMemo(() => createBibleService(config), []);

  const changePassageRef = useCallback((e: { target: { value: string } }) => {
    setPassageRef(e.target.value);
  }, []);

  const { loading, error, doWork } = useAsyncWorker();
  const loadPassage = useCallback(() => {
    doWork(async (stopIfObsolete) => {
      const result = await bibleService.getPassage(passageRef);
      stopIfObsolete();
      onPassageLoaded(result);
    });
  }, [passageRef]);

  return (
    <>
      <C.Loading loading={loading} />
      <C.ErrorBox error={error} />
      <input type='text' value={passageRef} onChange={changePassageRef} />
      <button onClick={loadPassage}>Load</button>
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
  return (
    <>
      <div style={{ margin: 4, padding: 4, background: `#EEEEEE`, minHeight: 100 }}>
        <div>
          <div>
            <h2>
              {passage?.passageReference}
              <span style={{ fontSize: `0.5em` }} title={passage?.copyright.long}>
                &nbsp;{passage?.copyright.short}
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
  const startMemorize = useCallback(() => {
    const sectionsToMemorize = passage.sections.slice(section.index);
    onStartMemorize?.(
      sectionsToMemorize.map((s) => ({
        title: `${s.passageRef}`,
        //title: `${s.passageRef} - ${s.header}`,
        text: `${s.passageRef} - ${s.header}\n\n${s.verses.map((v) => v.text).join(``)}`,
        lang: `en-US`,
      })),
    );
  }, [section]);

  return (
    <>
      <h3 style={{ marginTop: 32, fontWeight: `bold` }}>
        {section.header}
        <span style={{ fontSize: `0.7em` }}> {section.passageRef}</span>
        {onStartMemorize && <button onClick={startMemorize}>Memorize</button>}
      </h3>
      <div style={{ whiteSpace: `pre-wrap` }}>
        {section.verses
          //.map((x) => `[${x.chapterRef}:${x.verseRef}]${x.text}`)
          .map((x) => x.text)
          .join(``)}
      </div>
    </>
  );
};
