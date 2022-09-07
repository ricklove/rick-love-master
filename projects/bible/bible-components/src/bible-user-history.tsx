import React from 'react';
import { useCallback } from 'react';
import { BiblePassageRangeString } from '@ricklove/bible-types';

type PassageHistory = { timestamp: number; passageRange: BiblePassageRangeString };
export const BibleUserHistoryView = ({
  history,
  onLoadPassage,
}: {
  history: PassageHistory[];
  onLoadPassage: (passageRange: BiblePassageRangeString) => void;
}) => {
  const historySorted = [...history].sort((a, b) => -(a.timestamp - b.timestamp));
  return (
    <>
      <div>
        {historySorted.map((x) => (
          <PassageHistoryView value={x} key={x.timestamp} onLoadPassage={onLoadPassage} />
        ))}
      </div>
    </>
  );
};

const PassageHistoryView = ({
  value,
  onLoadPassage,
}: {
  value: PassageHistory;
  onLoadPassage: (passageRange: BiblePassageRangeString) => void;
}) => {
  const loadPassage = useCallback(() => {
    onLoadPassage(value.passageRange);
  }, [value]);

  return (
    <div style={{ display: `flex`, flexDirection: `row`, padding: 4 }}>
      <div onClick={loadPassage}>{`📕`}</div>
      <div>{value.passageRange}</div>
      <div style={{ flex: 1 }} />
      <div>
        {new Date(value.timestamp).toDateString()} {new Date(value.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};
