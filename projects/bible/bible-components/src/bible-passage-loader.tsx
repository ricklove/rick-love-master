import React, { useMemo, useState } from 'react';
import { useCallback } from 'react';
import { C } from '@ricklove/react-controls';
import { useAsyncWorker } from '@ricklove/utils-react';
import { BiblePassage, BibleServiceConfig, createBibleService } from './bible-service';

export const useBiblePassageLoader = ({
  config,
  onPassageLoaded,
}: {
  config: BibleServiceConfig;
  onPassageLoaded: (passage: BiblePassage) => void;
}) => {
  const bibleService = useMemo(() => createBibleService(config), []);
  const { loading, error, doWork } = useAsyncWorker();
  const loadPassage = (passageReference: string) => {
    doWork(async (stopIfObsolete) => {
      const result = await bibleService.getPassage(passageReference);
      stopIfObsolete();
      onPassageLoaded(result);
    });
  };

  return {
    loading,
    error,
    loadPassage,
  };
};

export const BiblePassageLoader = ({
  config,
  onPassageLoaded,
}: {
  config: BibleServiceConfig;
  onPassageLoaded: (passage: BiblePassage) => void;
}) => {
  const [passageReference, setPassageReference] = useState(``);
  const changePassageReference = useCallback((e: { target: { value: string } }) => {
    setPassageReference(e.target.value);
  }, []);

  const { loading, error, loadPassage: loadPassageInner } = useBiblePassageLoader({ config, onPassageLoaded });
  const loadPassage = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      loadPassageInner(passageReference);
    },
    [passageReference],
  );

  return (
    <>
      <C.Loading loading={loading} />
      <C.ErrorBox error={error} />
      <form onSubmit={loadPassage}>
        <input type='text' value={passageReference} onChange={changePassageReference} autoFocus />
        <button onClick={loadPassage}>Load</button>
      </form>
    </>
  );
};
