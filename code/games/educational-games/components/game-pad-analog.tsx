import React, { useState, useRef } from 'react';
import { View, Text, Pressable } from 'react-native-lite';

const inputStyles = {
    container: { flex: 1, flexDirection: `row`, justifyContent: `space-between`, alignItems: `center`, padding: 16 },
    section: { justifyContent: `center`, alignItems: `center`, padding: 16 },
    row: { flexDirection: `row` },
    cellTouch: { outline: `none` },
    cellView: { margin: 2, width: 32, height: 32, justifyContent: `center`, alignItems: `center`, borderWidth: 1, borderStyle: `solid`, outline: `none` },
    cellText: { userSelect: `none` },
    cellEmptyView: { margin: 2, width: 32, height: 32 },
} as const;

export type GamepadPressState = { moveDirection: { x: number, y: number }, buttons: { key: string, text: string, isDown: boolean }[] };
export const GamepadAnalogStateful = (props: {
    style: { backgroundColor: string, borderColor: string };
    onPressStateChange: (value: GamepadPressState) => void;
    buttons: { text: string, key: string }[];
}) => {

    const state = useRef({
        moveDirection: { x: 0, y: 0 },
        buttons: props.buttons.map((x, i) => ({
            isDown: false,
            key: x.key,
            text: x.text,
            onPressIn: () => {
                state.current.buttons[i].isDown = true;
                props.onPressStateChange(state.current);
            },
            onPressOut: () => {
                state.current.buttons[i].isDown = false;
                props.onPressStateChange(state.current);
            },
        })),
    });

    const onMovePressIn = (dir: { x: number, y: number }) => {
        const s = state.current;

        state.current.moveDirection = {
            x: dir.x ? dir.x : s.moveDirection.x,
            y: dir.y ? dir.y : s.moveDirection.y,
        };

        console.log(`onMovePressIn`, { dir, s, moveDirection: state.current.moveDirection });

        props.onPressStateChange(state.current);
    };

    const onMovePressOut = (dir: { x: number, y: number }) => {
        const s = state.current;
        state.current.moveDirection = {
            x: dir.x ? 0 : s.moveDirection.x,
            y: dir.y ? 0 : s.moveDirection.y,
        };
        props.onPressStateChange(state.current);
    };

    return (
        <GamepadAnalog {...props} onMovePressIn={onMovePressIn} onMovePressOut={onMovePressOut} buttons={state.current.buttons} />
    );
};

export const GamepadAnalog = (props: {
    style: { backgroundColor: string, borderColor: string };
    onMovePressIn: (direction: { x: number, y: number }) => void;
    onMovePressOut: (direction: { x: number, y: number }) => void;
    buttons: { text: string, onPressIn: () => void, onPressOut: () => void }[];
}) => {
    const { onMovePressIn: onMoveDown, onMovePressOut: onMoveUp } = props;

    const cellViewStyle = { ...inputStyles.cellView, ...props.style };

    const DirectionButton = ({ text, direction }: { text: string, direction: { x: number, y: number } }) => {
        return (
            <Pressable style={inputStyles.cellTouch} onPressIn={() => onMoveDown(direction)} onPressOut={() => onMoveUp(direction)}><View style={cellViewStyle}><Text style={inputStyles.cellText}>{text}</Text></View></Pressable>
        );
    };

    return (
        <View style={inputStyles.container}>
            <View style={inputStyles.section}>
                <View style={inputStyles.row} >
                    <View style={inputStyles.cellEmptyView} />
                    <DirectionButton direction={{ x: 0, y: +1 }} text='⬆' />
                    <View style={inputStyles.cellEmptyView} />
                </View>
                <View style={inputStyles.row} >
                    <DirectionButton direction={{ x: -1, y: 0 }} text='⬅' />
                    <View style={inputStyles.cellEmptyView} />
                    <DirectionButton direction={{ x: +1, y: 0 }} text='➡' />
                </View>
                <View style={inputStyles.row} >
                    <View style={inputStyles.cellEmptyView} />
                    <DirectionButton direction={{ x: 0, y: -1 }} text='⬇' />
                    <View style={inputStyles.cellEmptyView} />
                </View>
            </View>
            <View style={inputStyles.section} >
                <View style={inputStyles.row} >
                    {props.buttons.map(x => (
                        <React.Fragment key={`${x.text}`}>
                            <View style={inputStyles.cellEmptyView} />
                            <Pressable style={inputStyles.cellTouch} onPressIn={x.onPressIn} onPressOut={x.onPressOut}><View style={cellViewStyle}><Text style={inputStyles.cellText}>{x.text}</Text></View></Pressable>
                        </React.Fragment>
                    ))}
                </View>
            </View>
        </View>
    );
};
