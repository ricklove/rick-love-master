/* eslint-disable new-cap */
/* eslint-disable no-new */
import { createRandomGenerator } from '../../rando';
import { ArtWork } from '../../artwork-type';
import { runFluidSimulator } from './src/run';

const contentPath = `/content/art/artwork/example-PavelDoGreat-fluid-simulation/src`;

export const art_fluidSimulatorGame: ArtWork = {
    key: `art-fluid-simulator-game`,
    title: `Fluid Simulator Game`,
    description: `Art Game 

Based on Fluid Simulator by Pavel Dobryakov: https://paveldogreat.github.io/WebGL-Fluid-Simulation/`,
    artist: `Rick Love`,
    getTokenDescription: (tokenId: string) => {
        return null;
    },
    // openSea: {
    //     tokenAddress: `0x495f947276749ce646f68ac8c248420045cb7b5e`,
    //     tokenId: `91242641486941084018191434774360347389366801368112854311223385694785434025985`,
    // },
    renderArt: (hostElement, hash, recorder) => {
        const sim = runFluidSimulator(hostElement, contentPath, { width: `100%`, height: `100%` }, {
            disableGui: false, disableInput: true, disableStartupSplats: true,
            timeProvider: recorder?.timeProvider,
        });
        if (!sim) { return { remove: () => { } }; }

        const timeProvider = recorder?.timeProvider ?? { now: () => Date.now(), isPaused: () => false };


        const { config } = sim;

        const MOTION_X = -0.1;
        const MOTION_Y = -0.025;
        const VEL_MULT = 0.05;
        const COLOR_STRENGTH = 0.06;

        if (config) {
            // config.SPLAT_RADIUS = 0.001;
            config.MOTION_X = MOTION_X;
            config.MOTION_Y = MOTION_Y;
            config.COLORFUL = false;
            config.CURL = 10;
        }

        type Vector2 = { x: number, y: number };
        type ColorRgb = { r: number, g: number, b: number };
        type Entity = {
            id: number;
            color: ColorRgb;
            position: Vector2;
            velocity: Vector2;
            size: Vector2;
            isStill: boolean;
        };
        const state = {
            environment: {
                time: 0,
                timeLast: timeProvider.now(),
                timeMsStart: timeProvider.now(),
                timeDelta: 0,
                tick: 0,
                size: { x: 600, y: 600 },
            },
            input: {
                u: false,
                d: false,
                l: false,
                r: false,
            },
            player: {
                id: 42,
                position: { x: 0.5, y: 0.5 },
                velocity: { x: 0, y: 0 },
                size: { x: 0.05, y: 0.05 },
                color: { r: COLOR_STRENGTH, g: COLOR_STRENGTH, b: COLOR_STRENGTH },
                color1: { r: COLOR_STRENGTH, g: COLOR_STRENGTH, b: COLOR_STRENGTH },
                color2: { r: COLOR_STRENGTH, g: COLOR_STRENGTH, b: COLOR_STRENGTH },
                color2Stength: 0.5,
            },
            obstacles: [] as Entity[],
            obstaclesState: {
                timeNextObstacle: 1,
            },
        };

        const updatePlayer = () => {
            const { player, environment: { timeDelta, size } } = state;

            // Player color
            player.color2Stength += timeDelta * 1;
            if (player.color2Stength > 1) {
                player.color1 = player.color2;
                player.color2 = {
                    r: 1 * COLOR_STRENGTH * 0.5 * Math.random(),
                    g: 1 * COLOR_STRENGTH * 0.5 * Math.random(),
                    b: 1 * COLOR_STRENGTH * 0.5 * Math.random(),
                };
                player.color2Stength = 0;
            }


            const ratio = player.color2Stength;
            player.color = {
                r: (1 - ratio) * player.color1.r + ratio * player.color2.r,
                g: (1 - ratio) * player.color1.g + ratio * player.color2.g,
                b: (1 - ratio) * player.color1.b + ratio * player.color2.b,
            };

            // Player motion
            const speedX = 0.9;
            const speedY = speedX * size.x / size.y;
            player.velocity = {
                x: player.velocity.x + timeDelta * (state.input.l ? -speedX : state.input.r ? speedX : 0),
                y: player.velocity.y + timeDelta * (state.input.d ? -speedY : state.input.u ? speedY : 0),
            };

            player.position.x += timeDelta * player.velocity.x;
            player.position.y += timeDelta * player.velocity.y;

            // Dampening
            player.velocity.x *= 1 - (0.5 * timeDelta);
            player.velocity.y *= 1 - (0.5 * timeDelta);

            // Gravity
            player.velocity.y -= timeDelta * 0.4;

            // Boundaries
            if (player.position.x < 0) { player.position.x = 0; player.velocity.x = 0; }
            if (player.position.x > 1) { player.position.x = 1; player.velocity.x = 0; }
            if (player.position.y < 0) { player.position.y = 0; player.velocity.y = 0; }
            if (player.position.y > 1) { player.position.y = 1; player.velocity.y = 0; }
        };

        const updateObstacles = () => {
            const { obstacles, obstaclesState, environment: { time, timeDelta } } = state;


            if (time > obstaclesState.timeNextObstacle) {
                obstaclesState.timeNextObstacle = time + 1.5;

                let freeObstacle = obstacles.find(x => x.position.x < -0.25);
                if (!freeObstacle) {
                    freeObstacle = {
                        id: obstacles.length + 1000,
                        position: { x: 1.25, y: 0.1 },
                        velocity: { x: -0.125, y: 0 },
                        color: { r: 0.01, g: 0, b: 0 },
                        size: { x: 0.5, y: 0.5 },
                        isStill: false,
                    };
                    // Add an obstacle
                    obstacles.push(freeObstacle);
                }

                freeObstacle.color = { r: COLOR_STRENGTH * Math.random(), g: COLOR_STRENGTH * Math.random(), b: COLOR_STRENGTH * Math.random() };

                const motionSignX = Math.sign(config.MOTION_X);

                freeObstacle.position = { x: motionSignX * -1.05, y: Math.random() };
                freeObstacle.velocity = { x: motionSignX * (0.05 + 0.25 * Math.random()), y: (0.2 + 0.1 - 0.2 * Math.random()) };
                freeObstacle.isStill = Math.random() < 0.1;

                freeObstacle.size = { x: 0.25 + 0.5 * Math.random(), y: 0.25 + 0.5 * Math.random() };
            }

            for (const entity of obstacles) {
                if (entity.isStill) {
                    entity.velocity = { x: config.MOTION_X, y: config.MOTION_Y };
                }

                entity.position.x += entity.velocity.x * timeDelta;
                entity.position.y += entity.velocity.y * timeDelta;

                // Gravity
                entity.velocity.y -= timeDelta * 0.1;
            }

        };

        let closed = false;
        const minTickTimeMs = 16;
        const update = async () => {
            if (closed) { return; }

            if (!timeProvider.isPaused()) {
                console.log(`fluidSimulatorGame.renderArt timeProvider.PAUSED`, {});
                requestAnimationFrame(update);
                return;
            }

            const size = sim.getSize();
            state.environment.size = { x: size.width, y: size.height };
            state.environment.timeLast = state.environment.time;
            state.environment.time = 0.001 * (timeProvider.now() - state.environment.timeMsStart);
            state.environment.timeDelta = Math.max(minTickTimeMs * 0.001 * 0.5, state.environment.time - state.environment.timeLast);
            // console.log(`gameInverval`, { environment: state.environment });

            const { player, obstacles } = state;

            updatePlayer();
            updateObstacles();

            // Render Player
            sim.splat(player.id, true, player.position.x, player.position.y, VEL_MULT * state.environment.timeDelta * player.velocity.x, VEL_MULT * state.environment.timeDelta * player.velocity.y, player.size, player.color);

            // Render Entities
            for (const entity of obstacles) {

                const isHidden = entity.position.x < -0.25
                    || entity.position.x > 1.25
                    || entity.position.y < -0.25
                    || entity.position.y > 1.25;

                if (entity.isStill) {
                    sim.splat(entity.id, !isHidden, entity.position.x, entity.position.y, 0, 0, entity.size, entity.color);
                    return;
                }
                sim.splat(entity.id, !isHidden, entity.position.x, entity.position.y, VEL_MULT * state.environment.timeDelta * entity.velocity.x, VEL_MULT * state.environment.timeDelta * entity.velocity.y, entity.size, entity.color);
            }

            state.environment.tick++;

            if (recorder?.isRecording()) {
                await recorder.getRecorder().addFrame(sim.canvas);
            }

            requestAnimationFrame(update);
        };
        // Start
        (async () => await update())();


        const windowSubs = [] as { name: string, handler: () => void }[];
        const windowAddEventListener = ((name: string, handler: () => void) => {
            window.addEventListener(name, handler);
            windowSubs.push({ name, handler });
        }) as typeof window.addEventListener;
        const windowEventListenersDestroy = () => {
            windowSubs.forEach(({ name, handler }) => {
                window.removeEventListener(name, handler);
            });
        };
        windowAddEventListener(`keydown`, e => {
            if (e.key === `ArrowDown`) { state.input.d = true; }
            if (e.key === `ArrowUp`) { state.input.u = true; }
            if (e.key === `ArrowLeft`) { state.input.l = true; }
            if (e.key === `ArrowRight`) { state.input.r = true; }
        });
        windowAddEventListener(`keyup`, e => {
            if (e.key === `ArrowDown`) { state.input.d = false; }
            if (e.key === `ArrowUp`) { state.input.u = false; }
            if (e.key === `ArrowLeft`) { state.input.l = false; }
            if (e.key === `ArrowRight`) { state.input.r = false; }
        });


        return {
            recorder,
            remove: () => {
                windowEventListenersDestroy();
                closed = true;
                sim?.close();
            },
        };
    },
};
