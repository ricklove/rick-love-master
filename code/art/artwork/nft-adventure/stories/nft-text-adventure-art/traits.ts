/* eslint-disable @typescript-eslint/no-unused-vars */

// Rules for variants

export const colorTraits = [
    `eyes`,
    `mouth`,
    `facehair`,
    `hair`,
    // `face`,
    `body`,
    `nose`,
    // Equipment
    `clothes`,
    `headwear`,
    `weapon`,
] as const;
export type ColorTrait =typeof colorTraits[number];

/** Map some color to multiple elements
 *
 * Colors will be applied like css styles:
 *
 * - the color becomes the default for that part of the tree
 * - a more specific color overrides the default color
 * - i.e. eyes inside of face will use eyes color
*/
export const colorTraitParts = {
    'facehair': [`eyebrows`],
    // 'face': [],
    'body': [`headShape`, `chest`, `neck`, `handShape`, `armR`, `armL`],
    // 'equipment': [`clothes`, `headwear`, `weapon`],
} as const;

// export type VersionDate = `${number}-${number}-${number}`;
export type VersionDate = string & { __type: '${number}-${number}-${number}' };
export const versions = { _2021_08_21: `2021-08-21` as VersionDate };

export type ColorRange = {
    readonly h: readonly [number, number];
    readonly s: readonly [number, number];
    readonly l: readonly [number, number];
};
export type ColorTraitRange = ColorRange & {
    readonly targets: readonly ColorTrait[];
};

const traits = {
    humanoid: {
        // High Saturation, Any Color
        radioactive: {
            rarity: 5,
            version: versions._2021_08_21,
            colors: [
                { h: [0, 360], s: [80, 100], l: [70, 90], targets: [`eyes`] },
                { h: [0, 360], s: [80, 100], l: [+0, 20], targets: [`mouth`] },
                { h: [0, 360], s: [80, 100], l: [20, 40], targets: [`hair`, `facehair`] },
                { h: [0, 360], s: [80, 100], l: [40, 60], targets: [`body`, `nose`] },
                { h: [0, 360], s: [80, 100], l: [20, 70], targets: [`clothes`, `headwear`, `weapon`] },
            ],
        },
        // Green/Gray Colors
        zombie: {
            rarity: 5,
            version: versions._2021_08_21,
            colors: [
                { h: [45, 180], s: [10, 70], l: [70, 90], targets: [`eyes`] },
                { h: [45, 180], s: [10, 70], l: [+0, 20], targets: [`mouth`] },
                { h: [45, 180], s: [10, 70], l: [20, 40], targets: [`hair`, `facehair`] },
                { h: [45, 180], s: [10, 70], l: [40, 60], targets: [`body`, `nose`] },
                { h: [+0, 250], s: [10, 70], l: [20, 70], targets: [`clothes`, `headwear`, `weapon`] },
            ],
        },
        // Natural colors
        natural: {
            rarity: undefined,
            version: versions._2021_08_21,
            colors: [
                { h: [0, 360], s: [+0, 90], l: [85, 95], targets: [`eyes`] },
                { h: [+0, 30], s: [+0, 90], l: [+0, 20], targets: [`mouth`] },
                { h: [10, 50], s: [+0, 90], l: [+0, 60], targets: [`hair`, `facehair`] },
                { h: [20, 40], s: [50, 80], l: [10, 80], targets: [`body`, `nose`] },
                { h: [0, 250], s: [50, 90], l: [20, 80], targets: [`clothes`, `headwear`, `weapon`] },
            ],
        },
    },
    hair: {
        mohawk: { rarity: 1, version: versions._2021_08_21 },
        balding: { rarity: undefined, version: versions._2021_08_21 },
        longHair: { rarity: undefined, version: versions._2021_08_21 },
        mediumHair: { rarity: undefined, version: versions._2021_08_21 },
        shortHair: { rarity: undefined, version: versions._2021_08_21 },
        none: { rarity: undefined, version: versions._2021_08_21 },
    },
    facehair: {
        marshall: { rarity: 1, version: versions._2021_08_21 },
        moustache: { rarity: undefined, version: versions._2021_08_21 },
        goatie: { rarity: undefined, version: versions._2021_08_21 },
        beard: { rarity: undefined, version: versions._2021_08_21 },
        none: { rarity: undefined, version: versions._2021_08_21 },
    },
    clothes: {
        baseballUniform: { rarity: 1, version: versions._2021_08_21 },
        tunic: { rarity: undefined, version: versions._2021_08_21 },
        none: { rarity: 1, version: versions._2021_08_21 },
    },
    headwear: {
        baseballCap: { rarity: 1, version: versions._2021_08_21 },
        chineseCap: { rarity: undefined, version: versions._2021_08_21 },
        armyHelmet: { rarity: undefined, version: versions._2021_08_21 },
        none: { rarity: undefined, version: versions._2021_08_21 },
    },
    weapon: {
        baseballGlove: { rarity: 1, version: versions._2021_08_21 },
        battleAxe: { rarity: undefined, version: versions._2021_08_21 },
        axe: { rarity: undefined, version: versions._2021_08_21 },
        none: { rarity: 1, version: versions._2021_08_21 },
    },

} as const;

type Traits = typeof traits;
type HumanoidColorTargets = NonNullable<Traits['humanoid'][keyof Traits['humanoid']]['colors'][number]['targets']>[number];
const _checkHumanoidColorTargets1: ColorTrait = null as unknown as HumanoidColorTargets;
const _checkHumanoidColorTargets2: HumanoidColorTargets = null as unknown as ColorTrait;

export type TraitName = keyof Traits | 'theme' | 'effect';

type HumanoidTrait = keyof Traits['humanoid'];
type HairTrait = keyof Traits['hair'];
type FacehairTrait = keyof Traits['facehair'];
type WeaponTrait = keyof Traits['weapon'];
type ClothesTrait = keyof Traits['clothes'];
type HeadwearTrait = keyof Traits['headwear'];
type ThemeTrait = keyof typeof themes;
type EffectTrait = keyof typeof effects;

export type TraitSelections = {
    theme?: ThemeTrait;
    effect?: EffectTrait;
    humanoid?: HumanoidTrait;
    hair?: HairTrait;
    facehair?: FacehairTrait;
    weapon?: WeaponTrait;
    clothes?: ClothesTrait;
    headwear?: HeadwearTrait;
};
const _checkTraitSelections = (null as unknown as TraitSelections)?.[(null as unknown as TraitName)];

/** Themes override trait selections */
type TraitSelectionOverride = Omit<TraitSelections, 'theme'>;
const themes = {
    baseball: {
        rarity: 1,
        version: versions._2021_08_21,
        selections: {
            weapon: `baseballGlove`,
            headwear: `baseballCap`,
            clothes: `baseballUniform`,
        } as TraitSelectionOverride,
    },
    normal: { rarity: undefined, version: versions._2021_08_21, selections: {} as TraitSelectionOverride },
} as const;

/** Effects require custom logic
 *
 * They can apply to a single trait or to the whole output
 */
const effects = {
    // /** Render vector graphics instead of pixel art */
    // vector: { rarity: 1, version: versions._2021_08_21 },
    // /** 64x64 instead of 32x32 pixel art */
    // hiRes: { rarity: 1, version: versions._2021_08_21 },
    // /** Matrix Wireframe */
    // glitch: { rarity: 1, version: versions._2021_08_21 },
    // /** ? Ascii - From pixel to ascii with a limited char set */
    // ascii: { rarity: 1, version: versions._2021_08_21 },
    normal: { rarity: undefined, version: versions._2021_08_21 },
} as const;


export const nftTextAdventureTraits = {
    traits,
    themes,
    effects,
};
