import React, { useEffect, useState } from 'react';
import { LessonData, LessonProjectFileSelection } from '@ricklove/code-training-lesson-common';
import { View } from '@ricklove/react-native-lite';
import { randomItem } from '@ricklove/utils-core';
import { CodeDisplay, CodeDisplayFeedback, CodeDisplayPrompt } from './code-display';
import { CodePart, CodePartsData, getCodeParts } from './code-editor-helpers';
import { badEmojis, goodEmojis } from './emojis';

export const LessonFileContentEditor_UnderstandCode = ({
  code,
  language,
  selection,
  onDone,
  lessonData,
}: {
  code: string;
  language: 'tsx';
  selection?: LessonProjectFileSelection;
  onDone: () => void;
  lessonData: LessonData;
}) => {
  const [codeParts, setCodeParts] = useState(null as null | CodePartsData);
  type FillInBlankProblem = { textWithBlanks: string; textWithoutBlanks: string };
  const [fillInBlanks, setFillInBlanks] = useState(null as null | FillInBlankProblem[]);
  const [fillInBlank, setFillInBlank] = useState(null as null | FillInBlankProblem);
  const [feedback, setFeedback] = useState(null as null | CodeDisplayFeedback);

  useEffect(() => {
    const parts = getCodeParts(code, language, selection);
    setCodeParts(parts);

    // Create fill in blank description
    const descriptionsWithBlanks = lessonData.descriptions.map((x) => {
      let d = x;
      parts.codeParts
        .filter((c) => c.isInSelection)
        .map((c) => c.code.trim())
        .filter((c) => !!c)
        // Require a space around it
        .forEach((c) => {
          d = d.replace(` ${c} `, ` ___ `);
        });

      console.log(`LessonFileContentEditor_UnderstandCode - create fill in blank`, { parts, d, x });
      return {
        textWithBlanks: d,
        textWithoutBlanks: x,
      };
    });
    setFillInBlanks(descriptionsWithBlanks);
    setFillInBlank(descriptionsWithBlanks[0] ?? null);
  }, [code]);

  const onPressCodePart = (part: CodePart) => {
    if (!fillInBlank || !fillInBlanks) {
      return;
    }

    const iBlank = fillInBlank.textWithBlanks.indexOf(`___`);
    const nextWithBlanks = fillInBlank.textWithBlanks.replace(`___`, part.code.trim());
    const isCorrect = nextWithBlanks.startsWith(fillInBlank.textWithoutBlanks.substr(0, iBlank + part.length));

    console.log(`onPressCodePart`, { part, iBlank, withoutBlank: nextWithBlanks, isCorrect, fillInBlank });

    if (!isCorrect) {
      setFeedback({
        isNegative: true,
        emoji: randomItem(badEmojis),
        message: `❌ ${randomItem([`Wrong`, `Incorrect`, `No`, `Try Again`])}`,
        timestamp: Date.now(),
      });
      return;
    }

    setFeedback({
      emoji: randomItem(goodEmojis),
      message: `${nextWithBlanks}\r\n\r\n✔`,
      timestamp: Date.now(),
      timeoutMs: 1000,
    });

    if (!nextWithBlanks.includes(`___`)) {
      // Done
      const remaining = fillInBlanks.filter((x) => x.textWithoutBlanks !== fillInBlank.textWithoutBlanks);
      setFillInBlanks(remaining);
      setFillInBlank(remaining[0] ?? null);

      if (remaining.length <= 0) {
        onDone();
      }

      return;
    }

    setFillInBlank({
      textWithoutBlanks: fillInBlank.textWithoutBlanks,
      textWithBlanks: nextWithBlanks,
    });
  };

  if (!codeParts) {
    return <></>;
  }

  const s = selection ?? { index: 0, length: code.length };
  const promptIndex = code.lastIndexOf(`\n`, code.lastIndexOf(`\n`, s.index) - 1);
  const activeCodeParts = codeParts.codeParts.map((x) => ({ ...x, onPress: onPressCodePart }));
  const activePrompt: CodeDisplayPrompt = {
    emoji: fillInBlank ? `🤔` : randomItem(goodEmojis),
    message: fillInBlank
      ? `${fillInBlank.textWithBlanks}\r\n\r\n🔎 Select the correct word below`
      : `${lessonData.descriptions.map((x) => `✅ ${x}`).join(`\r\n`)}`,
    timestamp: Date.now(),
  };
  console.log(`LessonFileContentEditor_UnderstandCode render`, { fillInBlank, activePrompt });
  return (
    <>
      <View style={{ position: `relative` }}>
        <View>
          <CodeDisplay
            codeParts={activeCodeParts}
            language={language}
            inputOptions={{
              prompt: activePrompt,
              promptIndex,
              feedback: feedback ?? undefined,
            }}
          />
        </View>
      </View>
    </>
  );
};
