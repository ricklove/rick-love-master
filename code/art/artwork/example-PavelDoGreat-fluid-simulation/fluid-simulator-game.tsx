/* eslint-disable new-cap */
/* eslint-disable no-new */
import { clamp } from 'utils/clamp';
import { ArtWork } from '../../artwork-type';
import { runFluidSimulator } from './src/run';
import { flappyDodgeGame } from '../games/flappy-dodge/flappy-dodge';
import { createEventProvider } from '../games/event-provider';
import { createDebugGameView } from '../games/art-game';
import { snakeGame } from '../games/snake/snake';
import { createBeatPlayer } from '../music/beat';

const contentPath = `/content/art/artwork/example-PavelDoGreat-fluid-simulation/src`;

export const art_fluidSimulatorGame: ArtWork = {
    key: `art-fluid-simulator-game`,
    title: `Fluid Simulator Game`,
    description: `Flappy Dodge with Fluid Simulator Renderer 

Renderer based on Fluid Simulator by Pavel Dobryakov: https://paveldogreat.github.io/WebGL-Fluid-Simulation/`,
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
            disableGui: true, disableInput: true, disableStartupSplats: true,
            timeProvider: recorder?.timeProvider,
        });
        if (!sim) { return { remove: () => { /* Ignore */ } }; }

        const timeProvider = recorder?.timeProvider ?? { now: () => Date.now(), isPaused: () => false };
        const eventProvider = createEventProvider(sim.canvas);

        // const game = flappyDodgeGame.createGame(
        const gameSource = snakeGame;
        const game = gameSource.createGame(
            timeProvider,
            { getDisplaySize: () => ({ width: sim.canvas.width, height: sim.canvas.height }) });

        game.setup(eventProvider);

        const beatPlayer = createBeatPlayer();
        eventProvider.canvasAddEventListener(`touchdown`, () => {
            beatPlayer.start();
        });
        eventProvider.canvasAddEventListener(`mousedown`, () => {
            beatPlayer.start();
        });
        eventProvider.canvasAddEventListener(`keydown`, () => {
            beatPlayer.start();
        });

        // Debug
        const debugViewer = createDebugGameView(gameSource, sim.canvas, eventProvider);

        const { config } = sim;

        if (config) {
            // config.SPLAT_RADIUS = 0.001;

            config.COLORFUL = false;
            config.CURL = 10;
            // config.BLOOM = false;
        }

        const VEL_MULT = 0.0005;
        const SIZE_MULT_OBSTACLE = 4;
        const SIZE_MULT_PLAYER = 4;
        const COLOR_STRENGTH = 0.06;
        // const CURL_BASE_VALUE = 30;

        const state = {
            resetBloomAtTimeMs: 0,
            darkenAtTimeMs: 0,
            darkenUntilTimeMs: 0,
        };

        let frameTick = 0;
        const updateGame = () => {
            config.BLOOM_INTENSITY = clamp(0.001 * (state.resetBloomAtTimeMs - timeProvider.now()), 0, 2);
            config.SUNRAYS_WEIGHT = timeProvider.now() > state.darkenAtTimeMs && timeProvider.now() < state.darkenUntilTimeMs ? 0 : 1;

            game.update();
            debugViewer?.render(game, { updateFrameTick: frameTick, renderFrameTick: sim.getFrameTick() });

            game.render({
                onPlayerHit: () => {
                    // console.log(`onPlayerHit`, {});

                    // config.BLOOM = true;
                    // sim.updateConfig();

                    state.resetBloomAtTimeMs = timeProvider.now() + 3000;
                },
                onPlayerReward: (data) => {
                    // console.log(`onPlayerHit`, {});

                    // config.BLOOM = true;
                    // sim.updateConfig();

                    state.resetBloomAtTimeMs = timeProvider.now() + 500;
                },
                onBeat: (data) => {
                    beatPlayer.beat(data);
                    if (data.beatIndex % 4 === 3){
                        state.darkenAtTimeMs = timeProvider.now() + 0;
                        state.darkenUntilTimeMs = timeProvider.now() + 50;
                    }
                },
                renderEntity: (data) => {

                    // if (data.kind === `player`) {
                    //     console.log(`player`, { data, config });

                    //     // // Adjust vorticity based on player speed
                    //     // const curl = CURL_BASE_VALUE * clamp((1 + 0.1 * data.velocity.x), 0.5, 2);
                    //     // config.CURL = curl;

                    //     // if (Math.abs(data.velocity.x) > 0.25) {
                    //     //     config.BLOOM = true;
                    //     //     state.resetBloomAtTime = timeProvider.now() + 5;
                    //     // }
                    // }

                    sim.splat(data.id,
                        true,
                        data.position.x, data.position.y,
                        VEL_MULT * data.velocity.x,
                        VEL_MULT * data.velocity.y,
                        {
                            x: data.size.x * (data.kind === `player` ? SIZE_MULT_PLAYER : SIZE_MULT_OBSTACLE),
                            y: data.size.y * (data.kind === `player` ? SIZE_MULT_PLAYER : SIZE_MULT_OBSTACLE),
                        },
                        {
                            r: data.color.r * COLOR_STRENGTH,
                            g: data.color.g * COLOR_STRENGTH,
                            b: data.color.b * COLOR_STRENGTH,
                        });
                },
                removeEntity: (id) => {
                    sim.splat(id, false, 0, 0, 0, 0);
                },
                setBackgroundVelocity: (data) => {
                    config.MOTION_X = data.velocity.x;
                    config.MOTION_Y = data.velocity.y;
                },
            });

            frameTick++;
        };

        let isDestroyed = false;
        const update = async () => {
            if (isDestroyed) { return; }

            if (!timeProvider.isPaused()) {
                updateGame();
            }

            if (recorder?.isWaitingForFrame()) {
                console.log(`game.update waitingForFrame - addFrame`, {});
                await recorder.getRecorder().addFrame(sim.canvas);
            }

            return requestAnimationFrame(() => {void update();});
        };


        // Start
        setTimeout(() => {
            (async () => { await update(); })();
            sim.start();
        }, 250);

        return {
            remove: () => {
                isDestroyed = true;
                eventProvider.destroy();
                game.destroy();
                debugViewer?.destroy();
                sim?.close();
            },
        };
    },
};
