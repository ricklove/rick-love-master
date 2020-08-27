import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native-lite';
import { distinct, shuffle, groupItems } from 'utils/arrays';
import { randomIndex } from 'utils/random';
import { Stats } from 'fs';
import { toKeyValueObject, toKeyValueArray } from 'utils/objects';

type LeaderboardScore = { name: string, score: { score: number, timeMs: number } };
const leaderboard = {
    saveScore: (name: string, score: GameScoreState) => {
        const data = leaderboard.loadScore();
        data.push({ name, score: { score: score.score, timeMs: (score.gameOverTime ?? Date.now()) - score.startTime } });
        data.sort((a, b) => b.score.score - a.score.score);

        localStorage.setItem(`MultiplesSnakeLeaderboard`, JSON.stringify(data));
    },
    loadScore: () => {
        const json = localStorage.getItem(`MultiplesSnakeLeaderboard`);
        if (!json) { return []; }

        return JSON.parse(json) as LeaderboardScore[];

        // const scores: LeaderboardScore[] = [
        //     { name: `Rick`, score: { mistakes: 0, timeMs: 10.78 * 1000 } },
        //     { name: `Rick`, score: { mistakes: 0, timeMs: 10.78 * 1000 } },
        //     { name: `Rick`, score: { mistakes: 0, timeMs: 10.78 * 1000 } },
        //     { name: `Rick`, score: { mistakes: 0, timeMs: 10.78 * 1000 } },
        //     { name: `Rick`, score: { mistakes: 0, timeMs: 10.78 * 1000 } },
        //     { name: `Rick`, score: { mistakes: 0, timeMs: 10.78 * 1000 } },
        //     { name: `Rick`, score: { mistakes: 0, timeMs: 10.78 * 1000 } },
        // ];
        // return scores;
    },
};

export const EducationalGame_MultiplesSnake = (props: {}) => {

    const [leaderboardScores, setLeaderboardScores] = useState({ scores: leaderboard.loadScore() } as { scores: LeaderboardScore[] });
    const [gameScore, setGameScore] = useState({ key: 0, startTime: Date.now(), gameOverTime: undefined, score: 0 } as GameScoreState & { key: number });
    const [gameBoard, setGameBoard] = useState(createDefaultGameBoardState());
    const [gameInput, setGameInput] = useState(null as null | GameInputState);
    const lastGameBoard = useRef(gameBoard);

    const onGameOver = () => {
        setGameScore(s => ({ ...s, gameOverTime: Date.now(), key: s.key + 1 }));
    };

    const onSaveScore = (name: string) => {
        leaderboard.saveScore(name, gameScore);
        setLeaderboardScores({ scores: leaderboard.loadScore() });

        // Restart Game
        const newGameBoard = createDefaultGameBoardState();
        setGameScore({ key: 0, startTime: Date.now(), gameOverTime: undefined, score: 0 });
        setGameBoard(newGameBoard);
        nextInputState(newGameBoard);
    };

    const onMove = (value: { col: number, row: number }) => {
        const newGameBoard = { ...lastGameBoard.current };

        // Add Body in old position
        newGameBoard.body.push({ position: newGameBoard.player.position });

        // Add Score (of old cell, so end game will be correct)
        const oldPlayerCell = newGameBoard.columns[newGameBoard.player.position.col].cells[newGameBoard.player.position.row];
        setGameScore(s => ({ ...s, score: s.score + oldPlayerCell.value }));

        // Move Player
        newGameBoard.player.position = value;
        const newPlayerCell = newGameBoard.columns[newGameBoard.player.position.col].cells[newGameBoard.player.position.row];


        // Player Dead
        if (newPlayerCell.state === `body`) {
            newGameBoard.isGameOver = true;
            updateBoard(newGameBoard);
            setGameBoard(newGameBoard);
            onGameOver();
            return;
        }

        // Update body
        moveBody(newGameBoard);

        // Game Won
        if (newGameBoard.body.length + 1 === maxMultiple * maxMultiple) {
            newGameBoard.isGameWon = true;
            setGameScore(s => ({ ...s, score: s.score + newPlayerCell.value }));
            updateBoard(newGameBoard);
            setGameBoard(newGameBoard);
            onGameOver();
            return;
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
                    {!!gameScore.gameOverTime && (<LeaderboardNameInput onSubmit={onSaveScore} />)}
                    <LeaderboardView scores={leaderboardScores.scores} />
                </View>
            </View>
        </>
    );
};


type GameBoardState = {
    key: number;
    isGameOver: boolean;
    isGameWon: boolean;
    maxTimes: number;
    columns: {
        col: number;
        cells: GameBoardCell[];
    }[];
    player: {
        position: GameBoardPosition;
    };
    body: {
        position: GameBoardPosition;
    }[];
};

type GameBoardPosition = {
    col: number;
    row: number;
};

type GameBoardCell = {
    col: number;
    row: number;
    value: number;
    state: 'blank' | 'body' | 'player';
    bodyIndex: number;
    connected: {
        t: boolean;
        b: boolean;
        l: boolean;
        r: boolean;
    };
};

const maxMultiple = 12;

const createDefaultGameBoardState = (): GameBoardState => {

    const gameBoard: GameBoardState = {
        key: 0,
        isGameOver: false,
        isGameWon: false,
        maxTimes: maxMultiple,
        columns: [...new Array(maxMultiple)].map((x, i) => ({
            col: i,
            cells: [...new Array(maxMultiple)].map((r, j) => ({
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
        player: { position: { col: randomIndex(maxMultiple), row: randomIndex(maxMultiple) } },
        body: [],
    };

    // Randomly place player
    updateBoard(gameBoard);

    return gameBoard;
};

let tick = 0;
const moveBody = (board: GameBoardState) => {
    updateBoard(board);
    const newBoard = board;

    // Shrink Body
    tick++;
    // if (tick % 2 === 1) {
    //     newBoard.body.shift();
    // }

    // const p = board.player;
    // board.monsters.forEach(mon => {
    //     const m = mon;
    //     const colDiff = p.position.col - m.position.col;
    //     const rowDiff = p.position.row - m.position.row;
    //     if (Math.abs(colDiff) >= Math.abs(rowDiff)) {
    //         m.position = { ...m.position, col: m.position.col + Math.sign(colDiff) };
    //     } else {
    //         m.position = { ...m.position, row: m.position.row + Math.sign(rowDiff) };
    //     }


    // });

    // // Spawn random monster
    // if (Math.random() < 0.25) {
    //     const newMonster = { position: { col: randomIndex(maxMultiple), row: randomIndex(maxMultiple) } };
    //     if (Math.random() < 0.5) {
    //         if (Math.random() < 0.5) {
    //             newMonster.position.col = 0;
    //         } else {
    //             newMonster.position.col = maxMultiple - 1;
    //         }
    //     } else {
    //         // eslint-disable-next-line no-lonely-if
    //         if (Math.random() < 0.5) {
    //             newMonster.position.row = 0;
    //         } else {
    //             newMonster.position.row = maxMultiple - 1;
    //         }
    //     }

    //     board.monsters.push(newMonster);
    // }

    // // Remove monsters that run into answer
    // const monsters = [...board.monsters];
    // const deadMonsters = monsters.filter(m => board.columns[m.position.col].cells[m.position.row].state === `answer`);
    // const liveMonsters = monsters.filter(m => board.columns[m.position.col].cells[m.position.row].state !== `answer`);

    // // Dead monsters destroy answer
    // deadMonsters.forEach(m => {
    //     newBoard.columns[m.position.col].cells[m.position.row].state = `blank`;
    // });

    // newBoard.monsters = liveMonsters;

    updateBoard(newBoard);
};

const updateBoard = (boardRaw: GameBoardState) => {
    const board = boardRaw;
    board.key += 1;
    board.columns.forEach(c => c.cells.forEach(cellRaw => {
        const cell = cellRaw;
        if (cell.state === `body`) { cell.state = `blank`; }
        if (cell.state === `player`) { cell.state = `body`; }

        cell.connected = {
            t: false,
            b: false,
            l: false,
            r: false,
        };
    }));

    const getConnection = (m: { position: GameBoardPosition }, lastBody?: { position: GameBoardPosition }, nextBody?: { position: GameBoardPosition }) => {
        const connected = {
            t: (m.position.col === lastBody?.position.col && m.position.row < lastBody?.position.row) || (m.position.col === nextBody?.position.col && m.position.row < nextBody?.position.row),
            b: (m.position.col === lastBody?.position.col && m.position.row > lastBody?.position.row) || (m.position.col === nextBody?.position.col && m.position.row > nextBody?.position.row),
            l: (m.position.row === lastBody?.position.row && m.position.col > lastBody?.position.col) || (m.position.row === nextBody?.position.row && m.position.col > nextBody?.position.col),
            r: (m.position.row === lastBody?.position.row && m.position.col < lastBody?.position.col) || (m.position.row === nextBody?.position.row && m.position.col < nextBody?.position.col),
        };
        return connected;
    };

    board.body.forEach((m, i) => {
        updateBoardPosition(board, m.position, `body`, board.body.length - i, getConnection(m, board.body[i - 1], board.body[i + 1] ?? board.player));
    });

    updateBoardPosition(board, board.player.position, `player`, 0, getConnection(board.player, board.body[board.body.length - 1], undefined));
};

const updateBoardPosition = (boardRaw: GameBoardState, position: GameBoardPosition, kind: 'player' | 'body', bodyIndex: number, connected: {
    t: boolean;
    b: boolean;
    l: boolean;
    r: boolean;
}) => {
    const board = boardRaw;
    board.columns[position.col].cells[position.row].state = kind;
    board.columns[position.col].cells[position.row].bodyIndex = bodyIndex;
    board.columns[position.col].cells[position.row].connected = connected;
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

const getCellText = (cell: GameBoardCell, isGameOver: boolean, isGameWon: boolean) => {
    return cell.state === `body` ? `${cell.value}`
        : cell.state === `player` && isGameWon ? `😎`
            : cell.state === `player` && isGameOver ? `💀`
                : cell.state === `player` ? `😀`
                    : ``;
};

const getCellStyle = (boardTick: number, cell: GameBoardCell, bodyLength: number) => {
    return {
        borderTopColor: cell.connected.t ? `transparent` : styles.focusCellView.borderColor,
        borderBottomColor: cell.connected.b ? `transparent` : styles.focusCellView.borderColor,
        borderLeftColor: cell.connected.l ? `transparent` : styles.focusCellView.borderColor,
        borderRightColor: cell.connected.r ? `transparent` : styles.focusCellView.borderColor,
        // opacity: 0.6 + 0.4 * (((boardTick - cell.bodyIndex) % 10) / 10),
        borderWidth: (0.4 + 0.6 * (((boardTick + cell.bodyIndex) % 10) / 10)) * 5,
    };
};

const GameBoard = ({ gameBoard, focus }: { gameBoard: GameBoardState, focus: { col: number, row: number } }) => {

    const [boardTick, setBoardTick] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setBoardTick(s => s + 1);
        }, 500);
        return () => clearInterval(id);
    }, [/* Keep going */]);

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
                            <View key={cell.row} style={cell.state !== `blank` ? [styles.focusCellView, getCellStyle(boardTick, cell, gameBoard.body.length)] : styles.cellView} >
                                <Text style={styles.cellText}>{getCellText(cell, gameBoard.isGameOver, gameBoard.isGameWon)}</Text>
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


const leaderboardInputStyles = {
    container: {
        flex: 1,
        alignItems: `center`,
        margin: 16,
    },
    textInput: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 16,
        color: `#0000FF`,
    },
    buttonView: {
        margin: 4,
        padding: 4,
        borderColor: `#FFFF00`,
        borderStyle: `solid`,
        borderWidth: 1,
        borderRadius: 4,
    },
    buttonText: {
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 16,
        color: `#FFFF00`,
    },
} as const;

const LeaderboardNameInput = (props: { onSubmit: (value: string) => void }) => {
    const [name, setName] = useState(``);
    return (
        <View style={leaderboardInputStyles.container}>
            <TextInput style={leaderboardInputStyles.textInput} value={name} onChange={setName} placeholder='Name' keyboardType='default' autoCompleteType='off' />
            <TouchableOpacity onPress={() => props.onSubmit(name)}>
                <View style={leaderboardInputStyles.buttonView}>
                    <Text style={leaderboardInputStyles.buttonText}>Save Score</Text>
                </View>
            </TouchableOpacity>
        </View >
    );
};


const leaderboardStyles = {
    container: {
        marginTop: 16,
        borderColor: `#FFFFFF`,
        borderStyle: `solid`,
        borderWidth: 1,
        borderRadius: 0,
    },
    scoreView: {
        flexDirection: `row`,
        justifyContent: `space-around`,
        padding: 4,
        borderColor: `#FFFFFF`,
        borderStyle: `solid`,
        borderWidth: 1,
        borderRadius: 0,
    },
    nameText: {
        flex: 2,
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 12,
        color: `#FFFFFF`,
        overflow: `hidden`,
    },
    scoreText: {
        flex: 1,
        textAlign: `right`,
        fontFamily: `"Lucida Console", Monaco, monospace`,
        fontSize: 12,
        color: `#FFFF00`,
    },
} as const;

const LeaderboardView = (props: { scores: LeaderboardScore[] }) => {

    return (
        <View style={leaderboardStyles.container}>
            <View style={leaderboardStyles.scoreView}>
                <Text style={leaderboardStyles.nameText}>Leaderboard</Text>
                <Text style={leaderboardStyles.scoreText} />
                <Text style={leaderboardStyles.scoreText} />
            </View>
            <View style={leaderboardStyles.scoreView}>
                <Text style={leaderboardStyles.nameText}>Name</Text>
                <Text style={leaderboardStyles.scoreText}>Seconds</Text>
                <Text style={leaderboardStyles.scoreText}>Score</Text>
            </View>
            {props.scores.map((x, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <View key={`${i}${x.name}${x.score}`} style={leaderboardStyles.scoreView}>
                    <Text style={leaderboardStyles.nameText}>{x.name}</Text>
                    <Text style={leaderboardStyles.scoreText}>{`${(x.score.timeMs / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`}</Text>
                    <Text style={leaderboardStyles.scoreText}>{`${x.score.score}`}</Text>
                </View>
            ))}
        </View>
    );
};
