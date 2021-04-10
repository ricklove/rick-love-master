/* eslint-disable new-cap */
/* eslint-disable no-new */
import { createRandomGenerator } from '../../rando';
import { ArtWork } from '../../artwork-type';
import { runFluidSimulator } from './src/run';
import { flappyDodgeGame } from '../games/flappy-dodge';

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
            disableGui: false, disableInput: true, disableStartupSplats: true,
            timeProvider: recorder?.timeProvider,
        });
        if (!sim) { return { remove: () => { } }; }

        const timeProvider = recorder?.timeProvider ?? { now: () => Date.now(), isPaused: () => false };

        const game = flappyDodgeGame.createGame(
            timeProvider,
            {
                getDisplaySize: () => ({ width: sim.canvas.width, height: sim.canvas.height }),
            });

        const { config } = sim;

        if (config) {
            // config.SPLAT_RADIUS = 0.001;

            config.COLORFUL = false;
            config.CURL = 10;
            config.BLOOM = false;
        }

        const VEL_MULT = 0.0005;
        const SIZE_MULT = 0.85;
        const SIZE_MULT_PLAYER = 1.5;
        const COLOR_STRENGTH = 0.06;

        const updateGame = () => {
            game.update();
            game.render({
                renderEntity: (data) => {
                    sim.splat(data.id,
                        true,
                        data.position.x, data.position.y,
                        VEL_MULT * data.velocity.x,
                        VEL_MULT * data.velocity.y,
                        {
                            x: data.size.x * (data.kind === `player` ? SIZE_MULT_PLAYER : SIZE_MULT),
                            y: data.size.y * (data.kind === `player` ? SIZE_MULT_PLAYER : SIZE_MULT),
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

        const update = async () => {

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
                game.destroy();
                sim?.close();
            },
        };
    },
};
