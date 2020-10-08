import React, { } from 'react';
import { View } from 'react-native-lite';
import { CodePart } from './code-editor-helpers';

export type CodeDisplayPart = CodePart;
export const CodeDisplay = ({ codeParts, language }: { codeParts: CodeDisplayPart[], language: string, cursorIndex?: number }) => {
    return (
        <View>
            <pre style={{ margin: 0 }} className={`language-${language}`}>
                <code className={`language-${language}`}>
                    {codeParts.map(x => (
                        <CodeSpan key={`${x.code}:${x.index}:${x.code.length}`} code={x} />
                    ))}
                </code>
            </pre>
        </View>
    );
};

const CodeSpan = ({ code, cursorIndex }: { code: CodeDisplayPart, cursorIndex?: number }) => {
    if (cursorIndex
        && cursorIndex >= code.index
        && cursorIndex < code.index + code.code.length
    ) {
        return <CodeSpanWithCursor code={code} cursorIndex={cursorIndex} />;
    }
    return (
        <span className={code.classes.join(` `)} style={!code.isInSelection ? { opacity: 0.5 } : {}}>{code.code.toString()}</span>
    );
};

const CodeSpanWithCursor = ({ code, cursorIndex }: { code: CodeDisplayPart, cursorIndex: number }) => {
    return (
        <span className={code.classes.join(` `)} style={!code.isInSelection ? { opacity: 0.5 } : {}} >{code.code.toString()}</span>
    );
};
