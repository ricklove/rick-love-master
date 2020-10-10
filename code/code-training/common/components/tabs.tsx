import { ifError } from 'assert';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-lite';

const styles = {
    mainView: {
        flexDirection: `row`,
        flexWrap: `wrap`,
        alignItems: `center`,
    },
    mainView_column: {
        flexDirection: `column`,
    },
    tabView: {
        flexDirection: `row`,
        alignItems: `center`,
        background: `#1e1e1e`,
        // alignSelf: `flex-start`,
        padding: 4,
        marginRight: 1,
    },
    tabView_selected: {
        flexDirection: `row`,
        alignItems: `center`,
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
        flexDirection: `row`,
        alignItems: `center`,
        // background: `#1e1e1e`,
        // alignSelf: `flex-start`,
        padding: 4,
        marginRight: 1,
    },
    headerTabText: {
        fontSize: 14,
    },
    moveButtonView: {
        minWidth: 24,
        justifyContents: `center`,
        alignItems: `center`,
    },
} as const;

export const TabsListEditorComponent = <T extends {}>({
    items,
    onChange,
    getLabel,
    getKey,
    selected,
    onSelect,
    onCreateNewItem,
    header,
    style,
}: {
    items: T[];
    onChange?: (items: T[]) => void;
    getLabel: (item: T) => string;
    getKey: (item: T, index: number) => string;
    selected?: T;
    onSelect: (selected: T) => void;
    onCreateNewItem: () => T;
    header?: string;
    style?: {
        selectedTabText?: { color?: string };
    };
}) => {

    if (!onChange) {
        return (
            <TabsComponent
                items={items}
                getLabel={getLabel}
                getKey={getKey}
                selected={selected}
                onChange={onSelect}
                header={header}
                style={style}
            />
        );
    }

    const onAdd = () => {
        const newItem = onCreateNewItem();
        onChange([...items, newItem]);
        onSelect(newItem);
    };
    const onDelete = () => {
        const newItems = [...items.filter(x => x !== selected)];
        onChange(newItems);
        if (newItems.length > 0) {
            onSelect(newItems[0]);
        }
    };
    const onMove = (item: T, oldIndex: number, newIndex: number) => {
        if (newIndex < 0 || newIndex > items.length - 1) { return; }
        const newItems = [...items];
        newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, item);

        onChange(newItems);
    };

    return (
        <TabsComponent
            items={items}
            getLabel={getLabel}
            getKey={getKey}
            selected={selected}
            onChange={onSelect}
            onMove={onMove}
            onAdd={onAdd}
            onDelete={onDelete}
            header={header}
            style={style}
        />
    );
};

export const TabsComponent = <T extends {}>({
    items,
    getLabel,
    getKey,
    selected,
    onChange,
    onMove,
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
    onMove?: (item: T, fromIndex: number, toIndex: number) => void;
    onAdd?: () => void;
    onDelete?: () => void;
    header?: string;
    style?: {
        selectedTabText?: { color?: string };
    };
}) => {
    const [mode, setMode] = useState(`row` as 'row' | 'column');

    return (
        <View style={mode === `row` ? styles.mainView : styles.mainView_column}>

            {!!header && (
                <TouchableOpacity onPress={() => setMode(s => s === `row` ? `column` : `row`)}>
                    <View style={styles.headerTabView}>
                        <Text style={styles.tabText}>{`${mode === `row` ? `↔ ` : `↕ `}`}</Text>
                        <Text style={styles.headerTabText}>{`${header}`}</Text>
                    </View>
                </TouchableOpacity>
            )}

            {items.map((x, i) => (
                <View key={getKey(x, i)} style={x === selected ? styles.tabView_selected : styles.tabView}>
                    {mode === `column` && onMove && (
                        <>
                            <TouchableOpacity onPress={() => onMove(x, i, i - 1)}>
                                <View style={styles.moveButtonView}>
                                    <Text style={styles.tabText}>{`${i <= 0 ? ` ` : `⬆`}`}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onMove(x, i, i + 1)}>
                                <View style={styles.moveButtonView}>
                                    <Text style={styles.tabText}>{`${i >= items.length - 1 ? ` ` : `⬇`}`}</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => onChange(x)}>
                        <View>
                            <Text style={x === selected ? { ...styles.tabText_selected, ...style?.selectedTabText } : { ...styles.tabText }}>{`${getLabel(x)}`}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
