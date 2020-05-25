/* eslint-disable no-param-reassign */
import { ConFile, ConActionQuery } from './console-simulator-types';
import { randomBinary } from './console-simulator-utils';

export const zork: ConFile = {
    session: `user`, path: `/`, name: `zork`,
    content: `${randomBinary(256)}West of House
You are standing in an open field west of a white house, with a boarded front door.
There is a small mailbox here.${randomBinary(512)}`,
    execute: async () => {

        const mainZork: ConActionQuery = {
            prompt: `>`,
            respond: async ({ command, target }) => {
                if (command === `zork`) { return { output: `At your service`, query: mainZork }; }
                if (command === `jump`) { return { output: Math.random() < 0.5 ? `Are you enjoying yourself?` : `Very good! Now you can go to the second grade.`, query: mainZork }; }
                if (command === `scream`) { return { output: `Aaaarrrrgggghhhh!`, query: mainZork }; }

                if (command === `look`) {
                    if (target === `house`) {
                        return {
                            output: `You are standing in an open field west of a white house, with a boarded front door.`,
                            query: mainZork,
                        };
                    }
                }

                if (command === `open`) {
                    if (target === `mailbox`) {
                        return {
                            output: `Opening the small mailbox reveals a leaflet`,
                            query: mainZork,
                        };
                    }
                }

                return {
                    output: `${randomBinary(512)}
                    ****  You have died  ****
                    ...bzzz...
                    The magnetic tape drive is smoking...
                ` };
            },
        };

        return {
            output: `West of House
        You are standing in an open field west of a white house, with a boarded front door.
        There is a small mailbox here.`,
            query: mainZork,
        };
    },
};
