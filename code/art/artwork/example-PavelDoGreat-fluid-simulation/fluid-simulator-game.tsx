/* eslint-disable new-cap */
/* eslint-disable no-new */
import { clamp } from 'utils/clamp';
import { ArtWork } from '../../artwork-type';
import { runFluidSimulator } from './src/run';
import { flappyDodgeGame } from '../games/flappy-dodge';
import { createEventProvider } from '../games/event-provider';

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
        if (!sim) { return { remove: () => { } }; }

        const timeProvider = recorder?.timeProvider ?? { now: () => Date.now(), isPaused: () => false };
        const eventProvider = createEventProvider(sim.canvas);

        const game = flappyDodgeGame.createGame(
            timeProvider,
            {
                getDisplaySize: () => ({ width: sim.canvas.width, height: sim.canvas.height }),
            });

        game.setup(eventProvider);

        const { config } = sim;

        if (config) {
            // config.SPLAT_RADIUS = 0.001;

            config.COLORFUL = false;
            config.CURL = 10;
            // config.BLOOM = false;
        }

        const VEL_MULT = 0.0005;
        const SIZE_MULT_OBSTACLE = 2;
        const SIZE_MULT_PLAYER = 2;
        const COLOR_STRENGTH = 0.06;
        // const CURL_BASE_VALUE = 30;

        const state = {
            resetBloomAtTimeMs: 0,
        };

        const updateGame = () => {
            config.BLOOM_INTENSITY = clamp(0.001 * (state.resetBloomAtTimeMs - timeProvider.now()), 0, 2);

            game.update({
                onPlayerHit: () => {
                    // console.log(`onPlayerHit`, {});

                    // config.BLOOM = true;
                    // sim.updateConfig();

                    state.resetBloomAtTimeMs = timeProvider.now() + 3000;
                },
            });
            game.render({
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
        };

        let isDestroyed = false;
        const update = async () => {
            if (isDestroyed) { return 0; }

            if (!timeProvider.isPaused()) {
                updateGame();
            }

            if (recorder?.isWaitingForFrame()) {
                console.log(`game.update waitingForFrame - addFrame`, {});
                await recorder.getRecorder().addFrame(sim.canvas);
            }

            return requestAnimationFrame(update);
        };
        // Start
        (async () => { await update(); })();

        return {
            remove: () => {
                isDestroyed = true;
                eventProvider.destroy();
                game.destroy();
                sim?.close();
            },
        };
    },
};
