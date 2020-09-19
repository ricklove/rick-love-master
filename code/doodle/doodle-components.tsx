import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-lite';
import { DoodleDrawing, defaultDoodleDrawing, DoodleData } from './doodle';
import { DoodleDrawerView, DoodleDisplayView } from './doodle-view';
import { KeyboardSimplified } from './keyboard-simplified';

export const styles = {
    container: {
        alignItems: `center`,
    },
    drawing: {
        width: 312,
        height: 312,
        color: `#FFFFFF`,
        backgroundColor: `#000000`,
    },
    drawingChoicesView: {
        maxWidth: 312 + 4 * 4 + 4,
        flexDirection: `row`,
        flexWrap: `wrap`,
    },
    drawingChoiceWrapper: {
        padding: 4,
    },
    drawingChoice: {
        width: 78,
        height: 78,
        color: `#FFFFFF`,
        backgroundColor: `#000000`,
    },
    titleView: {
        justifyContent: `center`,
        alignItems: `center`,
    },
    titleText: {
        fontSize: 20,
        color: `#FFFFFF`,
    },
    promptView: {
        justifyContent: `center`,
        alignItems: `center`,
    },
    promptText: {
        fontSize: 20,
        color: `#FFFF00`,
    },
    hintText: {
        fontSize: 14,
        color: `#FFFF00`,
    },
    buttonRowView: {
        flexDirection: `row`,
    },
    buttonView: {
        margin: 4,
        padding: 8,
        backgroundColor: `#111111`,
    },
    buttonText: {
        fontSize: 20,
        color: `#FFFF00`,
    },
} as const;

export const DoodleGameView_DrawWord = (props: { prompt: string, hint?: string, onDone: (drawing: DoodleDrawing) => void, onSkip?: () => void }) => {
    const [drawing, setDrawing] = useState(defaultDoodleDrawing());
    const changeDoodle = (value: DoodleDrawing) => {
        setDrawing(value);
    };

    const done = () => {
        props.onDone(drawing);
    };
    const skip = () => {
        props.onSkip?.();
    };

    useEffect(() => {
        // Reset problem when prompt changes
        setDrawing(defaultDoodleDrawing());
    }, [props.prompt]);

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>Draw</Text>
            </View>
            <DoodleDrawerView style={styles.drawing} drawing={drawing} onChange={changeDoodle} />
            <View style={styles.promptView}>
                <Text style={styles.promptText}>{props.prompt}</Text>
                {!!props.hint && (<Text style={styles.hintText}>{props.hint}</Text>)}
            </View>
            <View style={styles.buttonRowView}>
                {!!props.onSkip && (
                    <TouchableOpacity onPress={skip}>
                        <View style={styles.buttonView}>
                            <Text style={styles.buttonText}>Skip</Text>
                        </View>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={done}>
                    <View style={styles.buttonView}>
                        <Text style={styles.buttonText}>Done</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const DoodleGameView_ChooseBest = (props: { prompt: string, drawings: DoodleData[], onChooseBest: (drawing: DoodleData) => void }) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>Choose Best</Text>
            </View>
            <View style={styles.promptView}>
                <Text style={styles.promptText}>{props.prompt}</Text>
            </View>
            <View style={styles.drawingChoicesView} >
                {props.drawings.map(x => (
                    <TouchableOpacity key={x.key} onPress={() => props.onChooseBest(x)}>
                        <View style={styles.drawingChoiceWrapper} >
                            <DoodleDisplayView style={styles.drawingChoice} drawing={x.drawing} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const typeStyles = {
    completedText: {
        fontSize: 16,
        color: `#FFFF00`,
    },
} as const;
export const DoodleGameView_TypeExpected = (props: { prompt: string, drawings: DoodleData[], onDone: () => void, sayAgain: () => void }) => {

    const [status, setStatus] = useState({ completed: ``, remaining: props.prompt });
    useEffect(() => {
        setStatus({ completed: ``, remaining: props.prompt });
    }, [props.prompt, props.drawings]);

    const onExpectedKeyPress = () => {
        setStatus(s => {
            if (s.remaining.length <= 1) {
                props.onDone();
            }
            const nextChar = s.remaining[0];
            return {
                completed: s.completed + nextChar,
                remaining: s.remaining.substr(1),
            };
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>Type Word</Text>
            </View>
            <View style={styles.drawingChoicesView} >
                {props.drawings.map(x => (
                    <View key={x.key} style={styles.drawingChoiceWrapper} >
                        <DoodleDisplayView style={styles.drawingChoice} drawing={x.drawing} />
                    </View>
                ))}
            </View>
            <TouchableOpacity onPress={props.sayAgain}>
                <View style={styles.buttonView}>
                    <Text style={styles.buttonText}>Say Again</Text>
                </View>
            </TouchableOpacity>
            <View>
                <Text style={typeStyles.completedText}>{`${status.completed}${status.remaining.length > 0 ? `_` : ``}`}</Text>
            </View>
            <KeyboardSimplified expectedCharacter={status.remaining[0] ?? ` `} showHints onExpectedKeyPress={onExpectedKeyPress} />
        </View>
    );
};
