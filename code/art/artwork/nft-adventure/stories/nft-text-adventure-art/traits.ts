/* eslint-disable @typescript-eslint/no-unused-vars */


// Rules for variants

type ColorTrait =
| 'eyes'
| 'mouth'
| 'facehair'
| 'hair'
| 'face'
| 'body'
| 'nose'
/** Default color range for other traits */
| 'equipment'
;

export type VersionDate = `${number}-${number}-${number}`;
const versions = { _2021_08_21: `2021-08-21` as VersionDate };

const traits = {
    humanoid: {
        // High Saturation, Any Color
        radioactive: {
            rarity: 1,
            version: versions._2021_08_21,
            colors: [
                { h: [0, 360], s: [80, 100], l: [70, 90], targets: [`eyes`] },
                { h: [0, 360], s: [80, 100], l: [+0, 20], targets: [`mouth`] },
                { h: [0, 360], s: [80, 100], l: [20, 40], targets: [`hair`, `facehair`] },
                { h: [0, 360], s: [80, 100], l: [40, 60], targets: [`face`, `body`, `nose`] },
                { h: [0, 360], s: [80, 100], l: [20, 70], targets: [`equipment`] },
            ],
        },
        // Green/Gray Colors
        zombie: {
            rarity: 1,
            version: versions._2021_08_21,
            colors: [
                { h: [45, 180], s: [10, 70], l: [70, 90], targets: [`eyes`] },
                { h: [45, 180], s: [10, 70], l: [+0, 20], targets: [`mouth`] },
                { h: [45, 180], s: [10, 70], l: [20, 40], targets: [`hair`, `facehair`] },
                { h: [45, 180], s: [10, 70], l: [40, 60], targets: [`face`, `body`, `nose`] },
                { h: [+0, 250], s: [10, 70], l: [20, 70], targets: [`equipment`] },
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
                { h: [20, 40], s: [50, 80], l: [10, 80], targets: [`face`, `body`, `nose`] },
                { h: [0, 250], s: [50, 90], l: [20, 80], targets: [`equipment`] },
            ],
        },
    },
    hair: {
        mohawk: { rarity: 1, version: versions._2021_08_21 },
        balding: { rarity: undefined, version: versions._2021_08_21 },
        long: { rarity: undefined, version: versions._2021_08_21 },
        medium: { rarity: undefined, version: versions._2021_08_21 },
        short: { rarity: undefined, version: versions._2021_08_21 },
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
        chineseCap: { rarity: 1, version: versions._2021_08_21 },
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
const _checkTraitSelections = (null as unknown as TraitSelections)[(null as unknown as TraitName)];

/** Themes override trait selections */
type TraitSelectionOverride = Omit<TraitSelections, 'theme'>;
const themes = {
    baseball: {
        rarity: 1,
        selections: {
            weapon: `baseballGlove`,
            headwear: `baseballCap`,
            clothes: `baseballUniform`,
        } as TraitSelectionOverride,
    },
    normal: { rarity: undefined, selections: {} as TraitSelectionOverride },
} as const;

/** Effects require custom logic
 *
 * They can apply to a single trait or to the whole output
 */
const effects = {
    /** Render vector graphics instead of pixel art */
    vector: { rarity: 1 },
    /** 64x64 instead of 32x32 pixel art */
    hiRes: { rarity: 1 },
    /** Matrix Wireframe */
    glitch: { rarity: 1 },
    /** ? Ascii - From pixel to ascii with a limited char set */
    ascii: { rarity: 1 },
    normal: { rarity: undefined },
} as const;


export const nftTextAdventureTraits = {
    traits,
    themes,
    effects,
};
