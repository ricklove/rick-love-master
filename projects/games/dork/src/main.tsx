import React from 'react';
import { artMan, artMap } from './art';
import { AsciiArtViewer } from './components/ascii-art-viewer';
import { createGameState } from './core';
import { createScene_01mailbox } from './scenes/01-mailbox';
import { Game, GameAction, GameExecute, GameInput, GameScene } from './types';
import { delay, randomItem } from './utils';


export const dorkVersion = `v1.4.2`;
export const title = `*** DORK! *** ${dorkVersion} - Copyright ${new Date().getFullYear()} Rick Love`;

export const createDorkGame = (onMessageInit: (message: GameAction) => void): Game => {
    const gameState = createGameState(onMessageInit);
    const {
        isGameOver,
        inventory,
        isMatch,
    } = gameState;


    const badCommandInsults = [
        `What are you talking about?`,
        `That doesn't make any sense.`,
        // Saved for Redneck Game
        // `Ain't never heard no nonsense like that before.`,
        `I've seen butter knives sharper than you!`,
        `You are playing the correct game!`,
        `What exactly do you think that would accomplish?`,
        `This is a family game!`,
    ];


    const scenes = [
        createScene_01mailbox(gameState),
    ];
    let scene = null as null | GameScene;

    const loadScene = async (value: GameScene): Promise<GameAction> => {
        scene = value;
        return { output: scene.introduction };
    };
    // const containers = ;

    const execute: GameExecute = async (inputRaw: GameInput): Promise<GameAction> => {
        const { command: commandRaw, target, onMessage: onMessageRaw } = inputRaw;

        // Prevent Messages if game over already
        const onMessage: typeof onMessageRaw = (x) => {
            // Ensure Game Over Interrupts Execute
            if (isGameOver()) { return; }
            onMessageRaw(x);
        };
        // const haveTarget = (match: string) => target.includes(match) && inventory.find(x => x.lower.includes(target));

        // Standardize Commands
        let command = commandRaw;
        command = command === `look` || command === `see` || command === `view` || command === `observer` ? `look` : command;
        command = command === `take` || command === `get` || command === `obtain` ? `take` : command;

        const input = { ...inputRaw, command, onMessage };

        // Ensure Game Over Interrupts Execute
        if (gameState.isGameOver()) {
            return { output: ``, isGameOver: true };
        }

        if (!scene) {
            throw new Error(`Scene not loaded - Start Game First`);
        }

        gameState.achievements.addAchievement(`⌨ I Can Type!`);

        if (command === `look`) {
            gameState.achievements.addAchievement(`👀 Looking Good!`);

            // Look Inventory
            const f = inventory.find(x => isMatch(x, target));
            if (f) {
                return {
                    output: typeof f.description === `function` ? f.description() : f.description,
                };
            }

            // Look Scene
            const sceneItems = scene.getLookItems();
            const s = sceneItems.find(x => x && isMatch(x, target));
            if (s) {
                return {
                    output: typeof s.description === `function` ? s.description() : s.description,
                };
            }
            // const result = await scene.look(input);
            // if (result) { return result; }

            // return {
            //     output: randomItem([`What do you want to look at?`, `Yes, you look nice!`]),
            // };

            return {
                output: `You see ${sceneItems.filter(x => x).map(x => x?.titleWithA).join(`, `)}, and ${randomItem([
                    `a dork... oh that's you.`,
                    `... your reflection off of the screen.`,
                    `a heard of zombies... Wait nevermind.`,
                    `... so many ducks.`,
                    `... a tech support scammer.`,
                ])}`,
            };
        }


        // Execute Inventory
        for (const x of inventory) {
            if (!x.execute) { continue; }
            if (!isMatch(x, target)) { continue; }

            // eslint-disable-next-line no-await-in-loop
            const result = await x.execute(input);
            if (result) { return result; }
        }

        // Execute Scene
        const result = await scene.execute(input);
        if (result) { return result; }

        // List Inventory
        if (command === `inv` || command === `inventory` || command === `bag` || command === `backpack` || command === `pack`) {
            gameState.achievements.addAchievement(`🎒 Checkin on My Stuff`);

            return { output: inventory.map(x => x.title).join(`\n`) };
        }

        // Help
        if (command === `help`) {
            gameState.achievements.addAchievement(`🦮 Hold My Hand Please`);

            return {
                output: `
                    Example Commands: 
                    help
                    inventory
                    look at mirror
                    take frog
                    open box
                    close trunk
                    put cat in submarine
                    go to house
                    throw snake at lady
                    send gif to grandma
                    post status on dorkbook
                    wear mask
                    ` };
        }

        // Map
        if (command === `map`) {
            gameState.achievements.addAchievement(`🗺️ I'm a map!`);

            return { output: artMap };
        }

        if (command === `die`) {
            gameState.achievements.addAchievement(`💀 You Asked for It!`);

            return gameState.triggerGameOver(onMessage, `You asked for it!`);
        }

        // Silly Commands
        if (command === `dork`) {
            gameState.achievements.addAchievement(`🤓 Actually... I'm a Nerd`);
            return { output: randomItem([`Yes, you must be!`, `I prefer the term nerd.`]) };
        }
        if (command === `jump`) {
            gameState.achievements.addAchievement(`🦘 Jump! Jump!`);
            return { output: randomItem([`How high?`, `Good job!`, `Maybe if you type harder!`]) };
        }

        return { output: randomItem(badCommandInsults) };

        // return {
        //     output: `${randomBinary(512)}
        //     ****  You have died  ****
        // ` };
    };

    const start = async (onMessage: (message: GameAction) => void): Promise<void> => {
        // Load First Scene
        onMessage({ output: `Reading Floppy Disk...` });
        await delay(1000);
        onMessage({ output: title });
        onMessage({ output: ``, Component: () => (<AsciiArtViewer artwork={artMan} />) });
        await delay(3000);
        onMessage({
            output: ``,
            addDivider: true,
        });
        onMessage({
            output: `Type simple commands
                Examples:` });
        await delay(1000);
        onMessage({
            output: `
                - inventory
                - look at mirror
                - take frog
                - open box
                - close trunk
                - put cat in submarine
                - help
                - look at achievements 
                `,
        });
        await delay(3000);
        onMessage({
            output: ``,
            addDivider: true,
        });
        onMessage(await loadScene(scenes[0]));
    };

    const game: Game = {
        title,
        start,
        execute,
        onQuit: () => gameState.triggerQuit(),
        onQuitNot: () => {
            gameState.achievements.addAchievement(`🧻 Never gonna give you up!`);
            return { output: `That was close` };
        },
        achievements: {
            setValue: (achievements: string[]) => { gameState.achievements.loadAchievements(achievements); },
            getValue: () => { return gameState.achievements.getAchievements(); },
        },
    };

    return game;
};
