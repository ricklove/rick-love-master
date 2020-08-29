/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native-lite';
import { createMultiplesProblemService } from './problems/multiples';
import { ProblemService } from './problems/problems-service';
import { GamepadAnalogStateful, GamepadPressState } from './components/game-pad-analog';

export const EducationalGame_StarBlast_Multiples = (props: {}) => {
    return <EducationalGame_StarBlast problemService={createMultiplesProblemService({})} />;
};

export const EducationalGame_StarBlast = (props: { problemService: ProblemService }) => {

    const [pressState, setPressState] = useState({ moveDirection: { x: 0, y: 0 }, buttons: [] } as GamepadPressState);
    const onPressStateChange = (value: GamepadPressState) => {
        // console.log(`onPressStateChange`, { ...x, dir: { ...x.moveDirection }, buttons: x.buttons.map(b => ({ ...b })) });
        setPressState(value);
    };

    return (
        <>
            <View style={{ marginTop: 50, marginBottom: 150, padding: 2, alignItems: `center` }} >
                <View style={{ alignItems: `center` }} >
                    <GameView pressState={pressState} />
                    <GamepadAnalogStateful style={colors.gamepad} onPressStateChange={onPressStateChange} buttons={[{ key: `A`, text: `A` }]} />
                </View>
            </View>
        </>
    );
};

const colors = {
    gamepad: {
        backgroundColor: `#333333`,
        borderColor: `#000033`,
    },
    viewscreen: {
        borderColor: `#000033`,
        backgroundColor: `#000000`,
    },
};

const gameStyles = {
    viewscreenView: {
        height: 300,
        width: 300,
        backgroundColor: colors.viewscreen.backgroundColor,
        borderColor: colors.viewscreen.borderColor,
        borderWidth: 1,
        borderStyle: `solid`,
    },
    player: {
        view: {},
        text: {
            fontFamily: `"Lucida Console", Monaco, monospace`,
            fontSize: 12,
        },
    },
} as const;

const GameView = (props: { pressState: GamepadPressState }) => {

    const pressState = useRef(props.pressState);
    pressState.current = props.pressState;

    const playerPos = useRef({ x: 0, y: 0 });


    const [renderId, setRenderId] = useState(0);

    useEffect(() => {
        // Game Loop
        const gameLoop = () => {
            if (!pressState.current.moveDirection.x
                && !pressState.current.moveDirection.y) {
                // No change
                requestAnimationFrame(gameLoop);
                return;
            }

            // console.log(`gameLoop Update`);

            // Update
            playerPos.current = {
                x: playerPos.current.x + pressState.current.moveDirection.x,
                y: playerPos.current.y + pressState.current.moveDirection.y,
            };
            requestAnimationFrame(gameLoop);
            setRenderId(s => s + 1);
        };

        requestAnimationFrame(gameLoop);
    }, []);

    const playerStylePosition = {
        transform: `translate(${playerPos.current.x}px, ${playerPos.current.y}px)`,
    };

    // console.log(`GameView render`, { playerStylePosition });

    return (
        <>
            <View style={gameStyles.viewscreenView} >
                <View style={[gameStyles.player.view, playerStylePosition]}><Text style={gameStyles.player.text}>💥</Text></View>
            </View>
        </>
    );
};
