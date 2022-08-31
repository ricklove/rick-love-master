import React from 'react';
import { BibleMemoryProto } from './bible-memory-proto';
import { UserProgressConfig } from './user-data';

export type BibleToolsConfig = {} & UserProgressConfig;
export const BibleToolsRoot = ({ config }: { config: BibleToolsConfig }) => {
  return (
    <>
      <BibleMemoryProto />
    </>
  );
};
