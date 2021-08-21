import { HslColor } from 'art/color-format';
import { createRandomGenerator } from 'art/rando';
import { ColorRange, ColorTrait, ColorTraitRange, colorTraits, nftTextAdventureTraits, TraitName, TraitSelections, VersionDate } from './traits';

const filterVersions = <T extends { [key: string]: { version: VersionDate } }>(
    traitObject: T,
    version: VersionDate,
): Partial<T> => {
    const clone = { ...traitObject } as Partial<T>;

    Object.keys(clone).map(k => k as keyof typeof clone).forEach(k => {
        const v = clone[k];
        if (v && v.version <= version){ return; }

        // Remove if trait did not exist before version
        clone[k] = undefined;
    });

    return clone;
};

const selectTrait = <
    T extends Record<TTraitName, Record<string, { rarity?: number, version: VersionDate }>>,
    TTraitName extends TraitName,
>(
    traitContainer: T,
    traitName: TTraitName,
    version: VersionDate,
    seed: string,
    forcedSelections: TraitSelections,
): {
    traitKey: keyof T[TTraitName];
    trait: T[TTraitName][keyof T[TTraitName]];
    createRandomGenerator: typeof createRandomGenerator;
} => {
    const traitObjectRaw = traitContainer[traitName];
    const traitObject = filterVersions(traitObjectRaw, version);

    const options = Object.entries(traitObject)
        .filter(f => f[1])
        .map(f => ({ key: f[0] as keyof typeof traitObject, value: f[1] }));

    const forcedTraitKey = forcedSelections[traitName];
    const forcedOption = options.find(o => o.key === forcedTraitKey);

    if (forcedOption){
        return {
            traitKey: forcedTraitKey as keyof T[TTraitName],
            trait: forcedOption.value as T[TTraitName][keyof T[TTraitName]],
            createRandomGenerator: (key: string) => createRandomGenerator(`${seed}-${traitName}-${key}`),
        };
    }

    const totalRarity = options.reduce((out, x) => {
        out += x.value?.rarity ?? 0;
        return out;
    }, 0);

    const countNonRarity = options.filter(x => x.value.rarity == null).length;
    const totalScore = 100;
    const rarityForNonRare = (totalScore - totalRarity) / countNonRarity;

    const options_byRarity = options.sort((a, b) =>
        (a.value.rarity ?? rarityForNonRare)
        - (b.value.rarity ?? rarityForNonRare));

    const { random } = createRandomGenerator(`${seed}-${traitName}`);
    const randomScore = random() * totalScore;

    let scoreSoFar = 0;
    let itemAtScore = options_byRarity[0];
    options_byRarity.forEach(x => {
        if (scoreSoFar > randomScore){ return; }
        scoreSoFar += x.value.rarity ?? rarityForNonRare;
        itemAtScore = x;
    });

    // Use override (but still go through random)
    const traitKey = itemAtScore.key;
    return {
        traitKey: traitKey as keyof T[TTraitName],
        trait: itemAtScore.value as T[TTraitName][keyof T[TTraitName]],
        createRandomGenerator: (key: string) => createRandomGenerator(`${seed}-${traitName}-${key}`),
    };
};

export const selectTraits = (seed: string, version: VersionDate) => {
    const { traits, themes, effects } = nftTextAdventureTraits;

    const theme = selectTrait({ theme: themes }, `theme`, version, seed, {});
    const forcedSelections = theme.trait.selections;

    const selectedTraits = {
        theme,
        effect: selectTrait({ effect: effects }, `effect`, version, seed, forcedSelections),
        humanoid: selectTrait(traits, `humanoid`, version, seed, forcedSelections),
        hair: selectTrait(traits, `hair`, version, seed, forcedSelections),
        facehair: selectTrait(traits, `facehair`, version, seed, forcedSelections),
        weapon: selectTrait(traits, `weapon`, version, seed, forcedSelections),
        clothes: selectTrait(traits, `clothes`, version, seed, forcedSelections),
        headwear: selectTrait(traits, `headwear`, version, seed, forcedSelections),
    };

    const selectedColors = selectColors(seed, selectedTraits.humanoid.trait.colors);

    return {
        seed,
        version,
        selectedTraits,
        selectedColors,
    };
};


export const selectColorInRange = (range: ColorRange, seed: string, key: string) => {
    const { random } = createRandomGenerator(`${seed}-colors-${key}`);

    const randomIntInRangeInclusive = (range: readonly [number, number]) =>
        Math.max(range[0], Math.min(range[1], Math.floor(range[0] + (range[1] - range[0] + 1) * random())));

    const hsl = {
        h: randomIntInRangeInclusive(range.h),
        s: randomIntInRangeInclusive(range.s),
        l: randomIntInRangeInclusive(range.l),
    };
    return { hsl };
};

export const selectColors = (
    seed: string,
    colorRanges: readonly ColorTraitRange[],
): { [colorTrait in ColorTrait]: HslColor } => {
    const selections = colorTraits.map(c => {

        const range = colorRanges.find(r => r.targets.some(t => t === c)) ?? colorRanges[ colorRanges.length - 1 ];
        const { hsl } = selectColorInRange(range, seed, c);

        return ({
            colorTrait: c,
            color: hsl,
        });
    });

    const obj = {} as { [colorTrait in ColorTrait]: HslColor };
    selections.forEach(s => {
        obj[s.colorTrait] = s.color;
    });
    return obj;
};
