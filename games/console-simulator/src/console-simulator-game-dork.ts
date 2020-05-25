/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-param-reassign */
import { createDorkGame, title } from 'dork/src/main';
import { GameInput, GameAction } from 'dork/src/types';
import { ConFile, ConActionQuery } from './console-simulator-types';
import { randomBinary } from './console-simulator-utils';

// localStorage
type DorkGameStorage = {
    achievements: string[];
};
const loadGameStorage = () => {
    const v = localStorage.getItem(`DorkGameStorage`);
    if (!v) { return null; }
    try { return JSON.parse(v) as DorkGameStorage | null; } catch{ return null; }
};
const saveGameStorage = (value: DorkGameStorage) => { localStorage.setItem(`DorkGameStorage`, JSON.stringify(value)); };

export const dorkFile: ConFile = {
    session: `user`, path: `/`, name: `dork`,
    content: `${randomBinary(256)}${title}${randomBinary(512)}`,
    execute: async (onMessage) => {

        const onMessageGame = (message: GameAction) => {
            onMessage({
                output: message?.output,
                Component: message?.Component,
                addDivider: message?.addDivider,
            });
        };

        const dorkGame = createDorkGame(onMessageGame);

        const conQuery: ConActionQuery = {
            prompt: `>`,
            respond: async (input) => {
                // Quit Game
                if (input.command === `quit`) {
                    return {
                        query: {
                            prompt: `Are you sure you want to quit?`,
                            respond: async (x) => {
                                if (x.command.startsWith(`y`)) {
                                    const result = dorkGame.onQuit();
                                    saveGameStorage({ achievements: dorkGame.achievements.getValue() });
                                    return result;
                                }
                                return {
                                    ...dorkGame.onQuitNot(),
                                    query: conQuery,
                                };
                            },
                        },
                    };
                }

                const gameInput: GameInput = {
                    ...input,
                    onMessage: onMessageGame,
                };
                const result = await dorkGame.execute(gameInput);
                saveGameStorage({ achievements: dorkGame.achievements.getValue() });
                return {
                    ...result,
                    query: result?.isGameOver ? undefined : conQuery,
                };
            },
        };

        const s = loadGameStorage();
        if (s) {
            dorkGame.achievements.setValue(s.achievements);
        }

        await dorkGame.start(onMessageGame);

        return {
            output: ``,
            query: conQuery,
        };
    },
};
