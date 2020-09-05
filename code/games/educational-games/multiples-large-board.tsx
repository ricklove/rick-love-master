import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native-lite';
import { randomIndex } from 'utils/random';
import { GamepadDiscrete } from './components/game-pad-discrete';
import { PetService } from './pet/pet-service';

const colors = {
    text: `#FFFF00`,
    problemText: `#FFFF00`,
    line: `#000000`,
    lineFocus: `#000000`,
    solid: `transparent`,
    solidFocus: `#7777FF55`,
    buttonBackground: `#333333`,
    buttonBorder: `#000033`,
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
        const { size } = lastGameBoard.current;
        focus.i = focus.i < 0 ? 0 : focus.i > size - 1 ? size - 1 : focus.i;
        focus.j = focus.j < 0 ? 0 : focus.j > size - 1 ? size - 1 : focus.j;
        const s = lastGameBoard.current;
        setGameBoard({ ...s, key: s.key + 1, focus });
    };

    const submitAnswer = () => {
        const s = lastGameBoard.current;
        const cell = s.columns[s.focus.i].cells[s.focus.j];

        // Correct
        if (cell.value === problem) {
            PetService.get().feed();

            cell.text = `${cell.value}`;

            // Reset any x
            s.columns.forEach(x => x.cells.forEach(c => { if (c.text === `❌`) { c.text = ``; } }));

            nextProblem();
            return;
        }

        // Wrong
        cell.text = `❌`;
        setGameBoard({ ...s, key: s.key + 1 });
    };

    const nextProblem = () => {
        const s = lastGameBoard.current;
        const allCells = s.columns.flatMap(c => c.cells);
        const nextCells = allCells.filter(x => !x.text);
        if (nextCells.length === 0) {
            // TODO: Game Won
            setProblem(0);
            return;
        }

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
                <View style={{ alignItems: `center` }}>
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
        i: number;
        c: number;
        cells: GameBoardCell[];
    }[];
    focus: GameBoardPosition;
};

type GameBoardPosition = {
    i: number;
    j: number;
};

type GameBoardCell = {
    i: number;
    j: number;
    c: number;
    r: number;
    value: number;
    text: string;
};


const createDefaultGameBoardState = (): GameBoardState => {
    const size = 5;
    const minC = 2 + randomIndex(7 + 1 - 2);
    const minR = 2 + randomIndex(7 + 1 - 2);

    const gameBoard: GameBoardState = {
        key: 0,
        size,
        columns: [...new Array(size)].map((x, i) => ({
            i,
            c: i + minC,
            cells: [...new Array(size)].map((r, j) => ({
                i,
                j,
                c: i + minC,
                r: j + minR,
                value: (i + minC) * (j + minR),
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
        focus: { i: Math.floor(size / 2), j: Math.floor(size / 2) },
    };

    // Show all
    // gameBoard.columns.forEach(x => x.cells.forEach(c => { c.text = `${c.value}`; }));

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
        const { text } = cell;
        return `${text}`;
    };

    const getCellViewStyle = (cell: GameBoardCell) => {
        const { i, j, c, r } = cell;
        const focusState = focus.i === i && focus.j === j ? `row col`
            : focus.i === i ? `col`
                : focus.j === j ? `row`
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
            width: c * unitSize,
            height: r * unitSize,
            margin: unitSize / 2,
            borderWidth: 0,
            background,
        }];
        // return styles.cellView;
    };

    const getCellTextStyle = (cell: GameBoardCell) => {
        const { c } = cell;
        if (c < 2) {
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
                        <View key={r.r} style={[...getCellViewStyle(r), { background: undefined }]} >
                            <Text style={focus.j === r.j ? styles.focusCellHeaderText : styles.cellHeaderText}>{`${r.r}`}</Text>
                        </View>
                    ))}
                </View>

                {gameBoard.columns.map((c) => (
                    <View key={c.c} style={{ flexDirection: `column-reverse` }} >
                        <View style={[...getCellViewStyle(c.cells[0]), { background: undefined }]} >
                            <Text style={focus.i === c.i ? styles.focusCellHeaderText : styles.cellHeaderText}>{`${c.c}`}</Text>
                        </View>
                        {c.cells.map((cell) => (
                            <View key={cell.r} style={getCellViewStyle(cell)} >
                                <Text style={getCellTextStyle(cell)}>{getCellText(cell)}</Text>
                            </View>
                        ))}
                    </View>
                ))}

            </View>
        </>
    );
};

const GameGamepadInput = (props: { gameBoard: GameBoardState, onChangeFocus: (focus: GameBoardPosition) => void, buttons: { text: string, onPress: () => void }[] }) => {
    const move = (col: number, row: number) => {
        props.onChangeFocus({
            i: props.gameBoard.focus.i + col,
            j: props.gameBoard.focus.j + row,
        });
    };

    return (
        <GamepadDiscrete style={{ backgroundColor: colors.buttonBackground, borderColor: colors.buttonBorder }} onMove={dir => move(dir.x, dir.y)} buttons={props.buttons} />
    );
};
