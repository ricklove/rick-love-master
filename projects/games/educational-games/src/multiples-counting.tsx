import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from '@ricklove/react-native-lite';
import { distinct, shuffle } from '@ricklove/utils-core';
import { createLeaderboard } from './components/leaderboard';
import { ProgressGameService } from './progress-games/progress-game';

const leaderboardService = createLeaderboard<{
  mistakes: number;
  timeMs: number;
}>({
  storageKey: `MultiplesCountingLeaderboard`,
  sortKey: (x) => x.timeMs,
  sortDescending: true,
  scoreColumns: [
    {
      name: `Time`,
      getValue: (x) =>
        `${(x.timeMs / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`,
    },
    { name: `Mistakes`, getValue: (x) => `${x.mistakes}` },
  ],
});

export const EducationalGame_MultiplesCounting = (props: {}) => {
  const [gameScore, setGameScore] = useState({
    key: 0,
    startTime: Date.now(),
    gameWonTime: undefined,
    mistakes: 0,
  } as GameScoreState & { key: number });
  const [gameBoard, setGameBoard] = useState(createDefaultGameBoardState());
  const [gameInput, setGameInput] = useState(null as null | GameInputState);
  const lastGameBoard = useRef(gameBoard);

  const leaderboard = leaderboardService.useLeaderboard({
    getScore: () => ({
      mistakes: gameScore.mistakes,
      timeMs: (gameScore.gameWonTime ?? Date.now()) - gameScore.startTime,
    }),
  });

  const onGameWon = () => {
    setGameScore((s) => ({ ...s, gameWonTime: Date.now(), key: s.key + 1 }));
  };

  const onScoreSaved = () => {
    // Restart Game
    const newGameBoard = createDefaultGameBoardState();
    setGameScore({ key: 0, startTime: Date.now(), gameWonTime: undefined, mistakes: 0 });
    setGameBoard(newGameBoard);
    nextInputState(newGameBoard);
  };

  const onCorrect = (value: { multiple: number; times: number }) => {
    ProgressGameService.onCorrect();

    const newGameBoard = { ...lastGameBoard.current };
    const col = newGameBoard.columns.find((x) => x.multiple === value.multiple);
    if (col) {
      col.maxTimesCorrect = value.times;
    }

    setGameBoard(newGameBoard);
    // setGameInput(null);

    setTimeout(() => {
      nextInputState(newGameBoard);
    }, 100);
  };
  const onWrong = (value: { multiple: number; times: number }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setGameInput((s) => ({ ...s! }));

    setGameScore((s) => ({ ...s, mistakes: s.mistakes + 1, key: s.key + 1 }));

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
      <View style={{ marginTop: 50, marginBottom: 150, padding: 2, alignItems: `center` }}>
        <View style={{ width: 24 * 12 + 4 }}>
          <GameScore gameScore={gameScore} />
          <GameBoard gameBoard={gameBoard} focus={gameInput?.focus ?? { multiple: 0, times: 0 }} />
          {gameInput && !gameScore.gameWonTime && <GameInput gameInput={gameInput} />}
          <leaderboard.LeaderboardArea gameOver={!!gameScore.gameWonTime} onScoreSaved={onScoreSaved} />
        </View>
      </View>
    </>
  );
};

type GameBoardState = {
  size: number;
  rows: { times: number }[];
  columns: {
    multiple: number;
    maxTimesCorrect: number;
  }[];
};

const createDefaultGameBoardState = (): GameBoardState => {
  const size = 12;
  const gameBoard: GameBoardState = {
    size,
    rows: [...new Array(size)].map((x, i) => ({ times: i + 1 })),
    columns: [...new Array(size)].map((x, i) => ({ multiple: i + 1, maxTimesCorrect: 0 })),
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

const GameBoard = ({ gameBoard, focus }: { gameBoard: GameBoardState; focus: { multiple: number; times: number } }) => {
  const [boardTick, setboardTick] = useState(0);

  useEffect(
    () => {
      setboardTick(0);
      const id = setInterval(() => {
        setboardTick((s) => s + 1);
      }, 1000);
      return () => clearInterval(id);
    },
    [
      /* Keep Going */
    ],
  );

  const getBoardTickResult = () => {
    return boardTick % 5 === 0 ? `row` : boardTick % 5 === 1 ? `col` : `both`;
  };

  const getBorderStyle = () => {
    const s = getBoardTickResult();

    if (s === `both`) {
      return {
        borderLeftColor: styles.focusCellView.borderColor,
        borderRightColor: styles.focusCellView.borderColor,
        borderTopColor: styles.focusCellView.borderColor,
        borderBottomColor: styles.focusCellView.borderColor,
      } as const;
    }

    return {
      borderLeftColor: !s.includes(`col`) ? `rgba(0,0,0,0.15)` : `#000000`,
      borderRightColor: !s.includes(`col`) ? `rgba(0,0,0,0.15)` : `#000000`,
      borderTopColor: !s.includes(`row`) ? `rgba(0,0,0,0.15)` : `#000000`,
      borderBottomColor: !s.includes(`row`) ? `rgba(0,0,0,0.15)` : `#000000`,
    } as const;
  };

  const getCellText = (col: number, row: number) => {
    const s = getBoardTickResult();

    if (s === `both`) {
      return `${col * row}`;
    }

    return ``;
    // if (s === `row`) {
    //     return `${col}`;
    // }

    // return `${row}`;
  };

  return (
    <>
      <View style={{ flexDirection: `row` }}>
        <View style={{ flexDirection: `column-reverse` }}>
          <View style={styles.focusCellHeaderView}>
            <Text style={styles.focusCellHeaderText}>x</Text>
          </View>
          {gameBoard.rows.map((r) => (
            <View key={r.times} style={focus.times === r.times ? styles.focusCellHeaderView : styles.cellHeaderView}>
              <Text
                style={focus.times === r.times ? styles.focusCellHeaderText : styles.cellHeaderText}
              >{`${r.times}`}</Text>
            </View>
          ))}
        </View>

        {gameBoard.columns.map((c) => (
          <View key={c.multiple} style={{ flexDirection: `column-reverse` }}>
            <View style={focus.multiple === c.multiple ? styles.focusCellHeaderView : styles.cellHeaderView}>
              <Text
                style={focus.multiple === c.multiple ? styles.focusCellHeaderText : styles.cellHeaderText}
              >{`${c.multiple}`}</Text>
            </View>
            {gameBoard.rows.map((r) => (
              <View
                key={r.times}
                style={
                  focus.times >= r.times && focus.multiple >= c.multiple
                    ? [styles.focusCellView, getBorderStyle()]
                    : styles.cellView
                }
              >
                {c.maxTimesCorrect >= r.times ? (
                  <Text style={styles.cellText}>{`${getCellText(c.multiple, r.times)}`}</Text>
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
  focus: { multiple: number; times: number };
  buttons: {
    value: number;
    text: string;
    onPress: () => void;
    wasAnsweredWrong: boolean;
  }[];
};

const createGameInputState = (
  gameBoard: GameBoardState,
  onGameWon: () => void,
  onCorrect: (value: { multiple: number; times: number }) => void,
  onWrong: (value: { multiple: number; times: number }) => void,
): GameInputState => {
  const nextColumn = gameBoard.columns.filter((x) => x.maxTimesCorrect < gameBoard.size)[0];
  if (!nextColumn) {
    // Win state - All Complete
    onGameWon();
    return { key: ``, focus: { multiple: 0, times: 0 }, buttons: [] };
  }

  const m = nextColumn.multiple;
  const t = nextColumn.maxTimesCorrect + 1;

  const correctValue = m * t;
  const wrongAnswerCount = 4;
  const wrongValues = distinct(
    [...new Array(100)]
      .map(
        () =>
          Math.round(m + 1 - 2 * Math.random()) * Math.round(t + 1 - 2 * Math.random()) +
          Math.round(2 - 4 * Math.random()),
      )
      .filter((x) => x !== correctValue)
      .filter((x) => x > 0),
  ).slice(0, wrongAnswerCount);

  const answers = shuffle([correctValue, ...wrongValues]);

  const onAnswer = (value: number) => {
    if (value === correctValue) {
      onCorrect({ multiple: m, times: t });
      return;
    }

    const button = buttons.find((x) => x.value === value);
    if (!button) {
      return;
    }
    button.wasAnsweredWrong = true;
    onWrong({ multiple: m, times: t });
  };

  const buttons = answers.map((x) => ({
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
  buttonText_wrong: {
    fontFamily: `"Lucida Console", Monaco, monospace`,
    fontSize: 24,
    color: `#FF6666`,
  },
} as const;

const GameInput = ({ gameInput }: { gameInput: GameInputState }) => {
  const [y, setY] = useState(0);

  useEffect(() => {
    setY(100);
    const id = setInterval(() => {
      setY((s) => Math.max(0, s - 1));
    }, 50);
    return () => clearInterval(id);
  }, [gameInput.key]);

  // // Auto answer
  // useEffect(() => {
  //     const id = setInterval(() => {
  //         gameInput.buttons[randomIndex(gameInput.buttons.length)].onPress();
  //     }, 50);
  //     return () => clearInterval(id);
  // }, [gameInput.key]);

  return (
    <>
      <View style={inputStyles.outerContainer}>
        <View style={[inputStyles.container, { transform: `translate(0px,${y}px)` }]}>
          {gameInput.buttons.map((x) => (
            <TouchableOpacity
              key={x.text + gameInput.key}
              onPress={
                x.wasAnsweredWrong
                  ? () => {
                      /* Ignore */
                    }
                  : x.onPress
              }
            >
              <View style={inputStyles.buttonView}>
                <Text style={x.wasAnsweredWrong ? inputStyles.buttonText_wrong : inputStyles.buttonText}>{x.text}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  gameWonTime?: number;
  mistakes: number;
};

const GameScore = ({ gameScore }: { gameScore: GameScoreState }) => {
  const [timeMessage, setTimeMessage] = useState(``);
  const [mistakesMessage, setMistakesMessage] = useState(``);

  useEffect(() => {
    const id = setInterval(() => {
      setMistakesMessage(gameScore.mistakes ? `${gameScore.mistakes ?? 0} Mistakes` : ``);

      if (gameScore.gameWonTime) {
        const timeMs = gameScore.gameWonTime - gameScore.startTime;
        setTimeMessage(
          (s) =>
            `${(timeMs / 1000).toLocaleString(undefined, {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })} seconds`,
        );
        return;
      }

      const timeMs = Date.now() - gameScore.startTime;
      setTimeMessage(
        (s) =>
          `${(timeMs / 1000).toLocaleString(undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })} seconds`,
      );
    }, 100);
    return () => clearInterval(id);
  }, [gameScore]);

  // console.log(`GameInput`);
  return (
    <>
      <View style={scoreStyles.container}>
        <View>
          <Text style={scoreStyles.text}>{timeMessage}</Text>
        </View>
        <View>
          <Text style={scoreStyles.mistakesText}>{mistakesMessage}</Text>
        </View>
      </View>
    </>
  );
};
