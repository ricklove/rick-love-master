import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native-lite';
import { distinct, shuffle } from 'utils/arrays';

export const EducationalGame_MultiplesCounting = (props: {}) => {

    const [gameScore, setGameScore] = useState({ startTime: Date.now(), gameWonTime: undefined } as GameScoreState);
    const [gameBoard, setGameBoard] = useState(createDefaultGameBoardState());
    const [gameInput, setGameInput] = useState(null as null | GameInputState);
    const lastGameBoard = useRef(gameBoard);

    const onGameWon = () => {
        setGameScore(s => ({ ...s, gameWonTime: Date.now() }));

        // const newGameBoard = createDefaultGameBoardState();
        // setGameBoard(newGameBoard);
        // nextInputState(newGameBoard);
    };

    const onCorrect = (value: { multiple: number, times: number }) => {
        const newGameBoard = { ...lastGameBoard.current };
        const col = newGameBoard.columns.find(x => x.multiple === value.multiple);
        if (col) {
            col.maxTimesCorrect = value.times;
        };

        setGameBoard(newGameBoard);
        // setGameInput(null);

        setTimeout(() => {
            nextInputState(newGameBoard);
        }, 100);
    };
    const onWrong = (value: { multiple: number, times: number }) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setGameInput(s => ({ ...s! }));

        // Reset column
        // const newGameBoard = ({ ...gameBoard, columns: gameBoard.columns.map(x => x.multiple === value.multiple ? { maxTimesCorrect: 0, multiple: x.multiple } : x) });

        // setGameBoard(newGameBoard);
        // setGameInput(null);

        // setTimeout(() => {
        //     nextInputState(newGameBoard);
        // }, 500);
    };

    const nextInputState = (game: GameBoardState) => {
        const gameInputState = createGameInputState(game, onGameWon, onCorrect, onWrong);
        setGameInput(gameInputState);
    };

    useEffect(() => {
        nextInputState(gameBoard);
    }, []);

    lastGameBoard.current = gameBoard;

    return (
        <>
            <View style={{ marginTop: 50, marginBottom: 150, padding: 2, alignItems: `center` }} >
                <View style={{ width: 24 * 12 + 4 }}>
                    <GameScore gameScore={gameScore} />
                    <GameBoard gameBoard={gameBoard} focus={gameInput?.focus ?? { multiple: 0, times: 0 }} />
                    {gameInput && <GameInput gameInput={gameInput} />}
                </View>
            </View>
        </>
    );
};

type GameBoardState = {
    maxTimes: number;
    rows: { times: number }[];
    columns: {
        multiple: number;
        maxTimesCorrect: number;
    }[];
};

const createDefaultGameBoardState = (): GameBoardState => {
    const maxMultiple = 12;
    const gameBoard: GameBoardState = {
        maxTimes: maxMultiple,
        rows: [...new Array(maxMultiple)].map((x, i) => ({ times: i + 1 })),
        columns: [...new Array(maxMultiple)].map((x, i) => ({ multiple: i + 1, maxTimesCorrect: 0 })),
    };

    return gameBoard;
};

const styles = {
    cellView: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: `#0000FF`,
        borderStyle: `solid`,
        justifyContent: `center`,
        alignItems: `center`,
    },
    focusCellView: {
        width: 24,
        height: 24,
        backgroundColor: `rgba(0,0,0,0.5)`,
        borderWidth: 1,
        borderColor: `#0000FF`,
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
        color: `#FFFF00`,
    },
} as const;

const GameBoard = ({ gameBoard, focus }: { gameBoard: GameBoardState, focus: { multiple: number, times: number } }) => {
    return (
        <>
            <View style={{ flexDirection: `row` }} >
                <View style={{ flexDirection: `column-reverse` }} >
                    <View style={styles.cellView} >
                        <Text style={styles.cellHeaderText} />
                    </View>
                    {gameBoard.rows.map((r) => (
                        <View key={r.times} style={focus.times === r.times ? styles.focusCellView : styles.cellView} >
                            <Text style={styles.cellHeaderText}>{`${r.times}`}</Text>
                        </View>
                    ))}
                </View>

                {gameBoard.columns.map((c) => (
                    <View key={c.multiple} style={{ flexDirection: `column-reverse` }} >
                        <View style={focus.multiple === c.multiple ? styles.focusCellView : styles.cellView} >
                            <Text style={styles.cellHeaderText}>{`${c.multiple}`}</Text>
                        </View>
                        {gameBoard.rows.map((r) => (
                            <View key={r.times} style={focus.times === r.times || focus.multiple === c.multiple ? styles.focusCellView : styles.cellView} >
                                {c.maxTimesCorrect >= r.times ? (
                                    <Text style={styles.cellText}>{`${c.multiple * r.times}`}</Text>
                                ) : (
                                        <Text style={styles.cellText} />
                                    )}
                            </View>
                        ))}
                    </View>
                ))}

            </View>
        </>
    );
};


type GameInputState = {
    key: string;
    focus: { multiple: number, times: number };
    buttons: {
        value: number;
        text: string;
        onPress: () => void;
        wasAnsweredWrong: boolean;
    }[];
};

const createGameInputState = (gameBoard: GameBoardState, onGameWon: () => void, onCorrect: (value: { multiple: number, times: number }) => void, onWrong: (value: { multiple: number, times: number }) => void): GameInputState => {
    const nextColumn = gameBoard.columns.filter(x => x.maxTimesCorrect < gameBoard.maxTimes)[0];
    if (!nextColumn) {
        // Win state - All Complete
        onGameWon();
        return { key: ``, focus: { multiple: 0, times: 0 }, buttons: [] };
    }

    const m = nextColumn.multiple;
    const t = nextColumn.maxTimesCorrect + 1;

    const correctValue = m * t;
    const wrongAnswerCount = 4;
    const wrongValues =
        distinct(
            [...new Array(100)].map(() =>
                Math.round(m + 1 - 2 * Math.random())
                * Math.round(t + 1 - 2 * Math.random())
                + Math.round(2 - 4 * Math.random()))
                .filter(x => x !== correctValue)
                .filter(x => x > 0),
        ).slice(0, wrongAnswerCount);

    const answers = shuffle([correctValue, ...wrongValues]);

    const onAnswer = (value: number) => {
        if (value === correctValue) {
            onCorrect({ multiple: m, times: t });
            return;
        }

        const button = buttons.find(x => x.value === value);
        if (!button) { return; }
        button.wasAnsweredWrong = true;
        onWrong({ multiple: m, times: t });
    };

    const buttons = answers.map(x => ({
        value: x,
        text: `${x}`,
        onPress: () => onAnswer(x),
        wasAnsweredWrong: false,
    }));

    return {
        key: `${m}*${t}`,
        focus: { multiple: m, times: t },
        buttons,
    };
};

const inputStyles = {
    container: {
        flexDirection: `row`,
        flex: 1,
        justifyContent: `space-around`,
        margin: 16,
    },
    buttonView: {
        width: 36,
        height: 36,
        borderWidth: 2,
        borderColor: `#0000FF`,
        borderStyle: `solid`,
        justifyContent: `center`,
        alignItems: `center`,
    },
    buttonText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 18,
        color: `#FFFF00`,
    },
    buttonText_wrong: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 18,
        color: `#FF0000`,
    },
} as const;

const GameInput = ({ gameInput }: { gameInput: GameInputState }) => {

    const [y, setY] = useState(0);

    useEffect(() => {
        setY(100);
        const id = setInterval(() => {
            setY(s => Math.max(0, s - 1));
        }, 50);
        return () => clearInterval(id);
    }, [gameInput.key]);

    // console.log(`GameInput`);
    return (
        <>
            <View style={[inputStyles.container, { transform: `translate(0px,${y}px)` }]}>
                {gameInput.buttons.map(x => (
                    <TouchableOpacity key={x.text + gameInput.key} onPress={x.wasAnsweredWrong ? () => {/* Ignore */ } : x.onPress}>
                        <View style={inputStyles.buttonView}>
                            <Text style={x.wasAnsweredWrong ? inputStyles.buttonText_wrong : inputStyles.buttonText}>{x.text}</Text>
                        </View>
                    </TouchableOpacity>))}
            </View>
        </>
    );
};


const scoreStyles = {
    container: {
        flexDirection: `row`,
        flex: 1,
        justifyContent: `space-around`,
        margin: 16,
    },
    text: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 18,
        color: `#FFFF00`,
    },
} as const;

type GameScoreState = {
    startTime: number;
    gameWonTime?: number;
};

const GameScore = ({ gameScore }: { gameScore: GameScoreState }) => {

    const [message, setMessage] = useState(``);

    useEffect(() => {
        const id = setInterval(() => {
            const timeMs = Date.now() - gameScore.startTime;
            setMessage(s => `${(timeMs / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} seconds`);
        }, 100);
        return () => clearInterval(id);
    }, [gameScore.startTime]);

    // console.log(`GameInput`);
    return (
        <>
            <View style={scoreStyles.container}>
                <Text style={scoreStyles.text}>{message}</Text>
            </View>
        </>
    );
};
