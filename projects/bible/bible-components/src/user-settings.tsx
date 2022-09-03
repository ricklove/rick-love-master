import React, { useCallback, useEffect, useState } from 'react';
import { C } from '@ricklove/react-controls';
import { useAsyncWorker } from '@ricklove/utils-react';
import { UserProgressService } from './user-data';
export const UserSettings = <T extends Record<string, unknown>>({
  onChange,
  userProgressServiceRef,
}: {
  onChange?: (value: T | undefined) => void;
  userProgressServiceRef: { current: UserProgressService<T> };
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => setExpanded((s) => !s), []);

  const { loading, error, doWork } = useAsyncWorker();
  const [progressCode, setProgressCode] = useState(``);
  const [progressUrl, setProgressUrl] = useState(``);

  useEffect(() => {
    doWork(async (stopIfObsolete) => {
      // Load url progress code
      const urlProgressCode = window.location.search.match(/p=([\w-]+)/)?.[1];

      // Load url progress code
      if (urlProgressCode) {
        try {
          console.log(`Loading from share code`, { urlProgressCode });
          await userProgressServiceRef.current.loadShareCode({ shareCode: urlProgressCode });
        } catch (err) {
          console.error(`SKIP: The share code was invalid - perhaps it has already been used`, { urlProgressCode });
        }
        window.history.replaceState(undefined, ``, `./`);
        return;
      }
    });
  }, []);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    doWork(async (stopIfObsolete) => {
      const result = await userProgressServiceRef.current.createShareCode({ temporaryShareCode: true });
      stopIfObsolete();
      setProgressCode(result.shareCode);

      const result2 = await userProgressServiceRef.current.createShareCode({ temporaryShareCode: false });
      stopIfObsolete();
      setProgressUrl(`${location.href.split(`?`)[0]}?p=${result2.shareCode}`);
    });
  }, [expanded]);

  const changeProgressCode = useCallback(({ target: { value } }: { target: { value: string } }) => {
    setProgressCode(value);
  }, []);
  const saveProgressCode = useCallback(() => {
    doWork(async (stopIfObsolete) => {
      await userProgressServiceRef.current.loadShareCode({ shareCode: progressCode });
      stopIfObsolete();
      onChange?.(userProgressServiceRef.current.getUserData());
    });
  }, [progressCode]);

  const copyProgressUrl = useCallback(() => {
    (async () => await navigator.clipboard.writeText(progressUrl))();
  }, [progressUrl]);

  return (
    <>
      <button style={{ padding: 4, fontSize: 16, background: `unset` }} onClick={toggleExpanded}>{`⚙`}</button>
      {expanded && (
        <div style={{ width: `100%` }}>
          <C.Loading loading={loading} />
          <C.ErrorBox error={error} />

          {/* <div>Edit Progress:</div>
          <div
            style={{
              display: `flex`,
              flexDirection: `row`,
              alignItems: `center`,
            }}
          >
            <label>Read</label>
            <input
              style={{ marginLeft: 4, padding: 4, fontSize: 16 }}
              type='text'
              value={hashValue}
              onChange={changeHashValue}
            />
            <button style={{ marginLeft: 4, padding: 4, alignSelf: `stretch` }} onClick={saveHashValue}>
              Save
            </button>
          </div> */}
          <div
            style={{
              display: `flex`,
              flexDirection: `row`,
              alignItems: `center`,
            }}
          >
            <label>Progress Sync Code</label>
            <input
              style={{ marginLeft: 4, padding: 4, fontSize: 16 }}
              type='text'
              value={progressCode}
              onChange={changeProgressCode}
            />
            <button style={{ marginLeft: 4, padding: 4, alignSelf: `stretch` }} onClick={saveProgressCode}>
              Save
            </button>
          </div>
          <div
            style={{
              display: `flex`,
              flexDirection: `row`,
              alignItems: `center`,
            }}
          >
            <label>Progress Sync Url - Permanent</label>
            <input
              style={{ marginLeft: 4, padding: 4, fontSize: 16 }}
              type='text'
              value={progressUrl}
              disabled={true}
            />
            <button style={{ marginLeft: 4, padding: 4, alignSelf: `stretch` }} onClick={copyProgressUrl}>
              Copy
            </button>
          </div>
        </div>
      )}
    </>
  );
};
