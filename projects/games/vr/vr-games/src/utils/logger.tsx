import React, { useLayoutEffect, useState } from 'react';
import { Text } from '@react-three/drei';
import { filter, interval, map } from 'rxjs';

const formatDetails = (details: unknown, depth: number): string => {
  if (!depth) {
    return ``;
  }
  if (details == null) {
    return ``;
  }
  if (Array.isArray(details)) {
    return `[${details.map((x) => formatDetails(x, depth - 1)).join(`,`)}]`;
  }
  if (typeof details === `object`) {
    return `{${Object.entries(details as Record<string, unknown>)
      .map(([k, v]) => `${k}:${formatDetails(v, depth - 1)}`)
      .join(`,`)}}`;
  }
  if (typeof details === `number`) {
    return details.toFixed(2);
  }
  return String(details);
};

const logState = [] as string[];
const log = (message: string, details?: unknown) => {
  const d = formatDetails(details, 3);
  console.log(message, { details, d });
  logState.unshift(`${logState.length} ${Date.now() % 1000000}: ${message} ${d}`);
};

export const logger = {
  log,
  logState,
};

export const DebugConsole = ({ maxLines = 10, visible = true }: { maxLines?: number; visible?: boolean }) => {
  const [text, setText] = useState(``);

  useLayoutEffect(() => {
    interval(100)
      .pipe(
        filter(() => !!logger.logState),
        map(
          () =>
            `${logger.logState
              .slice(0, maxLines)
              .map((x) => x.substring(0, 100))
              .join(`\n`)}`,
        ),
      )
      .subscribe(setText);
  }, []);

  return (
    <Text visible={visible} fontSize={0.1}>
      {text}
    </Text>
  );
};
