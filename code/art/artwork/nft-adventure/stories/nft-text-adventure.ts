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

const base64_manArmUp = `data:image/png;base64,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ZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOmYwMTkyOTNmLWE5ZGItNGNlZi1iMzU5LTU2ZmYxYjlkMzUyNyIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiNTg2N2U4MC1lYmJkLTQzY2ItYTNhNS1hMGU5ZDQ2Yzc2OWMiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0YTNlMDQwYS03N2Q2LTQwMmUtYjhkNS1iNzEzYTg3MmY4Y2MiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBHSU1QOkFQST0iMi4wIgogICBHSU1QOlBsYXRmb3JtPSJXaW5kb3dzIgogICBHSU1QOlRpbWVTdGFtcD0iMTYyODkwMDc5Nzg2MTMwMiIKICAgR0lNUDpWZXJzaW9uPSIyLjEwLjI0IgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InNhdmVkIgogICAgICBzdEV2dDpjaGFuZ2VkPSIvIgogICAgICBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjllN2JjYmIzLTBkOWItNDQ0My05MTRmLTQ3ZGY5MDIyZTU3NSIKICAgICAgc3RFdnQ6c29mdHdhcmVBZ2VudD0iR2ltcCAyLjEwIChXaW5kb3dzKSIKICAgICAgc3RFdnQ6d2hlbj0iMjAyMS0wOC0xM1QxOToyNjozNyIvPgogICAgPC9yZGY6U2VxPgogICA8L3htcE1NOkhpc3Rvcnk+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz7ri0NjAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAB3RJTUUH5QgOABolodsy/wAABzxJREFUWMO1V1tsXFcVXefccx/z8Nhje/x2HDt+JXUcOUkThJO+QqEoQTQEoUJBvFSJb5CAj4qPICHxA398QUEghPhAfBQkXi00EVABSWonlZ04Tvwee+yZuXPnvu958EOq0NaJ3brrc2ufo6W1tddZh2AbDA90Eo1RLQwSExSCKCSEID2/WKpjD8HerXjq5HBaCDUhlCoJRVYNRpMojpVl6CH2GOTthUcnBo+5rvsil+LDQSjySkglhLxOCX7b1JT+DaXaIghRpU2Xl7ZsvucKKIVhP0yGqxUnC6qRJOGaEHKCEHI0iqOLuVxmQQr1C8/3/2CZ+momnVopVx21Zwo8/dj4quc7bHZuvSFOBAMhuucnMHUKQoDW5gycugtKiIxj+RpX2qejmFfeKwHt7YXBgY6F9pbsJ+s1u14oNDSmUxYhFAiCBIQSUCIRxQoJl4RoKMSJUiPDIwtb5bK9JwrcQ0db48SxI32/bsk30LnbK/2O69JK1UPaMlD3Y/BEAEQhjBSCSL4K4FdKqR/vGYF7GDvYO9zSnB3uKOReqlTsglNP4PohlEoQhBGSWKG46XIlwQDcVsBzSqkr72sN78fAvs45IcVIc0tTZnCwG0IoBEEAxWMsrRaxUarCMhkrlhxEsRxUCv8ZGz9iTE1NJXuiwJc++8R1y9J7AJpVUrpcyLhS9XSn5k7FcTTW1pptNUwGHge4/uYi5lc8CCGhgO8ohe++LwVOHB3pAKG37FpYvrtUehZQlHNRAyCvvDH/1uqd/diHqp3thabhIQk/vIskFtis8YtSqayU6lu72oL7YWgWWVguvryyVn7pzZklT2daNHNzRRbXq//XNze/8v2DQz2DQpL+XENai+OQen6imEZHuVAWgEvveQS7wecunDbLleqPPK/+xfX1quZHMQxmoO5GdrkW5T9wAgBw4RMnDD8I/5xJaY+5bh0rq5soliI4TjTNFZ5SSpU/UAL38Nz5yarj1JpKWzaWVipwnBAEajpI1JH7++huLu3rarN22ntnsfRMNpfDyFAf+noLyOUspDP6uEZw2TJZdscETk9Omkd7Wn9w/mjf7NOHO4NPnRqb3AmB0eHOactk9vBAK/b1tqCtJQeD6TBMdkIKcTmb1vc9dAQXTo+fssLa5aJdAo01BBxoaM5BS6Wbfv+v27WHkfjK84/39vU0zvzx1auZ4roHqYBaPZSmrhIQbWZj05vYVoEzxw+f+/h4z19yWR2eLbCw6WPdjZHIoKhT9O5EhcXlckVxZDQFKCEQhzFam3M0m2nQdY2MPNCIzj8x+o3p2btmFERIZwykmk1EBkON086bdzcPALjxMAKvXLrh9XY32oyxpqrjolBohqkrLK3aiGJR29aIPvPU8W8e6ml9IWVINBQyaNtfwFLZh6IM9S0flLJnOrsKv8ykUqHteOJBJLqbk2/nG6gVxEBx3QWlHEnENwTHBS7V8rsqMNbX2lYLYo/pZqZ3qBdWI8OtTY71tTJ0S6C7fzQb1NdumwbpWljBtmEkZWiPzM1XmpwAsEwdXR0W2loo5sJE1UPxz21HkM1aJ6VQNG2lkUQSTkWgP9uE/WP7UY03sLhs06kbi0yATAJ4+R2p6swZsnDr2sDjJ9I3bi/YiFY5yrUQzCMol4GqKyeEkGrbEZydPPRCd2u2vzFjIIxiVOoJdLMVByc/As9zgWhJ2o7DAfl5qajDuXz93tmhrlZWXF3OhZ6/ZskE1+8EoFSDxhiUENhyxEWp1O8e6AOzi5tRkgi4QQIzbYEzDbaKMP3GPyDiAF193doTkwOMJExlTHyZMe0tYzE1+ihPkhfLboKrMz7CAKjYCRijONCTgc7oDx/6HPuV2tdD7HslpSEvvQh5Q4fWmMCubaDuhFCK4N9TIU2ohp48OxxE/vGOQtNUo2783FTyXIYCuQYdYSzQbTKUI4FKOUCtqiHh0n6oFf/sb9PXimtbUwbTIIWEn3B4IUcqnUasBIJEA2Eajh0agpHNIWUZ3Y2m9ldDqXOOHyClAXYo4AkFP0zgRBwBl4ilHNnVazg2fCB7oL996NmzE1f39bbCcX1cm76LcsXDyfEhlJ0q/v76DGZn11BgCnEQo1arI4wkqkJCB8CFgi0VTEoATTO9hMc7DiSlcjW+Ob+8zoX2p0yD9VVCgLobwjAYtmp1XJleRqXsI08pLI1gc7MKO+AIlQKlFBoFqAKUUtA1ajtcfG9Xkez5J4+Z+ax5uuyEX/vJT19DLmfBrnmghCKJY/Tk0xhtb8SWiFBcteFFHImUaMhYiLiAjDgSAIwQeELuPBO2N2byX3jyyKVHuprHKKWIhcBoVx5+lMAN0nAjjphLdOQsMI1CpXXM+iEirpAzGWScgAsJBQWbq/+R2EUo/ejRkTuDbfmmjKlDowRSabCYBpNRrFQ8bNQ8GJqGSAgoBTSkLHQ3ZyHCGqw0g+vE4AJo1ylsLkAVYBKCWL3zC/lfOq/FX/79oLgAAAAASUVORK5CYII=`;

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