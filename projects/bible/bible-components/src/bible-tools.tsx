import React from 'react';
import { UserProgressConfig } from './user-data';

export type BibleToolsConfig = {} & UserProgressConfig;
export const BibleToolsRoot = ({ config }: { config: BibleToolsConfig }) => {
  return (
    <>
      <div>Bible Tools!</div>
    </>
  );
};
