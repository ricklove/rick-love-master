import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native-lite';
import { distinct, shuffle } from 'utils/arrays';
import { randomIndex } from 'utils/random';


export const EducationalGame_MultiplesLargeBoard = (props: {}) => {

    const [gameBoard, setGameBoard] = useState(createDefaultGameBoardState());
    const lastGameBoard = useRef(gameBoard);

    lastGameBoard.current = gameBoard;

    return (
        <>
            <View style={{ marginTop: 50, marginBottom: 150, padding: 2, alignItems: `center` }} >
                <View style={{}}>
                    <GameBoard gameBoard={gameBoard} />
                </View>
            </View>
        </>
    );
};


type GameBoardState = {
    key: number;
    size: number;
    columns: {
        col: number;
        cells: GameBoardCell[];
    }[];
    focus: GameBoardPosition;
};

type GameBoardPosition = {
    col: number;
    row: number;
};

type GameBoardCell = {
    col: number;
    row: number;
    value: number;
    state: 'blank' | 'answer';
};

const size = 12;

const createDefaultGameBoardState = (): GameBoardState => {

    const gameBoard: GameBoardState = {
        key: 0,
        size,
        columns: [...new Array(size)].map((x, i) => ({
            col: i,
            cells: [...new Array(size)].map((r, j) => ({
                col: i,
                row: j,
                value: (i + 1) * (j + 1),
                state: `blank`,
                bodyIndex: 0,
                connected: {
                    t: false,
                    b: false,
                    l: false,
                    r: false,
                },
            })),
        })),
        focus: { col: 0, row: 0 },
    };

    return gameBoard;
};

const styles = {
    cellView: {
        width: 24,
        height: 24,
        backgroundColor: `rgba(0,0,0,0.75)`,
        borderWidth: 1,
        borderColor: `#111133`,
        borderStyle: `solid`,
        justifyContent: `center`,
        alignItems: `center`,
    },
    focusCellView: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: `#66FF66`,
        borderStyle: `solid`,
        justifyContent: `center`,
        alignItems: `center`,
    },
    cellHeaderView: {
        width: 24,
        height: 24,
        backgroundColor: `rgba(0,0,0,0.5)`,
        borderWidth: 1,
        borderColor: `#111133`,
        borderStyle: `solid`,
        justifyContent: `center`,
        alignItems: `center`,
    },
    focusCellHeaderView: {
        width: 24,
        height: 24,
        backgroundColor: `rgba(0,0,0,0.5)`,
        borderWidth: 1,
        borderColor: `#111133`,
        borderStyle: `solid`,
        justifyContent: `center`,
        alignItems: `center`,
    },
    cellText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 12,
    },
    cellHeaderText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 12,
        color: `#333300`,
    },
    focusCellHeaderText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 12,
        color: `#FFFF00`,
    },
} as const;

const GameBoard = ({ gameBoard }: { gameBoard: GameBoardState }) => {

    const getCellText = (cell: GameBoardCell) => {
        const { col, row, value } = cell;
        return `${value}`;
    };

    const getCellViewStyle = (cell: GameBoardCell) => {
        const unitSize = 4;
        const lineColor = `#000000`;
        const { col, row, value } = cell;
        return [styles.cellView, {
            width: (col + 1) * unitSize,
            height: (row + 1) * unitSize,
            margin: unitSize / 2,
            borderWidth: 0,
            background: `
            repeating-linear-gradient(${lineColor} 0px, transparent 1px, transparent ${unitSize - 1}px, ${lineColor} ${unitSize}px), 
            repeating-linear-gradient(0.25turn, ${lineColor} 0px, transparent 1px, transparent ${unitSize - 1}px, ${lineColor} ${unitSize}px)`,
        }];
        // return styles.cellView;
    };

    const getCellTextStyle = (cell: GameBoardCell) => {
        const { col, row, value } = cell;
        if (col < 2) {
            return [styles.cellText, {
                fontSize: 8,
            }];
        }
        return styles.cellText;
    };

    const { focus } = gameBoard;

    return (
        <>
            <View style={{ flexDirection: `row` }} >
                {/* <View style={{ flexDirection: `column-reverse` }} >
                    <View style={styles.focusCellHeaderView} >
                        <Text style={styles.focusCellHeaderText} >x</Text>
                    </View>
                    {gameBoard.rows.map((r) => (
                        <View key={r.row} style={focus.row === r.row ? styles.focusCellHeaderView : styles.cellHeaderView} >
                            <Text style={focus.row === r.row ? styles.focusCellHeaderText : styles.cellHeaderText}>{`${r.row}`}</Text>
                        </View>
                    ))}
                </View> */}

                {gameBoard.columns.map((c) => (
                    <View key={c.col} style={{ flexDirection: `column-reverse` }} >
                        {/* <View style={focus.col === c.col ? styles.focusCellHeaderView : styles.cellHeaderView} >
                            <Text style={focus.col === c.col ? styles.focusCellHeaderText : styles.cellHeaderText}>{`${c.col}`}</Text>
                        </View> */}
                        {c.cells.map((cell) => (
                            <View key={cell.row} style={getCellViewStyle(cell)} >
                                <Text style={getCellTextStyle(cell)}>{getCellText(cell)}</Text>
                            </View>
                        ))}
                    </View>
                ))}

            </View>
        </>
    );
};
