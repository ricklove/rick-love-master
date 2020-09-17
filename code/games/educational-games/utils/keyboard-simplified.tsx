/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-lite';
import { shuffle } from 'utils/arrays';

const englishKeyboard = {
    rows: [
        { keys: `qwertyuiop`.split(``) },
        { keys: ` asdfghjkl`.split(``) },
        { keys: `  zxcvbnm `.split(``) },
    ],
};

const styles = {
    container: {},
    rowView: { flex: 1, flexDirection: `row` },
    keyView: {
        margin: 2,
        padding: 2,
        width: 20,
        height: 20,
        backgroundColor: `#111111`,
        justifyContent: `center`,
        alignItems: `center`,
    },
    keyView_disabled: { opacity: 0.5 },
    keyText: {
        fontSize: 16,
    },
    keyText_wrong: {
        fontSize: 16,
        color: `#FF0000`,
    },
} as const;

export const KeyboardSimplified = ({ expectedCharacter, showHints, onExpectedKeyPress }: { expectedCharacter: string, showHints: boolean, onExpectedKeyPress: () => void }) => {
    const keyboard = englishKeyboard;

    const [hintKeys, setHintKeys] = useState(null as null | string[]);
    const [wrongKeys, setWrongKeys] = useState([] as string[]);
    useEffect(() => {
        if (!showHints) { setHintKeys(null); }

        const hints = [expectedCharacter, ...shuffle(keyboard.rows.flatMap(x => x.keys).map(x => x.trim()).filter(x => x)).slice(0, 3)];
        setHintKeys(hints);
        setWrongKeys([]);
    }, [expectedCharacter, showHints]);

    const onKeyPress = (key: string) => {
        if (key === expectedCharacter) {
            onExpectedKeyPress();
            return;
        }
        // Remove from choices
        if (showHints) {
            setHintKeys(s => (s ?? []).filter(x => x !== key));
            setWrongKeys(s => [...s, key]);
        }
    };

    return (
        <>
            <View style={styles.container}>
                {keyboard.rows.map((row, iRow) => (
                    <View style={styles.rowView} key={`${iRow}`} >
                        {row.keys.map((k, i) => (
                            <TouchableOpacity key={`${k}${i}`} style={{ outline: `none` }} onPress={() => onKeyPress(k)}>
                                <View style={!hintKeys || hintKeys.includes(k) ? {} : styles.keyView_disabled} >
                                    <View style={styles.keyView}>
                                        <Text style={wrongKeys.includes(k) ? styles.keyText_wrong : styles.keyText}>{k}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </>
    );
};
