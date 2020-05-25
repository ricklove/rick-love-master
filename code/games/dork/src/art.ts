export type Artwork = {
    art: string;
    animate?: { fps: number, draw: (timeMs: number) => string };
    autoAnimate?: { fps: number, replacements: { find: string, replace: string, ratio: number }[] };
};

export const artMan = {
    art: `
|--------------------------------------|
|                       @@@@@@@        |
|                     @@@@@@@@@@@@     |
|------,-|          @@@@@@@@@@@@@@@    |
|    ,','|           |C>   @@ )@@@@@   |
|--,','##|          /    @@ ,'@@@@@@   |
|  ||####|         (,    @@   @@@@@    |
|  ||####|          O'  @@@@@@@'''|    |
|  ||####|______     @@@@@@@     _|    |
|  ||####|     ,|     @@@@@|____/ |    |
|  ||##,'    ,' |         _/_____/ |   |
|  ||,'    ,'   |        /          |  |
|__|/    ,'  *  |       |         |  | |
|______,'  *   ,',_    /           | | |
|      | *   ,',' FFF--|      |    | | |
|      |   ,','    ____|_____/    /  | |
|      | ,','  __/ |             /   | |
|______|','   FFF_/-------------/    ; |
|       |===========,'  '=||=====||=/  |
|--------------------------------------|
`, autoAnimate: {
        fps: 5,
        replacements: [
            // Screen
            ...`,.;:'"[]{}()<>!@~&|`.split(``).map(x => ({ find: `#`, replace: x, ratio: 0.01 })),
            { find: `#`, replace: ` `, ratio: 1 },
            // Activity Lights
            { find: `\\*`, replace: `.`, ratio: 0.5 },
            { find: `\\*`, replace: ` `, ratio: 1 },
            // Fingers
            { find: `F`, replace: `|`, ratio: 0.3 },
            { find: `F`, replace: `/`, ratio: 1 },

            // Eyes
            { find: `C`, replace: `-`, ratio: 0.2 },
            // Mouth
            { find: `O`, replace: `>`, ratio: 0.2 },
            { find: `O`, replace: `}`, ratio: 1 },

            // Hair
            // { find: `@`, replace: `/`, ratio: 0.01 },
            // { find: `@`, replace: `|`, ratio: 1 },
        ],
    },
};


export const artMap = `
|--------------------------------------|
|      ,_  . ._ _                      |
|    , -|,'|~~       ;-'  _-'   ;_  ~  |
|/-|'~'-'|~~|',  ,  /  /~|_|_~/   -~~-_|
|~'~     '-,|'| ' ,|/'~         /  _ / |
|~  |      ''|~|  _|    ,_ ,       /   |
|   '|      /~    |_~||,,~ |      ,    |
|     |  _-|        _ ~|| |_     /     |
|.     | , ~_    '/      |_' | /|~     |
|      ~_'       |       -,  |'/       |
|       '|_,'|    | ,    /'     ~ ,.   |
|         /  |_    ~|   /       , ~| ' |
|        |    ,      | |'|/     |   |  |
|        ,   ,/      | /         --/   |
|         | ,'        '                |
|         /,'                          |
|         '| ~                         |
|          ~'                          |
|                                      |
|--------------------------------------|
`;

export const artYouDead = (() => {
    const art = `
|--------------------------------------|
|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|
|^^^^^^^.----------------.^^^^^^^^^^^^^|
|^^^^^^^|  You have died |^^^^^^^^^^^^^|
|^^^^^^^'----------------'^^^^^^^^^^^^^|
|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|
|^^^^^^^^^^^^__----__^^^^^^^^^^^^^^^^^^|
|^^^^^^^^_--''******''--_^^^^^^^^^^^^^^|
|^^^^^^^|****************|^^^^^^^^^^^^^|
|^^^^^^^|****************|^^^^^_---_^^^|
|^^^^^^^|****  DORK  ****|^^^^'^^|{)'^^|
|^^^^^^^|****************|^^^^^^^|/|^^^|
|^^^^^^^|****************|^^^^^^^^^|^^^|
|_______|****************|_________|___|
|.......|****************|......../|...|
|.......|****************|.............|
|.......|****************|.............|
|.......|----------------|.............|
|......................................|
|--------------------------------------|
`;

    const RAINDROP = `'`;
    const LINEWIDTH = art.trim().split(`\n`)[0].length + 1;

    const rain = [] as string[];
    let strength = 0.01;
    let isIncreasing = true;

    return {
        art,
        animate: {
            fps: 5,
            draw: () => {

                if (isIncreasing) {
                    strength *= 1.05;
                } else {
                    strength /= 1.1;
                }

                if (strength < 0.01) {
                    isIncreasing = true;
                } else if (strength > 0.5) {
                    isIncreasing = false;
                }

                rain.unshift(...[...new Array(LINEWIDTH)].map(x => Math.random() < strength ? RAINDROP : ` `));
                if (rain.length > art.length * 10) { rain.splice(art.length); }

                const chars = artYouDead.art.split(``);

                for (let i = 0; i < chars.length; i++) {
                    if (chars[i] === `^`) {
                        chars[i] = rain[i] === RAINDROP ? `'` : ` `;
                    }
                    if (chars[i] === `_`) {
                        chars[i] = rain[i] === RAINDROP ? `v` : `_`;
                    }
                }

                return chars.join(``);
            },
        },
    };
})();
