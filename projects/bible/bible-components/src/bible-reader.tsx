import React, { useMemo, useState } from 'react';
import { useCallback } from 'react';
import { C } from '@ricklove/react-controls';
import { useAsyncWorker } from '@ricklove/utils-react';
import { BiblePassage, BibleServiceConfig, createBibleService } from './bible-service';

export const BibleReaderView = ({ config }: { config: BibleServiceConfig }) => {
  const [passageRef, setPassageRef] = useState(``);
  const [passage, setPassage] = useState(undefined as undefined | BiblePassage);
  const bibleService = useMemo(() => createBibleService(config), []);

  const changePassageRef = useCallback((e: { target: { value: string } }) => {
    setPassageRef(e.target.value);
  }, []);

  const { loading, error, doWork } = useAsyncWorker();
  const loadPassage = useCallback(() => {
    doWork(async (stopIfObsolete) => {
      const result = await bibleService.getPassage(passageRef);
      stopIfObsolete();
      setPassage(result);
    });
  }, [passageRef]);

  return (
    <>
      <div style={{ margin: 4, padding: 4, background: `#EEEEEE`, minHeight: 100 }}>
        <C.Loading loading={loading} />
        <C.ErrorBox error={error} />
        <input type='text' value={passageRef} onChange={changePassageRef} />
        <button onClick={loadPassage}>Load</button>
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
            <React.Fragment key={s.header}>
              <h3 style={{ marginTop: 32, fontWeight: `bold` }}>{s.header}</h3>
              <div style={{ whiteSpace: `pre-wrap` }}>{s.verses.map((x) => x.text).join(``)}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};
