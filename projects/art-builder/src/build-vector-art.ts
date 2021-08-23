import fsRaw from 'fs';
import { injectSvgComponents } from './vector/inject-svg-components';
import { renderSvgWithTraits } from './vector/render-svg';
import { selectTraits } from 'art/artwork/nft-adventure/stories/nft-text-adventure-art/trait-logic';
import { versions } from 'art/artwork/nft-adventure/stories/nft-text-adventure-art/traits';

const fs = fsRaw.promises;

export const buildVectorArt = async (svgDirectory: string, outDir: string, options?: { skipExtraction?: boolean }) => {


    // Test traits
    const testTraits = false;
    if (testTraits){
        const traits = [... new Array(100)].map((x, i) => {
            return selectTraits(`${i}`, versions._2021_08_21);
        });
        console.log(`traits`, {
            // traits: traits.map(t =>
            //     `${t.seed}: ${Object.entries(t.selectedTraits).map(x => `${x[0]}:${x[1].traitKey}`).join(`\n`)}`,
            // ),
            theme: traits.map(t =>
                `${t.seed}: ${t.selectedTraits.theme.traitKey}`,
            ),
            humanoid: traits.map(t =>
                `${t.seed}: ${t.selectedTraits.humanoid.traitKey}`,
            ),
            headwear: traits.map(t =>
                `${t.seed}: ${t.selectedTraits.headwear.traitKey}`,
            ),
            weapon: traits.map(t =>
                `${t.seed}: ${t.selectedTraits.weapon.traitKey}`,
            ),
        });
        return;
    }


    try {
        await injectSvgComponents(svgDirectory);
        await renderSvgWithTraits(svgDirectory, outDir, [...new Array(256)].map((x, i) => `${i}`));
        // await renderSvgWithTraits(svgDirectory, outDir, [`92`]);
    } catch (err){
        console.error(`FAIL buildVectorArt`, err);
    }
    console.log(`DONE`);
    process.exit();
};

