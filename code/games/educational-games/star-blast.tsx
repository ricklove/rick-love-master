/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native-lite';
import { idText } from 'typescript';
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
        viewSize: { width: 32, height: 32 },
        text: {
            fontFamily: `"Lucida Console", Monaco, monospace`,
            fontSize: 32,
        },
    },
} as const;

type GamePosition = {
    x: number;
    y: number;
    rotation: number;
};


const GameView = (props: { pressState: GamepadPressState }) => {

    const pressState = useRef(props.pressState);
    pressState.current = props.pressState;

    const playerPos = useRef({ x: 0, y: 0, rotation: 0 } as GamePosition);
    const projectilesState = useRef({ lastShotTime: 0, shots: [] } as ProjectilesState);


    const [renderId, setRenderId] = useState(0);

    useEffect(() => {
        // Game Loop
        const gameStart = Date.now();
        let gameLastTime = Date.now();
        const gameLoop = () => {
            const gameTime = (Date.now() - gameStart) / 1000;
            const gameDeltaTime = (Date.now() - gameLastTime) / 1000;
            gameLastTime = Date.now();

            // if (!pressState.current.moveDirection.x
            //     && !pressState.current.moveDirection.y) {
            //     // No change
            //     requestAnimationFrame(gameLoop);
            //     return;
            // }

            // console.log(`gameLoop Update`);

            // Update

            // Player
            const playerResult = updatePlayer({ gameDeltaTime, pressState: pressState.current, playerPos: playerPos.current });
            playerPos.current = playerResult.playerPos;

            // Projectiles
            const projectilesResult = updateProjectiles({ gameTime, gameDeltaTime, pressState: pressState.current, playerPos: playerPos.current, projectilesState: projectilesState.current });
            projectilesState.current = projectilesResult;

            // Game Loop
            requestAnimationFrame(gameLoop);
            setRenderId(s => s + 1);
        };

        requestAnimationFrame(gameLoop);
    }, []);


    // console.log(`GameView render`, { playerStylePosition });

    return (
        <>
            <View style={gameStyles.viewscreenView} >
                <Sprite kind='player' position={playerPos.current} />
                {projectilesState.current.shots.map(x => (
                    <Sprite key={x.key} kind='shot' position={x.pos} />
                ))}
            </View>
        </>
    );
};


const updatePlayer = ({ gameDeltaTime, pressState, playerPos }: { gameDeltaTime: number, pressState: GamepadPressState, playerPos: GamePosition }) => {
    const targetRotation = pressState.moveDirection.x * 0.05;

    const pos = {
        x: playerPos.x + pressState.moveDirection.x * gameDeltaTime * 250,
        y: playerPos.y - pressState.moveDirection.y * gameDeltaTime * 250,
        rotation: playerPos.rotation * 0.9 + targetRotation * 0.1,
    };

    const w = gameStyles.viewscreenView.width;
    const gw = gameStyles.player.viewSize.width * 0.5;
    const h = gameStyles.viewscreenView.height;
    const gh = gameStyles.player.viewSize.height * 0.5;
    pos.x = pos.x < gw ? gw : pos.x > w - gw ? w - gw : pos.x;
    pos.y = pos.y < gh ? gh : pos.y > h - gh ? h - gh : pos.y;

    return { playerPos: pos };
};

type ProjectilesState = {
    lastShotTime: number;
    shots: { key: string, pos: GamePosition }[];
};
const updateProjectiles = ({ gameTime, gameDeltaTime, pressState, playerPos, projectilesState }: { gameTime: number, gameDeltaTime: number, pressState: GamepadPressState, playerPos: GamePosition, projectilesState: ProjectilesState }): ProjectilesState => {
    const { shots, lastShotTime } = projectilesState;

    const canShoot = gameTime > 0.25 + lastShotTime;

    console.log(`updateProjectiles`, { canShoot, gameTime, lastShotTime });

    const didShoot = canShoot && pressState.buttons.find(x => x.key === `A`)?.isDown;
    if (didShoot) {
        shots.push({ key: `${lastShotTime}`, pos: { ...playerPos } });
    }

    // Move shots
    shots.forEach(x => {
        x.pos.y += -250 * gameDeltaTime;
    });

    // Remove shots offscreen
    const newShots = shots.filter(x => x.pos.y > 0);

    return {
        lastShotTime: didShoot ? gameTime : lastShotTime,
        shots: newShots,
    };
};

type SpriteKind = 'player' | 'shot';
const getSpriteEmoji = (kind: SpriteKind) => {
    // ❤💙💚😀🤣😃😁😂😄😉😆😅😊😋😎🥰😙☺🤩🙄😑😐😣🤐😫🤢😬😭🤯🤒😡🤓🤠👽💀👻☠🤖👾😺🙀🙈🙉🙊🐵🐱‍🐉🐶🦁🐯🐺🐱🦒🦊🦝🐗🐷🐮🐭🐹🐰🐼🐨🐻🐸🦓🐴🚀🛸⛵🛰🚁💺🚤🛥⛴⚓🪐🌌🌍🌏🌎✈🛩🚂🚘🚔🚍🚖🔥💧❄⚡🌀🌈☄🌠⭐
    switch (kind) {
        case `player`: return { text: `🚀`, rotation: -0.125, offsetX: -0.25, offsetY: 0 };
        case `shot`: return { text: `🔥`, rotation: 0.5 };
        default: return { text: `😀` };
    }
};

const Sprite = ({ kind, position }: { kind: SpriteKind, position: { x: number, y: number, rotation: number } }) => {
    const s = getSpriteEmoji(kind);
    const size = gameStyles.player.viewSize;
    const { fontSize } = gameStyles.player.text;

    const stylePosition = {
        position: `absolute`,
        ...size,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotation ?? 0}turn)`,
        // backgroundColor: `red`,
    };
    const styleRotation = {
        ...size,
        transform: `translate( ${size.width * -0.5 + Math.floor((s.offsetX ?? 0) * fontSize)}px, ${size.height * -0.5 + Math.floor((s.offsetY ?? 0) * fontSize)}px) rotate(${s.rotation ?? 0}turn)`,
    };
    return (
        <View style={stylePosition}>
            <View style={styleRotation}>
                <Text style={gameStyles.player.text}>{s.text}</Text>
            </View>
        </View>
    );
};
