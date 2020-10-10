import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-lite';

const styles = {
    mainView: {
        flexDirection: `row`,
        flexWrap: `wrap`,
        alignItems: 'center',
    },
    mainView_column: {
        flexDirection: `column`,
    },
    tabView: {
        background: `#1e1e1e`,
        // alignSelf: `flex-start`,
        padding: 4,
        marginRight: 1,
    },
    tabView_selected: {
        background: `#292a2d`,
        // alignSelf: `flex-start`,
        padding: 4,
        marginRight: 1,
    },
    tabText: {
        fontSize: 14,
    },
    tabText_selected: {
        fontSize: 14,
        color: `#FFFF88`,
    },
    headerTabView: {
        flexDirection: 'row',
        alignItems: 'center',
        // background: `#1e1e1e`,
        // alignSelf: `flex-start`,
        padding: 4,
        marginRight: 1,
    },
    headerTabText: {
        fontSize: 14,
    },
} as const;

export const TabsComponent = <T extends {}>({
    items,
    getLabel,
    getKey,
    selected,
    onChange,
    onAdd,
    onDelete,
    header,
    style,
}: {
    items: T[];
    getLabel: (item: T) => string;
    getKey: (item: T, index: number) => string;
    selected?: T;
    onChange: (selected: T) => void;
    onAdd?: () => void;
    onDelete?: () => void;
    header?: string;
    style?: {
        selectedTabText?: { color?: string };
    };
}) => {
    const [mode, setMode] = useState('row' as 'row' | 'column');

    return (
        <View style={mode === 'row' ? styles.mainView : styles.mainView_column}>

            {!!header && (
                <TouchableOpacity onPress={() => setMode(s => s === 'row' ? 'column' : 'row')}>
                    <View style={styles.headerTabView}>
                        <Text style={styles.tabText}>{`${mode === 'row' ? `↔ ` : `↕ `}`}</Text>
                        <Text style={styles.headerTabText}>{`${header}`}</Text>
                    </View>
                </TouchableOpacity>
            )}

            {items.map((x, i) => (
                <TouchableOpacity key={getKey(x, i)} onPress={() => onChange(x)}>
                    <View style={x === selected ? styles.tabView_selected : styles.tabView}>
                        <Text style={x === selected ? { ...styles.tabText_selected, ...style?.selectedTabText } : { ...styles.tabText }}>{`${getLabel(x)}`}</Text>
                    </View>
                </TouchableOpacity>
            ))}
            <View style={{ flex: 1, flexDirection: `row` }}>
                {onAdd && (
                    <>
                        <TouchableOpacity onPress={() => onAdd()}>
                            <View style={styles.tabView}>
                                <Text style={styles.tabText}>{`${`➕`} Add`}</Text>
                            </View>
                        </TouchableOpacity>
                    </>
                )}
                <View style={{ flex: 1 }} />
                {onDelete && (
                    <TouchableOpacity onPress={() => onDelete()}>
                        <View style={styles.tabView}>
                            <Text style={styles.tabText}>{`${`❌`} Delete`}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
