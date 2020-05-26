/* eslint-disable no-param-reassign */
/* eslint-disable unicorn/consistent-function-scoping */
import { ConSessionName, ConSession, ConState, ConFile, ConAction, ConInput, ConCommandResult } from './types';
import { randomBinary } from './utils';
import { dorkFile } from './game-dork';
import { zork } from './game-zork';

export const createConsoleCommands = (initialMachineName: string) => {

    const sessions: { [session in ConSessionName]: ConSession } = {
        user: { machineName: `${initialMachineName}` },
        admin: { machineName: `admin@vm` },
    };

    let state: ConState = {
        parent: undefined,
        session: `user`,
        directory: `/`,
        activeAction: undefined,
    };

    const enterSession = (session: ConSessionName, shouldResolveAction = true) => {
        state = {
            parent: { ...state, activeAction: shouldResolveAction ? null : state.activeAction },
            session,
            directory: `/`,
            activeAction: null,
        };
    };
    const exitSession = () => {
        if (!state.parent) { return null; }
        state = state.parent;
        return state;
    };


    const files: ConFile[] = [
        {
            session: `user`, path: `/`, name: `Readme.md`,
            content: `
                Yes, this is cool!
                Look, I created my own blog!
                ## Hidden Stuff
                I'm going to store some things here so I don't forget.`,
        }, {
            session: `user`, path: `/`, name: `passwords.txt`,
            content: `
                test1
                password
                12345678
                asdf
                qwerty
                1234567890
                admin
                friend
                test1234
                1234567
                Aa123456.
                p@55w0rd`,
        }, {
            session: `user`, path: `/`, name: `admin.sh`,
            content: `ssh admin@192.168.0.1`,
            execute: async () => ({
                output: `Please Enter Password`,
                query: {
                    prompt: `doors@durin>`,
                    respond: async ({ command }) => {
                        if (command === `friend`) {
                            enterSession(`admin`);
                            return {
                                output: `Logging into ${sessions.admin.machineName}`,
                            };
                        }
                        return {
                            output: `Incorrect Password`,
                        };
                    },
                },
            }),
        }, {
            session: `admin`, path: `/`, name: `bitcoin_wallet_backup.dat`,
            content: `E9873D79C6D87DC0FB6A57786389F4453213303DA61F20BD67FC233AA33262`,
        }, {
            session: `admin`, path: `/`, name: `keepass.kdb`,
            content: `${randomBinary(1024)}`,
        },// 

        zork,
        dorkFile,
    ];

    const standardPrompt = (): ConCommandResult => {
        return { prompt: `${sessions[state.session].machineName}${state.directory.replace(/\/$/g, ``)}>` };
    };

    const processAction = async (action: ConAction): Promise<ConCommandResult> => {
        if (!action) {
            state = { ...state, activeAction: null };
            return standardPrompt();
        }
        if (action.query) {
            state = { ...state, activeAction: action };
            return { ...action, prompt: action.query.prompt };
        }

        state = { ...state, activeAction: null };
        return {
            ...standardPrompt(),
            ...action,
        };
    };

    const onCommand = async (commandRaw: string, onMessage: (message: ConCommandResult) => void): Promise<ConCommandResult> => {
        const commandLower = commandRaw.toLowerCase().trim();
        const iSpace = commandLower.indexOf(` `);
        const command = iSpace >= 0 ? commandLower.slice(0, iSpace).trim() : commandLower.trim();
        const target = iSpace >= 0 ? commandLower.slice(iSpace).trim() : ``;
        const input: ConInput = { raw: commandRaw, lower: commandLower, command, target, onMessage };

        // Process any active actions
        if (state.activeAction) {
            const a = state.activeAction;
            if (a.query) {
                const action = await a.query.respond(input);
                return processAction(action);
            }
        }

        // Process OS level commands
        if (command === `exit`) {
            if (exitSession()) {
                return standardPrompt();
            }
            return { quit: true };
        }

        const dirFiles = files.filter(x => x.session === state.session && x.path === state.directory);

        if (command === `dir` || command === `ls`) {
            return {
                ...standardPrompt(),
                output: dirFiles.map(x => x.name).join(`\n`),
            };
        }

        if (command.startsWith(`open`)
            || command.startsWith(`read`)
            || command.startsWith(`cat`)
            || command.startsWith(`echo`)
        ) {
            const file = target && dirFiles.find(x => x.name.toLowerCase().startsWith(target));
            if (file) {
                return {
                    ...standardPrompt(),
                    output: file.content,
                };
            }

            return {
                ...standardPrompt(),
                output: `${command}: ${target}: No such file or directory`,
            };
        }

        const file = dirFiles.find(x => x.name.toLowerCase() === command);
        if (file && file.execute) {
            const action = await file.execute(onMessage);
            return processAction(action);
        }

        return {
            ...standardPrompt(),
            output: `${command}: command not found`,
        };
    };

    return {
        onCommand,
    };

};
