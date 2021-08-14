import { GameStep } from '../types';

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
.........(;-,.......................
.......(;,...}:.....................
.........."}:==::>..................
.....(;::}:-==:::::>................
..........,==:::::::::}.............
.....(;:"}..:::::::::::::::.........
.............:::-...<::::::::::.....
...........(;:..........::::::::::..
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

const base64_manArmUp = `data:image/png;base64,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ZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6OWU5ZWZkMmYtZDViNi00NGMxLWIxM2YtMDkyZThmZGIwYzgyIgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmQ4MGI1YjExLWQ4NjAtNDczNi04NWJhLWJiZTJhZDJiNzIzMiIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjEzMDUyY2UyLTgyOTUtNDQ2Zi1hYjZlLTBkMjMzYTFjYTM5ZSIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjI4ODk3MzUyNDA1ODc5IgogICBHSU1QOlZlcnNpb249IjIuMTAuMjQiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDYwOWE5OTgtMzViNS00ZDNlLWJjODktMzkyMmU0Mzg4MGRmIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDIxLTA4LTEzVDE4OjI5OjEyIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PugL3yYAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAHdElNRQflCA0XHQyn9CZPAAAHY0lEQVRYw62WS2wdVxnH/+fMe+Y+fV++dvx+t3GCXScNaVKcIihqAk0pKqEFFYkNLFggJFjxUCOBWLBlBaViUYqQkFBZFGihpIW0kKSJnSa2Eye27/W1fe3r+5r3zJlhEUVqq9hxLP+XR9+c+Z3/+b7vfARbaLA3n+B4OmFbXgcoZkmIKUJA5xfLDeyh+HstfuboSJKx4E8sCIdqxE6JAv2P47jTAs+9CuC9vQTgPrlwZGLwEd9nv6Q8P25ZXornKQghXbLIj2qa/FRHWyqeTseWEBJDN+xgzwH2taUnPRY+4zpellKO5yg4QigBISKlNE4IOSKL4hnP86+JgmBHNKWpG/beARx8qPuv+Vwy4ntM4jlCA4CPaCJpiWvEdXyiKIIgCFysoz31NUkQxpqG83qjaVp7BtDfm1/IZxNPMxY0tYgUR0hICECWeAAUiiKCUgrT8khIwoxls/Cxxx5fmJubq+0GgGxZBX35sUPj/X+QRZ5Wa2YPL1LKGEMYEoRhCN9ncFwf1aoBw/T+4Tje7+cX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`;

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


/** There is only a single linear progression, all other choices end in death */
const story: GameStep<GameItemKey>[] = [
    {
        title: `NFT Text Adventure`,
        art: {
            //ascii: asciiArt_manArmUp,
            base64: base64_manArmUp,
        },
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
