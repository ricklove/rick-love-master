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

const triats = {
    humanoid: {
        // High Saturation, Any Color
        radioactive: {
            rarity: 1,
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
        mohawk: { rarity: 1 },
        balding: { rarity: undefined },
        long: { rarity: undefined },
        medium: { rarity: undefined },
        short: { rarity: undefined },
        none: { rarity: undefined },
    },
    facehair: {
        marshall: { rarity: 1 },
        moustache: { rarity: undefined },
        goatie: { rarity: undefined },
        beard: { rarity: undefined },
        none: { rarity: undefined },
    },
    clothes: {
        baseballUniform: { rarity: 1 },
        tunic: { rarity: undefined },
        none: { rarity: 1 },
    },
    headwear: {
        baseballCap: { rarity: 1 },
        chineseCap: { rarity: 1 },
        armyHelmet: { rarity: undefined },
        none: { rarity: undefined },
    },
    weapon: {
        baseballGlove: { rarity: 1 },
        battleAxe: { rarity: undefined },
        axe: { rarity: undefined },
        none: { rarity: 1 },
    },

} as const;

type TraitCategory = typeof triats;
type HumanoidColorTargets = NonNullable<TraitCategory['humanoid'][keyof TraitCategory['humanoid']]['colors'][number]['targets']>[number];
const _checkHumanoidColorTargets1: ColorTrait = null as unknown as HumanoidColorTargets;
const _checkHumanoidColorTargets2: HumanoidColorTargets = null as unknown as ColorTrait;

type WeaponTrait = keyof TraitCategory['weapon'];
type ClothesTrait = keyof TraitCategory['clothes'];
type HeadwearTrait = keyof TraitCategory['headwear'];

/** Themes override trait selections */
export const themes = {
    baseball: {
        rarity: 1,
        selections: {
            weapon: `baseballGlove` as WeaponTrait,
            headwear: `baseballCap` as HeadwearTrait,
            clothes: `baseballUniform` as ClothesTrait,
        },
    },
    normal: { rarity: undefined },
};

/** Effects require custom logic
 *
 * They can apply to a single trait or to the whole output
 */
export const effect = {
    /** Render vector graphics instead of pixel art */
    vector: { rarity: 1 },
    /** 64x64 instead of 32x32 pixel art */
    hiRes: { rarity: 1 },
    /** Matrix Wireframe */
    glitch: { rarity: 1 },
    /** ? Ascii - From pixel to ascii with a limited char set */
    ascii: { rarity: 1 },
    normal: { rarity: undefined },
};
