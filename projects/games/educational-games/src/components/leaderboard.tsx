import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from '@ricklove/react-native-lite';

export const createLeaderboard = <TScoreState extends {}>(args: {
  storageKey: string;
  sortKey: (item: TScoreState) => string | number;
  sortDescending?: boolean;
  scoreColumns: { name: string; getValue: (item: TScoreState) => string }[];
}) => {
  type LeaderboardScore = { name: string; score: TScoreState };
  const leaderboard = {
    saveScore: (name: string, score: TScoreState) => {
      const data = leaderboard.loadScore();

      data.push({ name, score });
      data.sort((a, b) => (args.sortKey(a.score) < args.sortKey(b.score) ? -1 : 1));

      localStorage.setItem(args.storageKey, JSON.stringify(data));
    },
    loadScore: () => {
      const json = localStorage.getItem(args.storageKey);
      if (!json) {
        return [];
      }

      const data = JSON.parse(json) as LeaderboardScore[];
      data.sort((a, b) => (args.sortKey(a.score) > args.sortKey(b.score) ? -1 : 1) * (args.sortDescending ? -1 : 1));
      return data;
    },
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
        <TextInput
          style={leaderboardInputStyles.textInput}
          value={name}
          onChange={setName}
          placeholder='Name'
          keyboardType='default'
          autoCompleteType='off'
        />
        <TouchableOpacity onPress={() => !!name && props.onSubmit(name)} style={!name ? { opacity: 0.5 } : {}}>
          <View style={leaderboardInputStyles.buttonView}>
            <Text style={leaderboardInputStyles.buttonText}>Save Score</Text>
          </View>
        </TouchableOpacity>
      </View>
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

  const LeaderboardViewInner = (props: { scores: LeaderboardScore[] }) => {
    return (
      <View style={leaderboardStyles.container}>
        <View style={leaderboardStyles.scoreView}>
          <Text style={leaderboardStyles.nameText}>Leaderboard</Text>
          {args.scoreColumns.map((x) => (
            <Text key={x.name} style={leaderboardStyles.scoreText} />
          ))}
        </View>
        <View style={leaderboardStyles.scoreView}>
          <Text style={leaderboardStyles.nameText}>Name</Text>
          {args.scoreColumns.map((x) => (
            <Text key={x.name} style={leaderboardStyles.scoreText}>
              {x.name}
            </Text>
          ))}
        </View>
        {props.scores.map((x) => (
          <View style={leaderboardStyles.scoreView}>
            <Text style={leaderboardStyles.nameText}>{x.name}</Text>
            {args.scoreColumns.map((c) => (
              <Text key={x.name} style={leaderboardStyles.scoreText}>
                {c.getValue(x.score)}
              </Text>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const useLeaderboard = ({ getScore }: { getScore: () => TScoreState }) => {
    const [leaderboardScores, setLeaderboardScores] = useState({ scores: leaderboard.loadScore() } as {
      scores: LeaderboardScore[];
    });

    const LeaderboardArea = (props: { gameOver: boolean; onScoreSaved: () => void }) => {
      const onSaveScore = (name: string) => {
        leaderboard.saveScore(name, getScore());
        setLeaderboardScores({ scores: leaderboard.loadScore() });
        props.onScoreSaved();
      };

      return (
        <>
          {!!props.gameOver && <LeaderboardNameInput onSubmit={onSaveScore} />}
          <LeaderboardViewInner scores={leaderboardScores.scores} />
        </>
      );
    };

    return {
      LeaderboardArea,
    };
  };

  return {
    useLeaderboard,
  };
};
