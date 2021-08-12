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
        gameOver?: boolean;
    }[];
};
/** There is only a single linear progression, all other choices end in death */
const story: GameStep[] = [
    {
        title: `Nft Text Adventure`,
        asciiArt: asciiArt_manArmUp,
        description: `

Cold, damp, wet... you wake up shivering. 

When you open your eyes, everything is still dark.

You can't see anything, but you can feel that you are lying on a cold hard surface...`,
        glitch: {
            ratio: 0.1,
            messages: [`HELP ME!`, `Who are you?`, `What are you?`, `How are you?`, `Where are you?`, `Why are you?`],
        },
        inventory: [],
        actions: [
            { name: `search the ground`, description: `?` },
            { name: `call for help`, description: `?` },
            { name: `listen`, description: `?` },
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
