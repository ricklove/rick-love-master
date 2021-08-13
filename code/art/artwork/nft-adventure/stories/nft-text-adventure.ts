const metadata = {
    key: `nft-text-adventure`,
    name: `NFT Text Adventure`,
    description: `NFT Text Adventure is a game where actions are chosen by the NFT community`,
    author: `Rick Love & the NFT Community`,
};

// https://cloudapps.herokuapp.com/imagetoascii/
// .:*I$VMoun-
// .!"#$%&O0olWM()*+-{|}~<>[]
// .,:|'Oo(){}[]
// .-:SOo
const asciiArt_manArmUp = `
.........()-,.......................
.......(),...}:.....................
.........."}:==::>..................
.....()::}:-==:::::>................
..........,==:::::::::}.............
.....():"}..:::::::::::::::.........
.............:::-...<::::::::::.....
...........():..........::::::::::..
..........................-::::::::.
.........oooSS:.............-::::::.
......:SSOOOoo::...........:::::::-.
......oOoo:o::..:.........::::::::..
.....:OOo:...:::::........::::::::..
......oOS:::::::::........o::::::...
......-oOo::::...::..:ooooooo:::....
..........::::--::::oooooooooo:.....
...........:::::::oooooooooooo:.....
....-:oooo:ooooooooooooooooooo:.....
`.trim().replace(/\./g, ` `);

const items = [
    {
        key: `torch`,
        name: `Torch`,
        description: `This torch will be your light when all other lights go out...`,
    },
    {
        key: `torch_lit`,
        name: `Lit Torch`,
        description: `This torch it lit!`,
    },
    {
        key: `rope`,
        name: `Knife`,
        description: `That's not a knife... This is a knife!`,
    },
] as const;
type GameItemKey = typeof items[number]['key'];

type GameStep = {
    title: string;
    asciiArt?: string;
    description: string;
    glitch?: {
        ratio: number;
        messages: string[];
    };
    inventory: GameItemKey[];
    actions: {
        name: string;
        description: string;
        gameOver?: string | false;
    }[];
};
/** There is only a single linear progression, all other choices end in death */
const story: GameStep[] = [
    {
        title: `NFT Text Adventure`,
        asciiArt: asciiArt_manArmUp,
        description: ``,
        inventory: [],
        actions: [
            {
                name: `play`,
                description: ``,
                gameOver: false,
            },
        ],
    },
    {
        title: `Cold`,
        // asciiArt: asciiArt_manArmUp,
        description: `

Cold, damp, wet... you wake up shivering. 

When you open your eyes, everything is still dark.

You can't see anything, but you can feel that you are lying on a cold hard surface...`,
        glitch: {
            ratio: 0.07,
            messages: [`HELP ME!`, `Who are you?`, `What are you?`, `How are you?`, `Where are you?`, `Why are you?`, `I'm cold`, `I'm alone`, `I'm afraid`],
        },
        inventory: [],
        actions: [
            {
                name: `search the ground`,
                description: `You search the ground...`,
                gameOver: `
As you feel around your position, you realize that there is no ground anywhere around you.
                
There is no way you can escape.

`,
            },
            {
                name: `call for help`,
                description: `You call for help...`,
                gameOver: `
Suddenly you hear scratching quickly coming towards you.
                
You feel a sharp pain in your stomach. Your muscles spasm for a moment, but then you are no longer able to move.
`,
            },
            { name: `listen`, description: `You carefully listen without making a sound...`, gameOver: false },
        ],
    },
    {
        title: `Whispers`,
        // asciiArt: asciiArt_manArmUp,
        description: `

In the distance, you hear the slight brookling of water flowing over stones, but nothing else at first.

Then, you hear something you did not expect, a whisper in your ear that says: 

"Do not move... They will see you..."`,
        glitch: {
            ratio: 0.03,
            messages: [`HELP ME!`, `Who are you?`, `What are you?`, `How are you?`, `Where are you?`, `Why are you?`, `I'm cold`, `I'm alone`, `I'm afraid`],
        },
        inventory: [],
        actions: [
            { name: `remain still`, description: `You decide not moving is a good idea for now...` },
            { name: `move away`, description: `You jerk away from the whisper...` },
            { name: `stand up`, description: `You push yourself off the ground...` },
        ],
    },
];

export const createNftAdventure_nftTextAdventure = () => {

    return {
        metadata,
        items,
        story,
    };
};
