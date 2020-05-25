/* eslint-disable no-return-await */
/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { GameScene, GameItem, GameAction, GameInput } from '../types';
import { GameState } from '../core';

export const createScene_01mailbox = (gameState: GameState) => {
    const {
        triggerGameOver,
        inventory,
        removeFromInventory,
        createGameObject,
        createGameObjectTitle,
        isMatch,
        utils,
        components,
    } = gameState;

    const { randomItem, randomIndex, getValuesAsItems, moveItem } = utils;
    const { triggerTimedMessage, CountDownTimer } = components;

    // These don't indicate state, just creation containers
    const mailObjects = {
        litterBox: createGameObject(`Self Cleaning Litter Box`, `Cause 18 years is great even if you have to deal with a little crap sometimes. Keep it clean and happy!`, {}),
        towelHooks: createGameObject(`Set of Bathroom Towel Hooks`, `For the new house of course.`, {}),
        squishyToy: createGameObject(`Pink Flamingo Squishy Toy`, `It's head is tearing off. Maybe if can be sewn.`, {}),
        strangLights: createGameObject(`Strand of Fairy Lights - 20ft`, `Make the room look cool. Girls only though!`, {}),
        squirrel: createGameObject(`Squirrel Stuffed Animal with Nuts`, `It looks like you should be careful not to touch it's nuts!`, {
            execute: async ({ command, target, onMessage }) => {
                if (command === `touch` && target.includes(`nuts`)) {
                    gameState.achievements.addAchievement(`🐿️ Don't Be Touchin My Nutz!`);

                    return triggerTimedMessage(onMessage, {
                        output: randomItem([
                            `The squirrel goes nuts and begins to chew off your arm.`,
                            `The squirel had more than just nuts with him.`,
                            `Despite the warnings, you decide to touch the squirrel's nuts anyway.`,
                            `Everyone told you to keep your hands to yourself.`,
                        ]),
                    }, 5, `danger`, async () => await triggerGameOver(onMessage, `Don't be touchin my nutz!`));
                }
                return null;
            },
        }),
        tickingPackage: createGameObject(`Ticking Package`, `Ummmm... it's ticking`, {
            execute: async ({ command, onMessage }) => {
                if (command === `open`) {
                    gameState.achievements.addAchievement(`💣 Your Head Explode!`);

                    return await triggerGameOver(onMessage, randomItem([`You have Exploded!`, `You're head acksplod!`, `You no longer hear ticking... probably because your head is gone.`]));
                }
                return null;
            },
        }),
        limeCoconut: createGameObject(`Lime & Coconut`, `It seems like I have heard about this before.`, {
            execute: async ({ command, target, onMessage }) => {
                if (command === `put` && target.includes(`lime`) && target.includes(`coco`)) {
                    gameState.achievements.addAchievement(`🥥 Put the Lime in the Coconut!`);

                    return await triggerGameOver(onMessage, `
                    You put the lime in the coconut, you drank 'em bot' up
                    Put the lime in the coconut, you drank 'em bot' up
                    Put the lime in the coconut, you drank 'em bot'up
                    Put the lime in the coconut, you call your doctor, woke 'I'm up
                    Said "doctor, ain't there nothing' I can take?"
                    I said, "doctor, to relieve this belly ache"
                    I said "doctor, ain't there nothin' I can take?'
                    I said, "doctor, to relieve this belly ache"`);
                }
                return null;
            },
        }),
    };

    // These don't indicate state, just creation containers for self reference
    const yardObjects = {
        snake: createGameObject(`Snake`, `It's a brown snake. Let's keep it! I have a small aquarium in my room.`, {
            execute: async ({ command, target }) => {
                if (command === `put` && target.includes(`mailbox`)) {
                    // if (!mailbox.isOpen) {
                    //     return {
                    //         output: `The mailbox is not open.`,
                    //     };
                    // }
                    mailbox.isOpen = true;
                    if (mailbox.package) {

                        return {
                            output: `The mailbox has something in it already.`,
                        };
                    }

                    removeFromInventory(yardObjects.snake);
                    mailbox.package = yardObjects.snake;
                    return {
                        output: `You put the snake in the mailbox. He looks at you with his sad little snake eyes...`,
                    };
                }
                return null;
            },
        }),
    };

    const yard = {
        ...createGameObjectTitle(`Grass Yard`),
        description: () => {
            if (yard.contents.includes(yardObjects.snake)) {
                return `This is a large yard. A snake is sunning itself on a rock in the grass.`;
            }
            return `This is a large grass yard in front of a house. 
            Only the center of the yard is mowed and it looks like it might be in the shape of a heart.`;
        },
        contents: getValuesAsItems(yardObjects),
    };

    const pickupTruck = {
        ...createGameObjectTitle(`Crashed Pickup Truck`),
        description: () => `The crashed pickup truck is smoking. 
        The front end looks like it is hugging that tree. Clearly it is not familiar with social distancing.
        As you get near, you wonder if the driver had his own personal accident when he wrecked.

        In the bed of the truck are ${[
                `some spent shotgun shells`,
                `a few full trash bags`,
                ...pickupTruck.contents.map(x => x.titleWithA)].join(`, `)}, and... ${randomItem([
                    `a bunch of beer cans`,
                    `some empty cigarette packages`,
                    `an old tire`,
                ])}.
        `,
        hasCrashed: false,
        contents: getValuesAsItems(mailObjects),
    };

    const mailbox = {
        ...createGameObjectTitle(`Mailbox`),
        description: () => `There is ${mailbox.isOpen ? `an open` : `a small closed`} mailbox nearby. 
            ${mailbox.isOpen && mailbox.package ? `There is a ${mailbox.package.title} inside.` : ``}`,
        isOpen: false,
        isDelivering: false,
        deliveryCount: 0,
        package: null as GameItem | null,
    };

    const placeRandomItemInMailbox = () => {
        let i = randomIndex(pickupTruck.contents.length);

        if (mailbox.deliveryCount >= 1 && pickupTruck.contents.find(x => x === mailObjects.tickingPackage)) {
            i = pickupTruck.contents.indexOf(mailObjects.tickingPackage);
        }
        mailbox.deliveryCount++;

        const p = pickupTruck.contents[i];
        pickupTruck.contents.splice(i, 1);
        mailbox.package = p;
        mailbox.isOpen = false;
    };

    // Testing
    // inventory.push(...mailPackages);

    // Setup Scene
    placeRandomItemInMailbox();

    const { tickingPackage } = mailObjects;
    const { snake } = yardObjects;

    const deliverMail = async (input: GameInput): Promise<GameAction> => {
        mailbox.isDelivering = false;

        if (mailbox.package === snake) {

            gameState.achievements.addAchievement(`😡 He's Got Angry Eyes`);
            return await triggerGameOver(input.onMessage, `
                You see ${randomItem([`a UPS truck`, `an Amazon truck`, `an ambulance`, `a cop car`, `the van from down by the river`, `the ice cream truck`])} drive up.
                The driver waves at you while carrying a package to the mailbox.

                As he opens the mailbox, your little pal jumps out and bites him in the face.
                At first you think this is funny, but then the driver rips the snake off and throws him into the trees.

                The driver looks up and sees you laughing.
                You see a look of rage in his eyes as he gets back in, revs the engine, and speeds towards you...
                `);
        }

        if (mailbox.package) {
            const item = mailbox.package;
            pickupTruck.contents.push(item);
            mailbox.isOpen = true;

            if (item === tickingPackage) {
                pickupTruck.hasCrashed = true;
                pickupTruck.contents.splice(pickupTruck.contents.indexOf(tickingPackage), 1);

                gameState.achievements.addAchievement(`🏴‍☠️ Take the Porch Pirates!`);
                return {
                    output: `
                    You see a package-thief drive up in an old beat up pickup truck.
                    He drives right up to the mailbox, grabs the package, and starts off.

                    Immediately, you hear a loud pop and see colored smoke fill the cab.
                    
                    The truck swerves wildly and crashes into a large oak tree.

                    After a minute, the driver jumps out, covered in glitter. 
                    
                    He runs into the trees screaming about a horrible smell...
                    `,
                };
            }

            placeRandomItemInMailbox();

            gameState.achievements.addAchievement(`📮 Return to Sender`);
            return {
                output: `
                You see ${randomItem([`a UPS truck`, `an Amazon truck`, `the ice cream truck`])} drive up and a driver wearing a trench coat get out.
                
                He carries a package to the mail box, but when he opens it, he looks suprised.

                He looks around suspiciously... and then puts the ${item.title} under his trenchcoat as he slips the new package into the mailbox.

                He nervously looks around again, then rushes back to the truck and quickly drives off.`,
            };
        }

        placeRandomItemInMailbox();
        gameState.achievements.addAchievement(`🚚 Same Day Delivery!`);
        return {
            output: `
            You see ${randomItem([`a UPS truck`, `an Amazon truck`, `an ambulance`, `a cop car`, `the van from down by the river`, `the ice cream truck`])} drive up, and the driver puts a package in the mailbox.
            He is wearing a ${randomItem([`football helmet`, `Santa hat`, `bow tie`, `hazmat suit`, `clown uniform`, `bearskin rug`])}.
            As he drives away, he shouts, "${randomItem([`Watch out for the monkeys!`, `Merry Christmas!`, `Ducks... ducks... ducks everywhere...`, `That squirrel is nuts!`])}"`,
        };
    };

    const closeMailbox = async (input: GameInput): Promise<GameAction> => {
        if (mailbox.package === snake) {
            if (mailbox.isDelivering) {
                return { output: `You close the mailbox with your little friend inside...` };
            }
            mailbox.isDelivering = true;

            return await triggerTimedMessage(input.onMessage, {
                output: `
                You close the mailbox with your little friend inside...
                Deep down, you feel like you are making bad life choices...
                We'll give you some time to think about it...`,
            }, 20, `warning`, () => deliverMail(input));
        }

        if (pickupTruck.contents.length <= 0 || mailbox.package) {
            return {
                output: `You close the mailbox. ${mailbox.package ? `There is still something inside it though.` : `Thanks!`}`,
            };
        }

        if (mailbox.isDelivering) {
            return { output: `You close the mailbox.` };
        }
        mailbox.isDelivering = true;

        gameState.achievements.addAchievement(`📪 These Kids Keep Stealing My Mail!`);
        return triggerTimedMessage(input.onMessage, { output: `You close the mailbox.` }, 10, `normal`, () => deliverMail(input));
    };

    const execute = async (input: GameInput): Promise<GameAction> => {
        const { command, target, onMessage } = input;

        if (command === `open` && target === `mailbox`) {
            if (mailbox.isOpen) {

                return {
                    output: `Really? The mailbox is already open!`,
                };
            }

            mailbox.isOpen = true;
            gameState.achievements.addAchievement(`📭 You've Got Mail!`);
            return {
                output: mailbox.package ? `You see a ${mailbox.package.title} in the mailbox.` : `There is nothing in the mailbox.`,
            };
        }

        if (command === `close` && target === `mailbox`) {
            if (!mailbox.isOpen) {
                return {
                    output: `It's already closed.`,
                };
            }

            mailbox.isOpen = false;
            return closeMailbox(input);
        }

        if (command === `take` && mailbox.package && isMatch(mailbox.package, target)) {
            const p = mailbox.package;
            inventory.push(p);
            mailbox.package = null;
            const wasOpen = mailbox.isOpen;
            mailbox.isOpen = true;


            if (p === tickingPackage) {
                gameState.achievements.addAchievement(`📦 Umm... It's ticking`);

                return {
                    Component: () => (inventory.includes(tickingPackage) && <CountDownTimer time={180} color='#FF0000' onTimeElapsed={async () => {
                        if (!inventory.includes(tickingPackage)) { return; }

                        gameState.achievements.addAchievement(`⏰ Is it Bad that It's Ticking?`);
                        onMessage(await triggerGameOver(onMessage, `You obviously need to watch more TV. A ticking package is generally bad news.`));
                    }} /> || <span />),
                    output: `${!wasOpen ? `You open the mailbox and` : `You`} take the ${p.title}. As you place it carefully in your backpack, you notice the ticking is getting louder.`,
                };
            }

            return {
                output: `${!wasOpen ? `You open the mailbox and` : `You`} take the ${p.title} and put it in your backpack.`,
            };
        }

        if (command === `take` && yard.contents.includes(snake) && isMatch(snake, target)) {
            const p = snake;
            moveItem(p, yard.contents, inventory);

            gameState.achievements.addAchievement(`🐍 You Would do Well in Slitherin`);
            return {
                output: `You take the ${p.title} and put it in your backpack.`,
            };
        }

        if (command === `take` && pickupTruck.hasCrashed) {
            const f = pickupTruck.contents.find(x => isMatch(x, target));
            if (f) {
                moveItem(f, pickupTruck.contents, inventory);

                gameState.achievements.addAchievement(`♻️ Another Man's Trash`);
                return {
                    output: `You take the ${f.title} from the back of the truck.`,
                };
            }
        }

        if (command === `put`) {
            if (target.includes(`mailbox`)) {
                // if (!mailbox.isOpen) {
                //     return {
                //         output: `The mailbox is not open.`,
                //     };
                // }
                mailbox.isOpen = true;
                if (mailbox.package) {
                    return {
                        output: `There is already something in the mailbox.`,
                    };
                }

                const f = inventory.find(x => isMatch(x, target));
                if (f) {
                    removeFromInventory(f);
                    mailbox.package = f;
                    const wasOpen = mailbox.isOpen;
                    mailbox.isOpen = false;
                    return await triggerTimedMessage(input.onMessage, {
                        output: `${!wasOpen ? `You open the mailbox and` : `You`} put the ${f.title} in the mailbox ${!wasOpen ? `and close it again.` : `and close it.`}`,
                    }, 10, `normal`, () => deliverMail(input));
                }
            }
        }

        return null;
    };

    // const look = async (input: GameInput): Promise<GameAction> => {
    //     // if (target.includes(`house`)) {
    //     //     return {
    //     //         output: `You are standing in a large grass yard of a biege house, with a broken front door.
    //     //         There is ${mailbox.isOpen ? `an open` : `a small`} mailbox nearby.`,
    //     //     };
    //     // }

    //     // if (target.includes(`grass`) || target.includes(`yard`)) {
    //     //     if (yard.snake) {
    //     //         return {
    //     //             output: `You see a snake crawling in the grass.`,
    //     //         };
    //     //     }

    //     //     return {
    //     //         output: `You are standing in a large grass yard.`,
    //     //     };
    //     // }

    //     // if (target.includes(`mailbox`)) {
    //     //     return {
    //     //         output: `There is ${mailbox.isOpen ? `an open` : `a small`} mailbox nearby. ${mailbox.isOpen && mailbox.package ? `There is a ${mailbox.package.title} inside.` : ``}`,
    //     //     };
    //     // }

    //     const lookItems = [
    //         mailbox,
    //         yard,
    //         mailTruck.hasCrashed ? mailTruck : null,
    //     ];
    // };

    const gameScene: GameScene = {
        introduction: `# The Mailbox
        You are standing in a large grass yard near a small mailbox.
        `,
        execute,
        getLookItems: () => [
            mailbox,
            yard,
            pickupTruck.hasCrashed ? pickupTruck : null,
        ],
    };

    // Type Check
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //    const _gameScene: GameScene = gameScene;
    return gameScene;
};

export type Scene01Mailbox = ReturnType<typeof createScene_01mailbox>;
