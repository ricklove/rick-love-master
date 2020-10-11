import React, { useEffect, useState } from 'react';
import { View } from 'react-native-lite';
import { randomItem } from 'utils/random';
import { LessonData, LessonProjectFileSelection } from '../lesson-types';
import { CodePart, CodePartsData, getCodeParts } from './code-editor-helpers';
import { CodeDisplay, CodeDisplayFeedback, CodeDisplayPrompt } from './code-display';
import { badEmojis, goodEmojis } from './emojis';

export const LessonFileContentEditor_UnderstandCode = ({ code, language, selection, onDone, lessonData }: {
    code: string;
    language: 'tsx';
    selection?: LessonProjectFileSelection;
    onDone: () => void;
    lessonData: LessonData;
}) => {
    const [codeParts, setCodeParts] = useState(null as null | CodePartsData);
    type FillInBlankProblem = { textWithBlanks: string, textWithoutBlanks: string };
    const [fillInBlanks, setFillInBlanks] = useState(null as null | FillInBlankProblem[]);
    const [fillInBlank, setFillInBlank] = useState(null as null | FillInBlankProblem);
    const [feedback, setFeedback] = useState(null as null | CodeDisplayFeedback);

    useEffect(() => {
        const parts = getCodeParts(code, language, selection);
        setCodeParts(parts);

        // Create fill in blank description
        const descriptionsWithBlanks = lessonData.descriptions.map(x => {
            let d = x;
            parts.codeParts
                .filter(c => c.code.trim().length >= 3)
                .forEach(c => { d = d.replace(c.code, `___`); });
            return {
                textWithBlanks: d,
                textWithoutBlanks: x,
            };
        });
        setFillInBlanks(descriptionsWithBlanks);
        setFillInBlank(descriptionsWithBlanks[0] ?? null);

    }, [code]);

    const onPressCodePart = (part: CodePart) => {
        if (!fillInBlank || !fillInBlanks) { return; }

        const iBlank = fillInBlank.textWithBlanks.indexOf(`___`);
        const withoutBlank = fillInBlank.textWithBlanks.replace(`___`, part.code);
        const isCorrect = withoutBlank.startsWith(fillInBlank.textWithoutBlanks.substr(0, iBlank + part.length));

        console.log(`onPressCodePart`, { part, iBlank, withoutBlank, isCorrect, fillInBlank });

        if (!isCorrect) {
            setFeedback({ isNegative: true, emoji: randomItem(badEmojis), message: `❌ ${randomItem([`Wrong`, `Incorrect`, `No`, `Try Again`])}`, timestamp: Date.now() });
            return;
        }

        setFeedback({ emoji: randomItem(goodEmojis), message: `✔`, timestamp: Date.now() });

        if (!withoutBlank.includes(`___`)) {
            // Done
            const remaining = fillInBlanks.filter(x => x.textWithoutBlanks !== fillInBlank.textWithoutBlanks);
            setFillInBlanks(remaining);
            setFillInBlank(remaining[0] ?? null);

            if (remaining.length <= 0) {
                onDone();
            }

            return;
        }

        setFillInBlank({
            textWithoutBlanks: withoutBlank,
            textWithBlanks: fillInBlank.textWithBlanks,
        });
    };

    if (!codeParts) { return <></>; }

    const s = selection ?? { index: 0, length: code.length };
    const promptIndex = code.lastIndexOf(`\n`, code.lastIndexOf(`\n`, s.index) - 1);
    const activeCodeParts = codeParts.codeParts.map(x => ({ ...x, onPress: onPressCodePart }));
    const activePrompt: CodeDisplayPrompt = {
        emoji: fillInBlank ? `🤔` : randomItem(goodEmojis),
        message: fillInBlank ? `${fillInBlank.textWithBlanks}\r\n\r\n🔎 Select the correct word below` : `${lessonData.descriptions.map(x => `✅ ${x}`).join(`\r\n`)}`,
        timestamp: Date.now(),
    };
    return (
        <>
            <View style={{ position: `relative` }}>
                <View>
                    <CodeDisplay codeParts={activeCodeParts} language={language} inputOptions={{
                        prompt: activePrompt,
                        promptIndex,
                        feedback: feedback ?? undefined,
                    }} />
                </View>
            </View>
        </>
    );
};
