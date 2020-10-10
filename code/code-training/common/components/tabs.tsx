import React, { } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-lite';

const styles = {
    mainRowView: {
        flexDirection: `row`,
        flexWrap: `wrap`,
    },
    tabView: {
        background: `#1e1e1e`,
        alignSelf: `flex-start`,
        padding: 4,
        marginRight: 1,
    },
    tabView_selected: {
        background: `#292a2d`,
        alignSelf: `flex-start`,
        padding: 4,
        marginRight: 1,
    },
    tabText: {
        fontSize: 14,
        color: `#FFFFFFF`,
    },
    tabText_selected: {
        fontSize: 14,
        color: `#FFFF88`,
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
    style,
}: {
    items: T[];
    getLabel: (item: T) => string;
    getKey: (item: T, index: number) => string;
    selected?: T;
    onChange: (selected: T) => void;
    onAdd?: () => void;
    onDelete?: () => void;
    style?: {
        selectedTabText?: { color?: string };
    };
}) => {
    return (
        <View style={styles.mainRowView}>
            {items.map((x, i) => (
                <TouchableOpacity key={getKey(x, i)} onPress={() => onChange(x)}>
                    <View style={x === selected ? styles.tabView_selected : styles.tabView}>
                        <Text style={x === selected ? { ...styles.tabText_selected, ...style?.selectedTabText } : styles.tabText}>{getLabel(x)}</Text>
                    </View>
                </TouchableOpacity>
            ))}
            {onAdd && (
                <>
                    <TouchableOpacity onPress={() => onAdd()}>
                        <View style={styles.tabView}>
                            <Text style={styles.tabText}>{`${`➕`} Add`}</Text>
                        </View>
                    </TouchableOpacity>
                </>
            )}
            <View style={{ flex: 1, flexDirection: `row` }}>
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
