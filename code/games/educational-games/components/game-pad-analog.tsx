import React, { useState, useRef } from 'react';
import { View, Text, Pressable } from 'react-native-lite';

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

const inputStyles = {
    container: { flex: 1, alignSelf: `stretch`, flexDirection: `row`, justifyContent: `space-between`, alignItems: `center`, padding: 4 },
    section: { justifyContent: `center`, alignItems: `center`, padding: 4 },
    moveSectionWrapper: { transform: `rotate(0.125turn)` },
    row: { flexDirection: `row` },
    cellTouch: { outline: `none` },
    cellView: { pointerEvents: `none`, position: `relative`, margin: 1, width: 48, height: 48, justifyContent: `center`, alignItems: `center`, borderWidth: 0, borderStyle: `solid`, outline: `none` },
    cellText: { userSelect: `none`, pointerEvents: `none` },
    moveCellText: { userSelect: `none`, pointerEvents: `none`, transform: `rotate(-0.125turn)` },
    cellEmptyView: { margin: 2, width: 48, height: 48 },
    cellTextOcclusionView: { position: `absolute`, top: 0, bottom: 0, left: 0, right: 0, backgroundColor: `red`, opacity: 0 },
} as const;

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
            <Pressable style={inputStyles.cellTouch} onPressIn={() => onMoveDown(direction)} onPressOut={() => onMoveUp(direction)}>
                <View style={cellViewStyle}>
                    <Text style={inputStyles.moveCellText}>{text}</Text>
                    <View style={inputStyles.cellTextOcclusionView} />
                </View>
            </Pressable>
        );
    };

    const ActionButton = ({ text, onPressIn, onPressOut }: { text: string, onPressIn: () => void, onPressOut: () => void }) => {
        return (
            <Pressable style={inputStyles.cellTouch} onPressIn={onPressIn} onPressOut={onPressOut}>
                <View style={cellViewStyle}>
                    <Text style={inputStyles.cellText}>{text}</Text>
                    <View style={inputStyles.cellTextOcclusionView} />
                </View>
            </Pressable>
        );
    };

    return (
        <View style={inputStyles.container}>
            <View style={inputStyles.moveSectionWrapper}>
                <View style={inputStyles.section}>
                    <View style={inputStyles.row} >
                        <DirectionButton direction={{ x: 0, y: +1 }} text='⬆' />
                        <DirectionButton direction={{ x: +1, y: 0 }} text='➡' />
                    </View>
                    <View style={inputStyles.row} >
                        <DirectionButton direction={{ x: -1, y: 0 }} text='⬅' />
                        <DirectionButton direction={{ x: 0, y: -1 }} text='⬇' />
                    </View>
                </View>
            </View>
            <View style={inputStyles.section} >
                <View style={inputStyles.row} >
                    {props.buttons.map(x => (
                        <React.Fragment key={`${x.text}`}>
                            <View style={inputStyles.cellEmptyView} />
                            <ActionButton {...x} />
                        </React.Fragment>
                    ))}
                </View>
            </View>
        </View>
    );
};
