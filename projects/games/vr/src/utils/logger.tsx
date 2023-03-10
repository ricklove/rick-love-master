import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const logState = [] as string[];
const log = (message: string, details?: unknown) => {
  console.log(message, details);
  logState.unshift(`${logState.length} ${Date.now() % 1000000}: ${message} ${details ? JSON.stringify(details) : ``}`);
};

export const logger = {
  log,
  logState,
};

export const DebugConsole = ({ maxLines = 10 }: { maxLines?: number }) => {
  const [text, setText] = useState(``);

  useFrame(() => {
    setText(`${logger.logState.slice(0, maxLines).join(`\n`)}`);
  });

  return <Text>{text}</Text>;
};
