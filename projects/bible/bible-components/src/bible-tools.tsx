import React from 'react';
import { BibleMemoryProto } from './bible-memory-proto';
import { BibleReaderView } from './bible-reader';
import { BibleServiceConfig } from './bible-service';
import { UserProgressConfig } from './user-data';

export type BibleToolsConfig = BibleServiceConfig & UserProgressConfig;
export const BibleToolsRoot = ({ config }: { config: BibleToolsConfig }) => {
  return (
    <>
      <BibleMemoryProto />
      <BibleReaderView config={config} />
    </>
  );
};
