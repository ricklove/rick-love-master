/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native-lite';
import { createMultiplesProblemService } from './problems/multiples';
import { ProblemService, Problem } from './problems/problems-service';
import { GamepadAnalogStateful, GamepadPressState } from './components/game-pad-analog';
import { getDistanceSq, Vector2 } from './utils/vectors';

export const EducationalGame_StarBlast_Multiples = (props: {}) => {
    return <EducationalGame_StarBlast problemService={createMultiplesProblemService({ min: 1, max: 12 })} />;
};

export const EducationalGame_StarBlast = (props: { problemService: ProblemService }) => {

    const [pressState, setPressState] = useState({ moveDirection: { x: 0, y: 0 }, buttons: [] } as GamepadPressState);
    const onPressStateChange = (value: GamepadPressState) => {
        // console.log(`onPressStateChange`, { ...x, dir: { ...x.moveDirection }, buttons: x.buttons.map(b => ({ ...b })) });
        setPressState(value);
    };

    return (
        <>
            <View style={{ position: `relative` }}>
                <View style={{ marginTop: 50, marginBottom: 150, padding: 2, alignItems: `center` }} >
                    <View style={{ alignItems: `center` }} >
                        <GameView pressState={pressState} problemService={props.problemService} />
                        <Pressable style={{ position: `absolute`, top: 0, bottom: 0, left: 0, right: 0, opacity: 0 }} onPressIn={() => { }} onPressOut={() => { }} />
                        <View style={{ zIndex: 10, flex: 1, alignSelf: `stretch` }}>
                            <GamepadAnalogStateful style={colors.gamepad} onPressStateChange={onPressStateChange} buttons={[{ key: `A`, text: `🔥` }]} />
                        </View>
                    </View>
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
    sprite: {
        viewSize: { width: 32, height: 32 },
        text: {
            fontFamily: `"Lucida Console", Monaco, monospace`,
            fontSize: 32,
            textAlign: `center`,
        },
    },
    question: {
        view: { flex: 1, justifyContent: `center`, padding: 4 },
        text: {
            fontFamily: `"Lucida Console", Monaco, monospace`,
            fontSize: 24,
        },
    },
    gameOver: {
        view: { flex: 1, justifyContent: `center`, padding: 4 },
        text: {
            fontFamily: `"Lucida Console", Monaco, monospace`,
            fontSize: 24,
            textAlign: `center`,
        },
    },
} as const;

type GamePosition = {
    x: number;
    y: number;
    rotation: number;
};

type GameState = {
    gameStartTimeMs: number;
    lives: number;
    deadTime?: number;
    gameOver?: boolean;
};


type AnswerState = { key: string, value: string, isCorrect: boolean, isAnsweredWrong: boolean };
const GameView = (props: { pressState: GamepadPressState, problemService: ProblemService }) => {

    const pressState = useRef(props.pressState);
    pressState.current = props.pressState;

    const gameState = useRef({ lives: 3, gameStartTimeMs: Date.now() } as GameState);
    const getGameTime = () => {
        return {
            gameTime: (Date.now() - gameState.current.gameStartTimeMs) / 1000,
        };
    };

    const playerPositionState = useRef({ x: gameStyles.viewscreenView.width * 0.5, y: gameStyles.viewscreenView.height * 0.85, rotation: 0 } as GamePosition);
    const projectilesState = useRef({ lastShotTime: 0, shots: [], debris: [] } as ProjectilesState);
    const enemiesState = useRef({ enemies: [] } as EnemiesState);

    const problemsState = useRef(null as null | { problemTime: number, question: string, answers: (Problem['answers'][0] & { key: string, pos: GamePosition, isAnsweredWrong: boolean })[] });
    const [renderId, setRenderId] = useState(0);

    const gameOver = () => {
        gameState.current = {
            ...gameState.current,
            lives: 0,
            gameOver: true,
        };
    };

    const gotoNextProblem = () => {
        const p = props.problemService.getNextProblem();

        console.log(`gotoNextProblem`, { p });

        if (!p.question) {
            // Game over - problems done
            return;
        }

        const pSize = gameStyles.viewscreenView.width / (p.answers.length);
        const newProblemState = {
            problemTime: getGameTime().gameTime,
            question: p.question,
            answers: p.answers.map((x, i) => ({ ...x, key: `${p.question} ${x.value}`, pos: { x: pSize * (0.5 + i), y: gameStyles.sprite.viewSize.height * 0.5, rotation: 0 }, isAnsweredWrong: false })),
        };
        const newEnemyState = {
            enemies: newProblemState.answers.map((ans, i) => ({
                key: `${p.question} ${ans.value}`,
                answer: ans,
                pos: { x: pSize * (0.5 + i), y: gameStyles.sprite.viewSize.height * 1.5, rotation: 0 },
                vel: { x: 0, y: 5 },
                onHit: () => {
                    setTimeout(() => {
                        console.log(`onHit`, { ans });
                        if (ans.isCorrect) {
                            // TODO: Update score, etc.
                            gotoNextProblem();
                        } else {
                            ans.isAnsweredWrong = true;
                        }
                    });
                },
                destroyed: false,
            })),
        };

        problemsState.current = newProblemState;
        enemiesState.current = newEnemyState;
        setRenderId(s => s + 1);
    };

    useEffect(() => {
        gotoNextProblem();

        // Game Loop
        let gameLastTime = Date.now();
        const gameLoop = () => {
            const { gameTime } = getGameTime();
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

            const getCommonState = (): CommonGameState => {
                return {
                    gameTime,
                    gameDeltaTime,
                    gameState: gameState.current,
                    pressState: pressState.current,
                    playerPosition: playerPositionState.current,
                    projectilesState: projectilesState.current,
                    enemiesState: enemiesState.current,
                    onLoseLife: () => {
                        if (gameState.current.lives <= 1) {
                            // Game over
                            gameOver();
                            return;
                        }
                        projectilesState.current.debris.push({ key: `player${gameTime}`, kind: `player-character`, pos: { ...playerPositionState.current }, vel: { x: 0, y: 0 } });

                        gameState.current = {
                            ...gameState.current,
                            lives: gameState.current.lives - 1,
                            deadTime: gameTime,
                        };
                    },
                };
            };


            // Game
            const gameResult = updateGame(getCommonState());
            gameState.current = gameResult;

            if (!gameState.current.gameOver) {
                // Player
                const playerResult = updatePlayer(getCommonState());
                playerPositionState.current = playerResult.playerPosition;
            }

            // Projectiles
            const projectilesResult = updateProjectiles(getCommonState());
            projectilesState.current = projectilesResult;

            // Enemies
            const enemiesResult = updateEnemies(getCommonState());
            enemiesState.current = enemiesResult;


            // Game Loop
            requestAnimationFrame(gameLoop);
            setRenderId(s => s + 1);
        };

        requestAnimationFrame(gameLoop);
    }, []);


    // console.log(`GameView render`, { playerStylePosition });

    const timeSinceProblem = getGameTime().gameTime - (problemsState.current?.problemTime ?? 0);

    return (
        <>
            <View style={gameStyles.viewscreenView} >
                {[... new Array(gameState.current.lives)].map((x, i) => (
                    <Sprite key={`life${i}`} kind='life' position={{ x: gameStyles.viewscreenView.width - (gameStyles.sprite.viewSize.width * (1 + i)), y: -0.8 * gameStyles.sprite.viewSize.height, rotation: 0 }} />
                ))}
                {projectilesState.current.debris.map(x => (
                    <Sprite key={x.key} kind={x.hasHitGround ? `${x.kind}-splat` as SpriteKind : x.kind} position={x.pos} />
                ))}
                {enemiesState.current?.enemies.filter(x => !x.destroyed).map(x => (
                    <React.Fragment key={x.key}>
                        {!x.answer.isAnsweredWrong && (<Sprite kind='answer' position={{ x: x.pos.x, y: x.pos.y - gameStyles.sprite.viewSize.height, rotation: 0 }} text={x.answer.value} />)}
                        {x.answer.isAnsweredWrong && (<Sprite kind='answer-wrong' position={{ x: x.pos.x, y: x.pos.y - gameStyles.sprite.viewSize.height, rotation: 0 }} />)}
                    </React.Fragment>
                ))}
                {enemiesState.current?.enemies.filter(x => !x.destroyed).map(x => (
                    <React.Fragment key={x.key}>
                        <Sprite kind={x.explodeTime ? `enemy-explode` : `enemy`} position={x.pos} />
                    </React.Fragment>
                ))}
                {!gameState.current.gameOver && !gameState.current.deadTime && (
                    <Sprite kind='player' position={playerPositionState.current} />
                )}
                {projectilesState.current.shots.map(x => (
                    <Sprite key={x.key} kind={x.explodeTime ? `shot-explode` : `shot`} position={x.pos} />
                ))}
                {gameState.current.gameOver && (
                    <View>
                        <View style={{ position: `absolute`, top: gameStyles.viewscreenView.height * 0.5, width: gameStyles.viewscreenView.width }}>
                            <Text style={gameStyles.gameOver.text}>Game Over</Text>
                        </View>
                    </View>
                )}
            </View>
            <View style={[gameStyles.question.view, { transform: `translate(0px,${-Math.max(0, gameStyles.viewscreenView.height * 0.5 - 125 * timeSinceProblem)}px)` }]}>
                <Text style={gameStyles.question.text} >{problemsState.current?.question}</Text>
            </View>
        </>
    );
};

type CommonGameState = { gameTime: number, gameDeltaTime: number, gameState: GameState, pressState: GamepadPressState, playerPosition: GamePosition, projectilesState: ProjectilesState, enemiesState: EnemiesState, onLoseLife: () => void };

const updateGame = ({ gameTime, gameDeltaTime, pressState, playerPosition, gameState }: CommonGameState): GameState => {
    if (gameState.deadTime && gameTime > 3 + gameState.deadTime) {
        return { ...gameState, deadTime: undefined };
    }

    return gameState;
};

const updatePlayer = ({ gameTime, gameDeltaTime, pressState, playerPosition, gameState }: CommonGameState): { playerPosition: GamePosition } => {
    if (gameState.deadTime) { return { playerPosition }; }

    const targetRotation = pressState.moveDirection.x * 0.05;

    const pos = {
        x: playerPosition.x + pressState.moveDirection.x * gameDeltaTime * 250,
        y: playerPosition.y - pressState.moveDirection.y * gameDeltaTime * 250,
        rotation: playerPosition.rotation * 0.9 + targetRotation * 0.1,
    };

    const w = gameStyles.viewscreenView.width;
    const gw = gameStyles.sprite.viewSize.width * 0.5;
    const h = gameStyles.viewscreenView.height;
    const gh = gameStyles.sprite.viewSize.height * 0.5;
    pos.x = pos.x < gw ? gw : pos.x > w - gw ? w - gw : pos.x;
    pos.y = pos.y < gh ? gh : pos.y > h - gh ? h - gh : pos.y;

    return { playerPosition: pos };
};

type ProjectilesState = {
    lastShotTime: number;
    shots: { key: string, pos: GamePosition, explodeTime?: number }[];
    debris: { key: string, vel: Vector2, pos: GamePosition, kind: SpriteKind, hasHitGround?: boolean }[];
};
const updateProjectiles = ({ gameTime, gameDeltaTime, pressState, playerPosition: playerPos, projectilesState, gameState, onLoseLife }: CommonGameState): ProjectilesState => {
    const { shots, debris, lastShotTime } = projectilesState;

    const canShoot = !gameState.deadTime && !gameState.gameOver && gameTime > 0.25 + lastShotTime;

    // console.log(`updateProjectiles`, { canShoot, gameTime, lastShotTime });

    const didShoot = canShoot && pressState.buttons.find(x => x.key === `A`)?.isDown;
    if (didShoot) {
        shots.push({ key: `${lastShotTime}`, pos: { ...playerPos } });
    }

    // Move shots
    shots.forEach(x => {
        if (x.explodeTime) { return; }

        x.pos.y += -250 * gameDeltaTime;
    });

    // Move debris
    debris.forEach(d => {
        if (d.hasHitGround) { return; }

        // Gravity
        d.vel.y += 100 * gameDeltaTime;

        d.pos.y += d.vel.y * gameDeltaTime;
        d.pos.x += d.vel.x * gameDeltaTime;

        const pad = gameStyles.sprite.viewSize.width * 0.5;
        const w = gameStyles.viewscreenView.width;
        if (d.pos.x < pad) { d.pos.x = pad; d.vel.x = -d.vel.x; }
        if (d.pos.x > w - pad) { d.pos.x = w - pad; d.vel.x = -d.vel.x; }

        const hPad = gameStyles.sprite.viewSize.width * 0.8;
        const h = gameStyles.viewscreenView.height;
        if (d.pos.y > h - hPad + Math.random() * 10) {
            d.hasHitGround = true;

            if (d.kind === `kitten`) {
                onLoseLife();
            }
        }

    });

    const newShots = shots
        // Remove shots offscreen
        .filter(x => x.pos.y > 0)
        // Remove exploded 
        .filter(x => !x.explodeTime || gameTime < 1 + x.explodeTime)
        ;

    return {
        ...projectilesState,
        lastShotTime: didShoot ? gameTime : lastShotTime,
        shots: newShots,
    };
};

type EnemiesState = {
    enemies: {
        key: string;
        pos: GamePosition;
        vel: Vector2;
        explodeTime?: number;
        answer: AnswerState;
        onHit: () => void;
        destroyed?: boolean;
    }[];
};
const updateEnemies = ({ gameTime, gameDeltaTime, projectilesState, enemiesState }: CommonGameState): EnemiesState => {
    const { enemies } = enemiesState;
    const { shots } = projectilesState;

    // Detect Collisions
    const radius = gameStyles.sprite.viewSize.width * 0.75;
    const radiusSq = radius * radius;

    enemies.forEach(e => shots.forEach(s => {
        // console.log(`Checking!`, { e, s });

        if (e.explodeTime) { return; }
        if (s.explodeTime) { return; }
        if (getDistanceSq(e.pos, s.pos) < radiusSq) {
            console.log(`Exploded!`, { e, s });

            e.explodeTime = gameTime;
            s.explodeTime = gameTime;

            e.onHit();

            if (e.answer.isCorrect) {
                projectilesState.debris.push({ key: e.key, kind: `alien`, pos: { ...e.pos }, vel: { ...e.vel } });
            } else {
                projectilesState.debris.push({ key: e.key, kind: `kitten`, pos: { ...e.pos }, vel: { ...e.vel } });
            }
        }
    }));

    enemies.forEach((e, i) => enemies.forEach((e2, i2) => {

        if (i >= i2) { return; }
        if (e.explodeTime) { return; }
        if (e2.explodeTime) { return; }

        if (getDistanceSq(e.pos, e2.pos) < radiusSq) {
            e.vel.x = -e.vel.x;
            e2.vel.x = -e2.vel.x;
        }
    }));

    // Enemies move
    enemies.forEach(e => {
        if (e.explodeTime) { return; }

        e.vel.x += (-1 + 2 * Math.random()) * 250 * gameDeltaTime;
        e.vel.y += 1 * gameDeltaTime;

        e.pos.x += e.vel.x * gameDeltaTime;
        e.pos.y += e.vel.y * gameDeltaTime;

        const pad = gameStyles.sprite.viewSize.width * 0.5;
        const w = gameStyles.viewscreenView.width;
        if (e.pos.x < pad) { e.pos.x = pad; e.vel.x = -e.vel.x; }
        if (e.pos.x > w - pad) { e.pos.x = w - pad; e.vel.x = -e.vel.x; }

        const hPad = gameStyles.sprite.viewSize.width * 1.5;
        const h = gameStyles.viewscreenView.height;
        if (e.pos.y > h - hPad) {
            e.pos.y = h - hPad;
        }
    });

    // Cleanup
    const newEnemies = enemies;
    newEnemies.filter(x => x.explodeTime && gameTime > 1 + x.explodeTime).forEach(x => {
        x.destroyed = true;

    });
    // // Remove exploded 
    // .filter(x => !x.explodeTime || gameTime < 1 + x.explodeTime)
    // ;

    return {
        enemies: newEnemies,
    };
};

type SpriteKind = 'player' | 'player-character' | 'player-character-splat' | 'shot' | 'shot-explode' | 'enemy' | 'enemy-explode' | 'answer' | 'answer-wrong' | 'alien' | 'kitten' | 'alien-splat' | 'kitten-splat' | 'super-kitten' | 'life';
const getSpriteEmoji = (kind: SpriteKind) => {
    // ❤💙💚😀🤣😃😁😂😄😉😆😅😊😋😎🥰😙☺🤩🙄😑😐😣🤐😫🤢😬😭🤯🤒😡🤓🤠👽💀👻☠🤖👾😺🙀🙈🙉🙊🐵🐱‍🐉🐶🦁🐯🐺🐱🦒🦊🦝🐗🐷🐮🐭🐹🐰🐼🐨🐻🐸🦓🐴🚀🛸⛵🛰🚁💺🚤🛥⛴⚓🪐🌌🌍🌏🌎
    // ✈🛩🚂🚘🚔🚍🚖🔥💧❄⚡🌀🌈☄🌠⭐❌💥♨🎇🎆✨🎡🍖🥓🍗🥩💚👁‍🗨🥫🍥🍤🧆🥝🥑🧪🧫💉🩸⚰💜🦵🐱‍🚀🐱‍🐉🐱‍🏍😾🐱‍👤😾😿😽😹😸😻🐲🐉
    switch (kind) {
        case `player`: return { text: `🚀`, rotation: -0.125, offsetX: -0.25, offsetY: 0 };
        case `player-character`: return { text: `😭` };
        case `player-character-splat`: return { text: `😫`, rotation: 0.15 };
        case `shot`: return { text: `🔥`, rotation: 0.5 };
        case `shot-explode`: return { text: `✨`, rotation: 0, scale: 0.5 };
        case `enemy`: return { text: `🛸`, offsetX: -0.125, offsetY: -0.125 };
        case `enemy-explode`: return { text: `💥`, offsetX: -0.125, offsetY: -0.125 };
        case `answer`: return { text: ``, offsetX: 0, offsetY: -0.125 };
        case `answer-wrong`: return { text: `❌`, offsetX: -0.125, offsetY: -0.125 };
        case `alien`: return { text: `👽`, offsetX: 0, offsetY: 0 };
        // case `kitten`: return { text: `🐱‍🚀`, offsetX: 0, offsetY: 0 };
        case `kitten`: return { text: `🙀`, offsetX: 0, offsetY: 0 };
        case `alien-splat`: return { text: `💀`, offsetX: 0, offsetY: 0 };
        case `kitten-splat`: return { text: `🥩`, offsetX: 0, offsetY: 0 };
        case `super-kitten`: return { text: `🐱‍🏍`, offsetX: 0, offsetY: 0 };
        // case `kitten-splat`: return { text: `👻`, offsetX: 0, offsetY: 0 };
        case `life`: return { text: `🚀`, scale: 0.5 };
        default: return { text: `😀` };
    }
};

const Sprite = ({ kind, position, text }: { kind: SpriteKind, position: { x: number, y: number, rotation: number }, text?: string }) => {
    const s = getSpriteEmoji(kind);
    const size = gameStyles.sprite.viewSize;
    const { fontSize } = gameStyles.sprite.text;

    const stylePosition = {
        position: `absolute`,
        ...size,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotation ?? 0}turn)`,
        // backgroundColor: `red`,
        pointerEvents: `none`,
    } as const;
    const styleRotation = {
        ...size,
        transform: `translate( ${size.width * -0.5 + Math.floor((s.offsetX ?? 0) * fontSize)}px, ${size.height * -0.5 + Math.floor((s.offsetY ?? 0) * fontSize)}px) rotate(${s.rotation ?? 0}turn) scale(${s.scale ?? 1})`,
    };
    return (
        <View style={stylePosition}>
            <View style={styleRotation}>
                <Text style={gameStyles.sprite.text}>{text ?? s.text}</Text>
            </View>
        </View>
    );
};
