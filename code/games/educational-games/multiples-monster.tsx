import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native-lite';
import { distinct, shuffle } from 'utils/arrays';
import { randomIndex } from 'utils/random';
import { Stats } from 'fs';
import { createLeaderboard } from './components/leaderboard';

const leaderboardService = createLeaderboard<{
    score: number;
    timeMs: number;
}>({
    storageKey: `MultiplesMonsterLeaderboard`,
    sortKey: x => x.score,
    scoreColumns: [
        { name: `Time`, getValue: x => `${(x.timeMs / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}` },
        { name: `Score`, getValue: x => `${x.score}` },
    ],
});

export const EducationalGame_MultiplesMonster = (props: {}) => {

    const [gameScore, setGameScore] = useState({ key: 0, startTime: Date.now(), gameOverTime: undefined, score: 0 } as GameScoreState & { key: number });
    const [gameBoard, setGameBoard] = useState(createDefaultGameBoardState());
    const [gameInput, setGameInput] = useState(null as null | GameInputState);
    const lastGameBoard = useRef(gameBoard);

    const leaderboard = leaderboardService.useLeaderboard({
        getScore: () => ({ score: gameScore.score, timeMs: (gameScore.gameOverTime ?? Date.now()) - gameScore.startTime }),
    });

    const onGameOver = () => {
        setGameScore(s => ({ ...s, gameOverTime: Date.now(), key: s.key + 1 }));
    };

    const onScoreSaved = () => {
        // Restart Game
        const newGameBoard = createDefaultGameBoardState();
        setGameScore({ key: 0, startTime: Date.now(), gameOverTime: undefined, score: 0 });
        setGameBoard(newGameBoard);
        nextInputState(newGameBoard);
    };

    const onMove = (value: { col: number, row: number }) => {
        const newGameBoard = { ...lastGameBoard.current };
        newGameBoard.player.position = value;

        let newPlayerCell = newGameBoard.columns[newGameBoard.player.position.col].cells[newGameBoard.player.position.row];
        if (newPlayerCell.state === `blank`) {
            setGameScore(s => ({ ...s, score: s.score + newPlayerCell.value }));
        }
        // Player Safe at House
        if (newPlayerCell.state === `house`) {
            // next level
            const nextGameBoard = createDefaultGameBoardState();
            setGameBoard(nextGameBoard);
            nextInputState(nextGameBoard);
            return;
        }

        moveMonsters(newGameBoard);

        // Player dead
        newPlayerCell = newGameBoard.columns[newGameBoard.player.position.col].cells[newGameBoard.player.position.row];
        if (newPlayerCell.state === `monster`) {
            onGameOver();
        }

        // const col = newGameBoard.columns.find(x => x.col === value.col);
        // if (col) {
        //     col.maxTimesCorrect = value.row;
        // };
        setGameBoard(newGameBoard);
        setTimeout(() => {
            nextInputState(newGameBoard);
        }, 100);
    };

    const nextInputState = (game: GameBoardState) => {
        const gameInputState = createGameInputState(game, onMove);
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
                    <GameBoard gameBoard={gameBoard} focus={gameBoard.player.position ?? { col: 0, row: 0 }} />
                    {gameInput && !gameScore.gameOverTime && <GameInput gameInput={gameInput} />}
                    <leaderboard.LeaderboardArea gameOver={!!gameScore.gameOverTime} onScoreSaved={onScoreSaved} />
                </View>
            </View>
        </>
    );
};


type GameBoardState = {
    key: number;
    maxTimes: number;
    columns: {
        col: number;
        cells: GameBoardCell[];
    }[];
    player: {
        position: GameBoardPosition;
    };
    monsters: {
        position: GameBoardPosition;
    }[];
    house: {
        position: GameBoardPosition;
    };
};

type GameBoardPosition = {
    col: number;
    row: number;
};

type GameBoardCell = {
    col: number;
    row: number;
    value: number;
    state: 'blank' | 'answer' | 'monster' | 'player' | 'house';
};

const maxMultiple = 12;

const createDefaultGameBoardState = (): GameBoardState => {

    const gameBoard: GameBoardState = {
        key: 0,
        maxTimes: maxMultiple,
        columns: [...new Array(maxMultiple)].map((x, i) => ({
            col: i,
            cells: [...new Array(maxMultiple)].map((r, j) => ({
                col: i,
                row: j,
                value: (i + 1) * (j + 1),
                state: `blank`,
            })),
        })),
        player: { position: { col: randomIndex(maxMultiple), row: randomIndex(maxMultiple) } },
        house: { position: { col: randomIndex(maxMultiple), row: randomIndex(maxMultiple) } },
        monsters: [...new Array(3)].map(x => ({ position: { col: randomIndex(maxMultiple), row: randomIndex(maxMultiple) } })),
    };

    while (gameBoard.house.position.row === gameBoard.player.position.row) {
        gameBoard.house.position = { col: randomIndex(maxMultiple), row: randomIndex(maxMultiple) };
    }

    gameBoard.monsters.forEach(m => {
        const monster = m;
        while (monster.position.row === gameBoard.player.position.row) {
            monster.position = { col: randomIndex(maxMultiple), row: randomIndex(maxMultiple) };
        }
    });

    // Randomly place player
    updateBoard(gameBoard);

    return gameBoard;
};

const moveMonsters = (board: GameBoardState) => {
    updateBoard(board);

    const p = board.player;
    board.monsters.forEach(mon => {
        const m = mon;
        const colDiff = p.position.col - m.position.col;
        const rowDiff = p.position.row - m.position.row;
        if (Math.abs(colDiff) >= Math.abs(rowDiff)) {
            m.position = { ...m.position, col: m.position.col + Math.sign(colDiff) };
        } else {
            m.position = { ...m.position, row: m.position.row + Math.sign(rowDiff) };
        }


    });

    // Spawn random monster
    if (Math.random() < 0.25) {
        const newMonster = { position: { col: randomIndex(maxMultiple), row: randomIndex(maxMultiple) } };
        if (Math.random() < 0.5) {
            if (Math.random() < 0.5) {
                newMonster.position.col = 0;
            } else {
                newMonster.position.col = maxMultiple - 1;
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (Math.random() < 0.5) {
                newMonster.position.row = 0;
            } else {
                newMonster.position.row = maxMultiple - 1;
            }
        }

        board.monsters.push(newMonster);
    }

    // Remove monsters that run into answer
    const newBoard = board;
    const monsters = [...board.monsters];
    const deadMonsters = monsters.filter(m => board.columns[m.position.col].cells[m.position.row].state === `answer`);
    const liveMonsters = monsters.filter(m => board.columns[m.position.col].cells[m.position.row].state !== `answer`);

    // Dead monsters destroy answer
    deadMonsters.forEach(m => {
        newBoard.columns[m.position.col].cells[m.position.row].state = `blank`;
    });

    newBoard.monsters = liveMonsters;

    updateBoard(newBoard);
};

const updateBoard = (state: GameBoardState) => {
    state.columns.forEach(c => c.cells.forEach(cellRaw => {
        const cell = cellRaw;
        if (cell.state === `monster`) { cell.state = `blank`; }
        if (cell.state === `player`) { cell.state = `answer`; }
    }));

    updateBoardPosition(state, state.house.position, `house`);
    updateBoardPosition(state, state.player.position, `player`);
    state.monsters.forEach(m => {
        updateBoardPosition(state, m.position, `monster`);
    });
};

const updateBoardPosition = (boardRaw: GameBoardState, position: GameBoardPosition, kind: 'player' | 'monster' | 'house') => {
    const board = boardRaw;
    board.columns[position.col].cells[position.row].state = kind;
    board.key += 1;
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
        borderLeftColor: `#FF66FF`,
        borderRightColor: `#FF66FF`,
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

const getCellText = (cell: GameBoardCell) => {
    return cell.state === `answer` ? `${cell.value}`
        : cell.state === `player` ? `😀`
            : cell.state === `monster` ? `💀`
                : cell.state === `house` ? `🏠`
                    : ``;
};

const GameBoard = ({ gameBoard, focus }: { gameBoard: GameBoardState, focus: { col: number, row: number } }) => {
    return (
        <>
            <View style={{ flexDirection: `row` }} >
                <View style={{ flexDirection: `column-reverse` }} >
                    <View style={styles.focusCellHeaderView} >
                        <Text style={styles.focusCellHeaderText} >x</Text>
                    </View>
                    {gameBoard.columns[0].cells.map((r) => (
                        <View key={r.row} style={focus.row === r.row ? styles.focusCellHeaderView : styles.cellHeaderView} >
                            <Text style={focus.row === r.row ? styles.focusCellHeaderText : styles.cellHeaderText}>{`${r.row + 1}`}</Text>
                        </View>
                    ))}
                </View>

                {gameBoard.columns.map((c) => (
                    <View key={c.col} style={{ flexDirection: `column-reverse` }} >
                        <View style={focus.col === c.col ? styles.focusCellHeaderView : styles.cellHeaderView} >
                            <Text style={focus.col === c.col ? styles.focusCellHeaderText : styles.cellHeaderText}>{`${c.col + 1}`}</Text>
                        </View>
                        {c.cells.map((cell) => (
                            <View key={cell.row} style={focus.row >= cell.row && focus.col >= c.col ? styles.focusCellView : styles.cellView} >
                                <Text style={styles.cellText}>{getCellText(cell)}</Text>
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
    buttons: {
        key: string;
        text: string;
        onPress: () => void;
    }[];
};

const createGameInputState = (gameBoard: GameBoardState, onMove: (value: { col: number, row: number }) => void): GameInputState => {
    const { player } = gameBoard;

    const nextCells = [
        gameBoard.columns[player.position.col + 0]?.cells[player.position.row + 1],
        gameBoard.columns[player.position.col + 0]?.cells[player.position.row - 1],
        gameBoard.columns[player.position.col + 1]?.cells[player.position.row + 0],
        gameBoard.columns[player.position.col - 1]?.cells[player.position.row + 0],
    ].filter(x => x);

    const isOnSquare = player.position.col === player.position.row;
    const buttons = nextCells.map(x => ({
        key: `${x.row} ${x.col}`,
        text: `${x.value}${isOnSquare && player.position.col === x.col ? `↕` : isOnSquare && player.position.row === x.row ? `↔` : ``}`,
        onPress: () => onMove(x),
    }));

    return {
        key: `${gameBoard.key}`,
        buttons: shuffle(buttons),
    };
};

const inputStyles = {
    outerContainer: {
        height: 150,
    },
    container: {
        flexDirection: `row`,
        justifyContent: `space-around`,
        margin: 16,
    },
    buttonView: {
        width: 48,
        height: 48,
        borderWidth: 2,
        borderColor: `#6666FF`,
        borderStyle: `solid`,
        justifyContent: `center`,
        alignItems: `center`,
    },
    buttonText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 24,
        color: `#FFFFFF`,
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

    console.log(`GameInput`, { gameInput });
    return (
        <>
            <View style={inputStyles.outerContainer}>
                <View style={[inputStyles.container, { transform: `translate(0px,${y}px)` }]}>
                    {gameInput.buttons.map(x => (
                        <TouchableOpacity key={x.key} onPress={x.onPress}>
                            <View style={inputStyles.buttonView}>
                                <Text style={inputStyles.buttonText}>{x.text}</Text>
                            </View>
                        </TouchableOpacity>))}
                </View>
            </View>
        </>
    );
};


const scoreStyles = {
    container: {
        flex: 1,
        alignItems: `center`,
        margin: 16,
    },
    text: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 14,
        color: `#FFFF00`,
    },
    mistakesText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 14,
        color: `#FF6666`,
    },
} as const;

type GameScoreState = {
    startTime: number;
    gameOverTime?: number;
    score: number;
};

const GameScore = ({ gameScore }: { gameScore: GameScoreState }) => {

    const [timeMessage, setTimeMessage] = useState(``);
    const [scoreMessage, setScoreMessage] = useState(``);

    useEffect(() => {
        const id = setInterval(() => {

            setScoreMessage(`${gameScore.score}`);

            if (gameScore.gameOverTime) {
                const timeMs = gameScore.gameOverTime - gameScore.startTime;
                setTimeMessage(s => `${(timeMs / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} seconds`);
                return;
            }

            const timeMs = Date.now() - gameScore.startTime;
            setTimeMessage(s => `${(timeMs / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} seconds`);
        }, 100);
        return () => clearInterval(id);
    }, [gameScore]);

    // console.log(`GameInput`);
    return (
        <>
            <View style={scoreStyles.container}>
                {/* <View>
                    <Text style={scoreStyles.text}>{timeMessage}</Text>
                </View> */}
                <View>
                    <Text style={scoreStyles.text}>{scoreMessage}</Text>
                </View>
            </View>
        </>
    );
};
