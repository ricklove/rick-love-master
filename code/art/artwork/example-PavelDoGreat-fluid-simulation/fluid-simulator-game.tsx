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
    renderArt: (hostElement: HTMLDivElement, hash) => {
        const result = runFluidSimulator(hostElement, contentPath, { width: `100%`, height: `100%` }, { disableGui: false, disableInput: true });
        if (!result) { return { remove: () => { } }; }

        const { config } = result;
        if (config) {
            // config.SPLAT_RADIUS = 0.001;
            config.MOTION_X = -0.1;
        }

        type Vector2 = { x: number, y: number };
        type ColorRgb = { r: number, g: number, b: number };
        type Entity = {
            id: number;
            color: ColorRgb;
            position: Vector2;
            velocity: Vector2;
            size: Vector2;
        };
        const state = {
            environment: {
                time: 0,
                timeLast: Date.now(),
                timeMsStart: Date.now(),
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
                position: { x: 0.25, y: 0.5 },
                velocity: { x: 0, y: 0 },
                size: { x: 0.01, y: 0.01 },
            },
            obstacles: [] as Entity[],
            obstaclesState: {
                timeNextObstacle: 1,
            },
        };

        const updatePlayer = () => {
            const { player, environment: { timeDelta, size } } = state;

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

                let freeObstacle = obstacles.find(x => x.position.x < 0.25);
                if (!freeObstacle) {
                    freeObstacle = {
                        id: obstacles.length + 1000,
                        position: { x: 1.25, y: 0.1 },
                        velocity: { x: -0.125, y: 0 },
                        color: { r: 0.01, g: 0, b: 0 },
                        size: { x: 0.5, y: 0.5 },
                    };
                    // Add an obstacle
                    obstacles.push(freeObstacle);
                }

                const colorStength = 0.06;
                freeObstacle.color = { r: colorStength * Math.random(), g: colorStength * Math.random(), b: colorStength * Math.random() };
                freeObstacle.position = { x: 1.25, y: Math.random() };
                freeObstacle.velocity = { x: -0.05 - 0.25 * Math.random(), y: 0.2 + 0.1 - 0.2 * Math.random() };
            }

            for (const entity of obstacles) {
                entity.position.x += entity.velocity.x * timeDelta;
                entity.position.y += entity.velocity.y * timeDelta;

                // Gravity
                entity.velocity.y -= timeDelta * 0.1;
            }

        };

        const tickTimeMs = 16;
        const intervalId = setInterval(() => {
            const size = result.getSize();
            state.environment.size = { x: size.width, y: size.height };
            state.environment.timeLast = state.environment.time;
            state.environment.time = 0.001 * (Date.now() - state.environment.timeMsStart);
            state.environment.timeDelta = Math.max(tickTimeMs * 0.001 * 0.5, (state.environment.time - state.environment.timeLast));
            // console.log(`gameInverval`, { environment: state.environment });

            const { player, obstacles } = state;

            updatePlayer();
            updateObstacles();

            // Render Player
            result.splat(player.id, true, player.position.x, player.position.y, 0, 0, player.size);

            // Render Entities
            for (const entity of obstacles) {

                const isHidden = entity.position.x < -0.25
                    || entity.position.x > 1.25
                    || entity.position.y < -0.25
                    || entity.position.y > 1.25;

                result.splat(entity.id, !isHidden, entity.position.x, entity.position.y, 0, 0, entity.size, entity.color);
            }

            state.environment.tick++;

        }, tickTimeMs);

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
            remove: () => {
                windowEventListenersDestroy();
                clearInterval(intervalId);
                result?.close();
            },
        };
    },
};
