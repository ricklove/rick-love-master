import React, { useLayoutEffect, useState } from 'react';
import { Text } from '@react-three/drei';
import { filter, interval, map } from 'rxjs';

const formatDetails = (details?: unknown): string => {
  // eslint-disable-next-line eqeqeq
  if (details == undefined) {
    return ``;
  }
  if (Array.isArray(details)) {
    return details.map((x) => formatDetails(x)).join(`,`);
  }
  if (typeof details === `object`) {
    return `{${Object.entries(details)
      .map(([k, v]) => `${k}:${formatDetails(v)}`)
      .join(`,`)}}`;
  }
  if (typeof details === `number`) {
    return details.toFixed(2);
  }
  return String(details);
};

const logState = [] as string[];
const log = (message: string, details?: unknown) => {
  const d = formatDetails(details);
  console.log(message, d);
  logState.unshift(`${logState.length} ${Date.now() % 1000000}: ${message} ${d}`);
};

export const logger = {
  log,
  logState,
};

export const DebugConsole = ({ maxLines = 10 }: { maxLines?: number }) => {
  const [text, setText] = useState(``);

  useLayoutEffect(() => {
    interval(100)
      .pipe(
        filter(() => !!logger.logState),
        map(() => `${logger.logState.slice(0, maxLines).join(`\n`)}`),
      )
      .subscribe(setText);
  }, []);

  return <Text>{text}</Text>;
};
