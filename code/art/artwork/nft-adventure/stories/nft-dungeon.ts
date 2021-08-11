const metadata = {
    key: `nft-dungeon`,
    name: `Nft Dungeon`,
    description: `Nft Dungeon is a text adventure driven by the nft community`,
    author: `Rick Love & the NFT Community`,
};

// https://cloudapps.herokuapp.com/imagetoascii/
// .:*I$VMoun-
// .!"#$%&O0olWM()*+-{|}~<>[]
const asciiArt_manArmUp = `
..........()*,......................
........()~}.M},....................
......()~}-}MMMMMMW!................
...........>%MMMMMMM%%ol!...........
......()~}-}WW%MMMMM%MMMMMW}>.......
...............>MW)..-]%MMMMMMW}....
.............()<'.......<oMMMMMM%]..
...........................|WMMMMM%.
..........,;.................!WMMMM~
.......<o#####l..............!oMMM%~
......######***]............oMMMMM%.
.....M##$**::..;*..........*%MMMMM].
.....O##$*:..::::*,.........l%MMMM%..
......###*:::*]>::,.......!}o%%MM*..
........%$*::::..),,..-|]]]]]]lo%}..
............*;:|,***.)]]]]]]]]]]]...
.............*****.)]]]]]]]]]]]]"...
....->*))<!|||}lol]]]]]]]]]]]]].....
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
        title: `Nft Dungeon`,
        asciiArt: asciiArt_manArmUp,
        description: `

Cold, damp, wet... you wake up shivering. 

When you open your eyes, everything is still dark.

You can't see anything, but you can feel that you are lying on a hard cold surface...`,
        inventory: [],
        actions: [
            { name: `search the ground`, description: `?` },
            { name: `call for help`, description: `?` },
            { name: `listen`, description: `?` },
        ],
    },
];

export const createNftAdventure_nftDungeon = () => {

    return {
        metadata,
        items,
        story,
    };
};
