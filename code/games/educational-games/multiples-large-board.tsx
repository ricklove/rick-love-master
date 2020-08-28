import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native-lite';
import { randomIndex } from 'utils/random';

const colors = {
    text: `#FFFF00`,
    problemText: `#FFFF00`,
    line: `#000000`,
    lineFocus: `#000000`,
    solid: `transparent`,
    solidFocus: `#7777FF55`,
    buttonBorder: `#0000FF`,
};

const gameStyles = {
    problemView: {
        flex: 1,
        flexDirection: `row`,
        justifyContent: `center`,
        alignItems: `center`,
        padding: 16,
    },
    problemText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 20,
        color: colors.problemText,
    },
} as const;

export const EducationalGame_MultiplesLargeBoard = (props: {}) => {

    const [gameBoard, setGameBoard] = useState(createDefaultGameBoardState());
    const lastGameBoard = useRef(gameBoard);

    const [problem, setProblem] = useState(0 as number);

    const changeFocus = (f: GameBoardPosition) => {
        const focus = f;
        focus.col = focus.col < 0 ? 0 : focus.col > size - 1 ? size - 1 : focus.col;
        focus.row = focus.row < 0 ? 0 : focus.row > size - 1 ? size - 1 : focus.row;
        const s = lastGameBoard.current;
        setGameBoard({ ...s, key: s.key + 1, focus });
    };

    const submitAnswer = () => {
        const s = lastGameBoard.current;
        const cell = s.columns[s.focus.col].cells[s.focus.row];

        if (cell.value === problem) {
            // Correct
            cell.text = `${cell.value}`;
        } else {
            // Wrong
            cell.text = `❌`;
        }

        nextProblem();
    };

    const nextProblem = () => {
        const s = lastGameBoard.current;
        const allCells = s.columns.flatMap(c => c.cells);
        const nextCells = allCells.filter(x => !x.text);
        const cell = nextCells[randomIndex(nextCells.length)];
        setProblem(cell.value);
    };

    useEffect(() => {
        nextProblem();
    }, []);

    lastGameBoard.current = gameBoard;

    return (
        <>
            <View style={{ marginTop: 50, marginBottom: 150, padding: 2, alignItems: `center` }} >
                <View style={{}}>
                    <GameBoard gameBoard={gameBoard} />
                    <ProblemView problem={problem} />
                    <GameGamepadInput gameBoard={gameBoard} onChangeFocus={changeFocus} buttons={[{ text: `🔴`, onPress: submitAnswer }]} />
                </View>
            </View>
        </>
    );
};

export const ProblemView = (props: { problem: number }) => {
    return (
        <View style={gameStyles.problemView}><Text style={gameStyles.problemText}>{`${props.problem}`}</Text></View>
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
    text: string;
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
                // text: `${(i + 1) * (j + 1)}`,
                text: ``,
                bodyIndex: 0,
                connected: {
                    t: false,
                    b: false,
                    l: false,
                    r: false,
                },
            })),
        })),
        focus: { col: 5, row: 7 },
    };

    return gameBoard;
};

const styles = {
    cellView: {
        width: 24,
        height: 24,
        justifyContent: `center`,
        alignItems: `center`,
    },
    cellText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 12,
        color: colors.text,
    },

    cellHeaderView: {},
    focusCellHeaderView: {},
    cellHeaderText: {},
    focusCellHeaderText: {},
} as const;

const GameBoard = ({ gameBoard }: { gameBoard: GameBoardState }) => {
    const { focus } = gameBoard;

    const getCellText = (cell: GameBoardCell) => {
        const { col, row, value, text } = cell;
        return `${text}`;
    };

    const getCellViewStyle = (cell: GameBoardCell) => {
        const { col, row, value } = cell;
        const focusState = focus.col === col && focus.row === row ? `row col`
            : focus.col === col ? `col`
                : focus.row === row ? `row`
                    : ``;
        const unitSize = 4;
        const lineColorRow = focusState.includes(`row`) ? colors.lineFocus : colors.line;
        const lineColorCol = focusState.includes(`col`) ? colors.lineFocus : colors.line;
        const solidColorRow = focusState.includes(`row`) ? colors.solidFocus : colors.solid;
        const solidColorCol = focusState.includes(`col`) ? colors.solidFocus : colors.solid;
        const lineRadius = 0.5;

        const background = `
        repeating-linear-gradient(${lineColorRow} 0px, ${lineColorRow} ${lineRadius}px, ${solidColorRow} ${lineRadius}px, ${solidColorRow} ${unitSize - lineRadius}px, ${lineColorRow} ${unitSize - lineRadius}px, ${lineColorRow} ${unitSize}px), 
        repeating-linear-gradient(0.25turn, ${lineColorCol} 0px, ${lineColorCol} ${lineRadius}px, ${solidColorCol} ${lineRadius}px, ${solidColorCol} ${unitSize - lineRadius}px, ${lineColorCol} ${unitSize - lineRadius}px, ${lineColorCol} ${unitSize}px)
        `;

        return [styles.cellView, {
            width: (col + 1) * unitSize,
            height: (row + 1) * unitSize,
            margin: unitSize / 2,
            borderWidth: 0,
            background,
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


    return (
        <>
            <View style={{ flexDirection: `row` }} >
                <View style={{ flexDirection: `column-reverse` }} >
                    <View style={[...getCellViewStyle(gameBoard.columns[0].cells[0]), { background: undefined }]} >
                        <Text style={styles.focusCellHeaderText} > </Text>
                    </View>
                    {gameBoard.columns[0].cells.map((r) => (
                        <View key={r.row} style={[...getCellViewStyle(r), { background: undefined }]} >
                            <Text style={focus.row === r.row ? styles.focusCellHeaderText : styles.cellHeaderText}>{`${r.row + 1}`}</Text>
                        </View>
                    ))}
                </View>

                {gameBoard.columns.map((c) => (
                    <View key={c.col} style={{ flexDirection: `column-reverse` }} >
                        <View style={[...getCellViewStyle(c.cells[0]), { background: undefined }]} >
                            <Text style={focus.col === c.col ? styles.focusCellHeaderText : styles.cellHeaderText}>{`${c.col + 1}`}</Text>
                        </View>
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

const inputStyles = {
    container: { flex: 1, flexDirection: `row`, justifyContent: `space-between`, alignItems: `center`, padding: 16 },
    section: { justifyContent: `center`, alignItems: `center`, padding: 16 },
    row: { flexDirection: `row` },
    cellView: { margin: 2, width: 32, height: 32, justifyContent: `center`, alignItems: `center`, borderWidth: 1, borderStyle: `solid`, boderColor: colors.buttonBorder },
    cellText: {},
    cellEmptyView: { margin: 2, width: 32, height: 32 },
} as const;

const GameGamepadInput = (props: { gameBoard: GameBoardState, onChangeFocus: (focus: GameBoardPosition) => void, buttons: { text: string, onPress: () => void }[] }) => {
    const move = (col: number, row: number) => {
        props.onChangeFocus({
            col: props.gameBoard.focus.col + col,
            row: props.gameBoard.focus.row + row,
        });
    };
    // ⬅⬆⬇➡
    return (
        <View style={inputStyles.container}>
            <View style={inputStyles.section}>
                <View style={inputStyles.row} >
                    <View style={inputStyles.cellEmptyView} />
                    <TouchableOpacity onPress={() => move(0, +1)}><View style={inputStyles.cellView}><Text>⬆</Text></View></TouchableOpacity>
                    <View style={inputStyles.cellEmptyView} />
                </View>
                <View style={inputStyles.row} >
                    <TouchableOpacity onPress={() => move(-1, 0)}><View style={inputStyles.cellView}><Text>⬅</Text></View></TouchableOpacity>
                    <View style={inputStyles.cellEmptyView} />
                    <TouchableOpacity onPress={() => move(+1, 0)}><View style={inputStyles.cellView}><Text>➡</Text></View></TouchableOpacity>
                </View>
                <View style={inputStyles.row} >
                    <View style={inputStyles.cellEmptyView} />
                    <TouchableOpacity onPress={() => move(0, -1)}><View style={inputStyles.cellView}><Text>⬇</Text></View></TouchableOpacity>
                    <View style={inputStyles.cellEmptyView} />
                </View>
            </View>
            <View style={inputStyles.section} >
                <View style={inputStyles.row} >
                    {props.buttons.map(x => (
                        <React.Fragment key={`${x.text}`}>
                            <View style={inputStyles.cellEmptyView} />
                            <TouchableOpacity onPress={x.onPress}><View style={inputStyles.cellView}><Text>{x.text}</Text></View></TouchableOpacity>
                        </React.Fragment>
                    ))}
                </View>
            </View>
        </View>
    );
};
