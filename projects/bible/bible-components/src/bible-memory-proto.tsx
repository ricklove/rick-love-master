import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { createMemoryRuntimeService, MemoryPassage, MemoryRuntimeService } from './bible-memory-proto-dom';
import { bibleMemoryProtoPassages } from './bible-memory-proto-passages';

export const BibleMemoryProto = () => {
  const hostRef = useRef(null as null | HTMLDivElement);
  const bibleMemoryRef = useRef(undefined as undefined | MemoryRuntimeService);
  useEffect(() => {
    bibleMemoryRef.current = createMemoryRuntimeService();
    return () => {
      if (bibleMemoryRef.current?.isActive) {
        bibleMemoryRef.current.stop();
        bibleMemoryRef.current = undefined;
      }
      if (hostRef.current) {
        hostRef.current.textContent = ``;
      }
    };
  }, [hostRef.current]);

  const startBibleMemory = useCallback((value: MemoryPassage) => {
    if (!hostRef.current) {
      return;
    }
    if (!bibleMemoryRef.current) {
      return;
    }

    bibleMemoryRef.current.start(hostRef.current, value);
  }, []);

  return (
    <>
      <div
        style={{
          background: `#000000`,
          color: `#FFFFFF`,
        }}
      >
        {bibleMemoryProtoPassages.map((x) => (
          <React.Fragment key={x.title}>
            <MemoryPassageButton value={x} onClick={startBibleMemory} />
          </React.Fragment>
        ))}
        <div ref={hostRef} />
      </div>
    </>
  );
};

const MemoryPassageButton = ({ value, onClick }: { value: MemoryPassage; onClick: (value: MemoryPassage) => void }) => {
  const start = useCallback(() => {
    onClick(value);
  }, [value]);

  return (
    <>
      <button
        style={{
          padding: 4,
          margin: 4,
          background: `#444444`,
          color: `#FFFFFF`,
        }}
        onClick={start}
      >
        {value.title}
      </button>
    </>
  );
};
