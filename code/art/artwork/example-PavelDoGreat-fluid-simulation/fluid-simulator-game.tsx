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
            config.SPLAT_RADIUS = 0.001;
        }

        const state = {
            tick: 0,
            input: {
                u: false,
                d: false,
                l: false,
                r: false,
            },
            playerEntity: {
                id: 42,
                position: { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },
            },
            entities: [],
        };

        const intervalId = setInterval(() => {
            // result?.splat(state.position.x, state.position.y, 0, 0, { r: 0.001, g: 0.001, b: 0.001 });
            const player = state.playerEntity;
            result.splat(player.id, true, player.position.x, player.position.y, 0, 0);

            const size = result.getSize();
            const speedX = 0.00005;
            const speedY = speedX * size.width / size.height;
            player.velocity = {
                x: player.velocity.x + (state.input.l ? -speedX : state.input.r ? speedX : 0),
                y: player.velocity.y + (state.input.d ? -speedY : state.input.u ? speedY : 0),
            };
            player.position.x += player.velocity.x;
            player.position.y += player.velocity.y;

            // Dampening
            player.velocity.x *= 0.99;
            player.velocity.y *= 0.99;

            // Gravity
            player.velocity.y -= 0.00004;

            // Boundaries
            if (player.position.x < 0) { player.position.x = 0; }
            if (player.position.x > 1) { player.position.x = 1; }
            if (player.position.y < 0) { player.position.y = 0; }
            if (player.position.y > 1) { player.position.y = 1; }

            state.tick++;
        }, 10);

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
