import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { createMemoryRuntimeService, MemoryRuntimeService } from './bible-memory-proto-dom';
import { bibleMemoryProtoPassages } from './bible-memory-proto-passages';
import { MemoryPassage } from './bible-memory-types';

export const BibleMemoryProto = () => {
  const [passage, setPassage] = useState(undefined as undefined | MemoryPassage);

  const startBibleMemory = useCallback((value: MemoryPassage) => {
    setPassage(value);
  }, []);

  return (
    <>
      {bibleMemoryProtoPassages.map((x) => (
        <React.Fragment key={x.title}>
          <MemoryPassageButton value={x} onClick={startBibleMemory} />
        </React.Fragment>
      ))}
      <BibleMemoryHost passages={passage ? [passage] : []} />
    </>
  );
};

export const BibleMemoryHost = ({ passages }: { passages: undefined | MemoryPassage[] }) => {
  const [isStarted, setIsStarted] = useState(false);
  const activePassageRef = useRef(passages?.[0]);
  useEffect(() => {
    activePassageRef.current = passages?.[0];
    setIsStarted(false);
  }, [passages?.length, passages?.[0].title]);

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
  }, []);

  const gotoNextPassage = useCallback(() => {
    const passage = activePassageRef.current;
    const iPassage = passages?.findIndex((p) => p.text === passage?.text) ?? 0;
    const nextPassage = passages?.[iPassage + 1];

    console.log(`gotoNextPassage`, { passages, passage, iPassage, nextPassage });
    activePassageRef.current = nextPassage;

    if (!bibleMemoryRef.current) {
      return;
    }
    if (!nextPassage) {
      return;
    }
    bibleMemoryRef.current.setPassage(nextPassage);
  }, []);

  const startBibleMemory = useCallback(() => {
    if (!hostRef.current) {
      return;
    }
    if (!bibleMemoryRef.current) {
      return;
    }
    if (!activePassageRef.current) {
      return;
    }
    if (bibleMemoryRef.current.isActive()) {
      return;
    }

    bibleMemoryRef.current.start(hostRef.current, activePassageRef.current, gotoNextPassage);
    setIsStarted(true);
  }, []);

  const toggleHintMode = useCallback(() => {
    if (!bibleMemoryRef.current) {
      return;
    }
    bibleMemoryRef.current.toggleHintMode();
  }, []);

  return (
    <>
      <div
        style={{
          background: `#000000`,
          color: `#FFFFFF`,
        }}
      >
        {passages && !isStarted && (
          <button
            style={{
              background: `#444444`,
              color: `#FFFFFF`,
            }}
            onClick={startBibleMemory}
          >
            Start Memorizing
          </button>
        )}
        <div ref={hostRef} />
        {isStarted && (
          <button
            style={{
              background: `#444444`,
              color: `#FFFFFF`,
            }}
            onClick={toggleHintMode}
          >
            Toggle Hint Mode
          </button>
        )}
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
