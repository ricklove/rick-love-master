import { createRandomGenerator } from 'art/rando';
import { nftTextAdventureTraits, TraitName, TraitSelections, VersionDate } from './traits';

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

const selectTrait = <T extends Record<string, unknown>>(
    traitObject: T,
    traitName: TraitName,
    seed: string,
    forcedSelections: TraitSelections,
) => {
    const keys = Object.entries(traitObject).filter(f => f[1]).map(f => f[0] as keyof typeof traitObject);
    const { random } = createRandomGenerator(`${seed}-${traitName}`);

    const randomKey = keys[Math.floor(keys.length * random())] || keys[0];
    const traitKey = forcedSelections[traitName] ?? randomKey;
    return {
        traitKey,
        trait: traitObject[traitKey],
        createRandomGenerator: (key: string) => createRandomGenerator(`${seed}-${traitName}-${key}`),
    };
};

export const selectTraits = (seed: string, version: VersionDate) => {
    const { traits, themes, effects } = nftTextAdventureTraits;

    const theme = selectTrait(themes, `theme`, seed, {});
    const forcedSelections = theme.trait.selections;

    const selectedTraits = {
        theme,
        effect: selectTrait(effects, `effect`, seed, forcedSelections),
        humanoid: selectTrait(themes, `humanoid`, seed, forcedSelections),
        hair: selectTrait(themes, `hair`, seed, forcedSelections),
        facehair: selectTrait(themes, `facehair`, seed, forcedSelections),
        weapon: selectTrait(themes, `weapon`, seed, forcedSelections),
        clothes: selectTrait(themes, `clothes`, seed, forcedSelections),
        headwear: selectTrait(themes, `headwear`, seed, forcedSelections),
    };

    return {
        seed,
        version,
        selectedTraits,
    };
};
