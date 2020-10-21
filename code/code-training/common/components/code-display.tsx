import { isAbsolute } from 'path';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native-lite';
import { CodePart } from './code-editor-helpers';

export type CodeDisplayPart = CodePart;
export type CodeDisplayInputOptions = {
    isActive?: boolean;
    cursorIndex?: number;
    activeIndex?: number;
    promptIndex?: number;
    prompt?: CodeDisplayPrompt;
    feedback?: CodeDisplayFeedback;
    autoComplete?: { textCompleted: string, text: string, isSelected: boolean, isWrong: boolean }[];
    onAutocomplete?: (value: string) => void;
};
export const CodeDisplay = ({ codeParts, language, inputOptions }: {
    codeParts: CodeDisplayPart[];
    language: string;
    inputOptions?: CodeDisplayInputOptions;
}) => {

    const Cursor = useMemo(() => <CursorComponent isActive={inputOptions?.isActive ?? false} />, [inputOptions?.isActive]);

    console.log(`CodeDisplay`, { inputOptions, codeParts });
    return (
        <View>
            <pre style={{ margin: 0, paddingBottom: inputOptions ? 100 : 0 }} className={`language-${language}`}>
                <code className={`language-${language}`}>
                    <CodeSpan key='-1' code={{ code: `\n`, index: -1, indexAfterEnd: 0, length: 1, classes: [], isInSelection: false }} Cursor={Cursor} inputOptions={inputOptions ?? {}} />
                    {codeParts.map(x => (
                        <CodeSpan key={`${x.code}:${x.index}:${x.code.length}`} code={x} Cursor={Cursor} inputOptions={inputOptions ?? {}} />
                    ))}
                </code>
            </pre>
        </View>
    );
};

const CodeSpan = ({ code, Cursor, inputOptions }: { code: CodeDisplayPart, Cursor: JSX.Element, inputOptions: CodeDisplayInputOptions }) => {
    const { cursorIndex, activeIndex = inputOptions.cursorIndex, promptIndex } = inputOptions;

    const hasCursor = !!(cursorIndex != null
        && cursorIndex >= code.index
        && cursorIndex < code.index + code.code.length
    );
    const hasActive = !!(activeIndex != null
        && activeIndex >= code.index
        && activeIndex < code.index + code.code.length
    );
    const hasPrompt = !!(promptIndex != null
        && promptIndex >= code.index
        && promptIndex < code.index + code.code.length
    );
    return (
        <>
            {hasCursor && Cursor}
            {hasActive && (
                <>
                    <AutoCompleteComponent inputOptions={inputOptions} />
                </>
            )}
            {hasPrompt && (
                <>
                    <PromptComponent inputOptions={inputOptions} />
                </>
            )}
            {!code.onPress && (
                <span className={code.classes.join(` `)} style={!code.isInSelection ? { opacity: 0.5 } : {}} >{`${code.code}`}</span>
            )}
            {code.onPress && (
                <TouchableOpacity style={{ display: `inline` }} onPress={() => code.onPress?.(code)}>
                    <span className={code.classes.join(` `)} style={!code.isInSelection ? { opacity: 0.5 } : {}} >{`${code.code}`}</span>
                </TouchableOpacity>
            )}

        </>
    );
};


const CursorComponent = ({ isActive }: { isActive: boolean }) => {
    const [cursorBlinkState, setCursorBlinkState] = useState(true);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCursorBlinkState(s => !s);
        }, 500);
        return () => {
            clearInterval(intervalId);
        };
    }, []);
    return (
        <span style={{ display: `inline-block`, width: 0, margin: 0, position: `relative`, left: -4, opacity: isActive ? 1 : 0.5 }}>{cursorBlinkState ? ` ` : `|`}</span>
    );
};

const autoCompleteStyles = {
    wrapper: { display: `inline-block`, position: `relative`, top: 4, width: 0 },
    inner: { display: `block`, position: `absolute`, zIndex: 100, background: `#000000`, border: `solid 1 #CCCCFF` },
    item: { display: `block`, padding: 4, color: `#FFFFFF` },
    item_selected: { display: `block`, padding: 4, color: `#CCCCFF`, background: `#111133`, minWidth: 60 },
    textCompleted: { color: `#CCCCFF`, opacity: 0.5 },
    textNew: { color: `#CCCCFF` },
} as const;

const AutoCompleteComponent = ({ inputOptions }: { inputOptions: CodeDisplayInputOptions }) => {
    const { autoComplete } = inputOptions;
    if (!autoComplete) { return (<></>); }

    const s = autoCompleteStyles;
    console.log(`AutoCompleteComponent`, { autoComplete });
    return (
        <>
            <span style={s.wrapper}>
                <span style={s.inner}>
                    {autoComplete.map(x => (
                        <TouchableOpacity key={x.text} onPress={() => { inputOptions.onAutocomplete?.(x.text); }}>
                            <span style={x.isSelected ? s.item_selected : s.item}>
                                <span style={s.textCompleted}>{x.isWrong ? `❌ ` : ``}{x.textCompleted}</span>
                                <span style={s.textNew}>{x.text}</span>
                            </span>
                        </TouchableOpacity>
                    ))}
                </span>
            </span>
        </>
    );
};

const promptStyles = {
    wrapper: {
        position: `relative`,
        background: `#111111`,
        margin: 4,
        padding: 4,
        marginLeft: 20,
        borderRadius: 4,
        border: `1px solid #555555`,
        // Remove extra line
        marginBottom: -16,
    },
    text: { whiteSpace: `pre-wrap` },
    text_positive: { whiteSpace: `pre-wrap`, color: `#88FF88` },
    text_negative: { whiteSpace: `pre-wrap`, color: `#FF8888` },
    emoji: { position: `absolute`, fontSize: 20, left: -24, top: 0 },
} as const;

export type CodeDisplayFeedback = {
    message: string;
    emoji: string;
    timestamp: number;
    isNegative?: boolean;
    timeoutMs?: number;
};
export type CodeDisplayPrompt = {
    message: string;
    emoji: string;
    timestamp: number;
    timeout?: number;
};
const PromptComponent = ({ inputOptions }: { inputOptions: CodeDisplayInputOptions }) => {
    const { prompt: promptRaw, feedback } = inputOptions;

    // Feedback
    const [hideFeedback, setHideFeedback] = useState(true);
    useEffect(() => {
        setHideFeedback(false);

        const id = setTimeout(() => {
            setHideFeedback(true);
        }, feedback?.timeoutMs ?? 3000);

        return () => {
            clearTimeout(id);
        };
    }, [feedback]);

    const showFeedback = feedback && !hideFeedback;
    const s = promptStyles;
    const textStyle = showFeedback && feedback ? (feedback.isNegative ? s.text_negative : s.text_positive) : s.text;
    const prompt = showFeedback ? feedback : promptRaw;
    if (!prompt) { return <></>; }
    return (
        <>
            <div style={s.wrapper} >
                <div style={s.emoji}>{prompt.emoji}</div>
                <span style={textStyle}>{prompt.message}</span>
            </div>
        </>
    );
};
