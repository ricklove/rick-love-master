import React, { useCallback, useState } from 'react';
import { BibleHeatmapView } from './bible-heatmap';
import { BibleMemoryHost } from './bible-memory-proto';
import { MemoryPassage } from './bible-memory-types';
import { BiblePassageLoader, BibleReaderView } from './bible-reader';
import { BiblePassage, BibleServiceConfig } from './bible-service';
import { UserProgressConfig } from './user-data';

export type BibleToolsConfig = BibleServiceConfig & UserProgressConfig;
export const BibleToolsRoot = ({ config }: { config: BibleToolsConfig }) => {
  const [tab, setTab] = useState(`reader` as 'reader' | 'heatmap');

  const [passage, setPassage] = useState(undefined as undefined | BiblePassage);
  const changePassage = useCallback((value: BiblePassage) => {
    setPassage(value);
    setMemoryPassages(undefined);
  }, []);
  const [memoryPassages, setMemoryPassages] = useState(undefined as undefined | MemoryPassage[]);
  const startMemorize = useCallback((passages: MemoryPassage[]) => {
    setMemoryPassages(passages);
  }, []);

  return (
    <>
      <div style={{ background: `#333333`, color: `#FFFFFF` }}>
        <button onClick={() => setTab(`reader`)}>Read & Memorize</button>
        <button onClick={() => setTab(`heatmap`)}>Progress</button>
      </div>
      {tab === `reader` && (
        <>
          <BiblePassageLoader config={config} onPassageLoaded={changePassage} />
          {memoryPassages && (
            <div style={{ background: `#000000`, minHeight: `100vh` }}>
              <BibleMemoryHost passages={memoryPassages} />
            </div>
          )}
          {!memoryPassages && passage && <BibleReaderView passage={passage} onStartMemorize={startMemorize} />}
        </>
      )}
      {tab === `heatmap` && (
        <>
          <BibleHeatmapView />
        </>
      )}
    </>
  );
};
