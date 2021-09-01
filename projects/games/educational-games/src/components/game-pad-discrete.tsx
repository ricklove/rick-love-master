import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native-lite';

const inputStyles = {
    container: { flex: 1, flexDirection: `row`, justifyContent: `space-between`, alignItems: `center`, padding: 16 },
    section: { justifyContent: `center`, alignItems: `center`, padding: 16 },
    row: { flexDirection: `row` },
    cellTouch: { outline: `none` },
    cellView: { margin: 2, width: 32, height: 32, justifyContent: `center`, alignItems: `center`, borderWidth: 1, borderStyle: `solid`, outline: `none` },
    cellText: { userSelect: `none` },
    cellEmptyView: { margin: 2, width: 32, height: 32 },
} as const;

export const GamepadDiscrete = (props: { style: { backgroundColor: string, borderColor: string }, onMove: (direction: { x: number, y: number }) => void, buttons: { text: string, onPress: () => void }[] }) => {
    const { onMove: move } = props;

    const cellViewStyle = { ...inputStyles.cellView, ...props.style };

    return (
        <View style={inputStyles.container}>
            <View style={inputStyles.section}>
                <View style={inputStyles.row} >
                    <View style={inputStyles.cellEmptyView} />
                    <TouchableOpacity style={inputStyles.cellTouch} onPress={() => move({ x: 0, y: +1 })}><View style={cellViewStyle}><Text style={inputStyles.cellText}>⬆</Text></View></TouchableOpacity>
                    <View style={inputStyles.cellEmptyView} />
                </View>
                <View style={inputStyles.row} >
                    <TouchableOpacity style={inputStyles.cellTouch} onPress={() => move({ x: -1, y: 0 })}><View style={cellViewStyle}><Text style={inputStyles.cellText}>⬅</Text></View></TouchableOpacity>
                    <View style={inputStyles.cellEmptyView} />
                    <TouchableOpacity style={inputStyles.cellTouch} onPress={() => move({ x: 1, y: 0 })}><View style={cellViewStyle}><Text style={inputStyles.cellText}>➡</Text></View></TouchableOpacity>
                </View>
                <View style={inputStyles.row} >
                    <View style={inputStyles.cellEmptyView} />
                    <TouchableOpacity style={inputStyles.cellTouch} onPress={() => move({ x: 0, y: -1 })}><View style={cellViewStyle}><Text style={inputStyles.cellText}>⬇</Text></View></TouchableOpacity>
                    <View style={inputStyles.cellEmptyView} />
                </View>
            </View>
            <View style={inputStyles.section} >
                <View style={inputStyles.row} >
                    {props.buttons.map(x => (
                        <React.Fragment key={`${x.text}`}>
                            <View style={inputStyles.cellEmptyView} />
                            <TouchableOpacity style={inputStyles.cellTouch} onPress={x.onPress}><View style={cellViewStyle}><Text style={inputStyles.cellText}>{x.text}</Text></View></TouchableOpacity>
                        </React.Fragment>
                    ))}
                </View>
            </View>
        </View>
    );
};
