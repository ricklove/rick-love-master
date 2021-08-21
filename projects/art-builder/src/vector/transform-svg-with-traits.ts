import { selectTraits } from 'art/artwork/nft-adventure/stories/nft-text-adventure-art/trait-logic';
import { ColorTrait, colorTraitParts, colorTraits, versions } from 'art/artwork/nft-adventure/stories/nft-text-adventure-art/traits';
import { RgbHex, SvgDef, SvgDoc, SvgElement, SvgElementStyle } from './inkscape-svg-types';

export const transformSvgWithTraits = (svgDoc: SvgDoc, seed: string) => {

    const {
        selectedTraits,
        selectedColors,
    } = selectTraits(seed, versions._2021_08_21);

    const svg = svgDoc.elements.find(x => x.name === `svg`);
    if (!svg || !svg.elements.length){ return; }

    const defs = svg.elements.map(x => x.name === `defs` ? x : null)[0];

    const visitNode = <TContext>(node: SvgElement, context: TContext,
        handleNode: (
            node: SvgElement, context: TContext
        ) => undefined | { childContext?: TContext, skipChildren?: boolean },
    ) => {
        const result = handleNode(node, context);
        if (result && result.skipChildren){ return; }

        node.elements?.forEach(n => {visitNode(n, result?.childContext ?? context, handleNode);});
    };
    const visitNodeWithTraitContext = <TContext>(node: SvgElement, context: TContext,
        handleNode: (
            node: SvgElement, context: { trait: ColorTrait }
        ) => undefined | { childContext?: TContext, skipChildren?: boolean },
    ) => {
        const rootContext = {
            trait: `body` as ColorTrait,
            // color: selectedColors.body,
        };

        visitNode(node, rootContext, (n, context) => {
            const result = handleNode(n, context);

            // Detect trait change
            let newTrait = context.trait;

            const label = n.attributes[`inkscape:label`]?.toLocaleLowerCase();
            if (!label){ return; }

            if (colorTraits.includes(label as ColorTrait)){
                newTrait = label as ColorTrait;
            }
            Object.entries(colorTraitParts).map(x => ({ key: x[0] as ColorTrait, value: x[1] })).forEach(p => {
                const valuesLower = [...p.value].map(x => x.toLocaleLowerCase());
                if (valuesLower.includes(label)){
                    newTrait = p.key;
                }
            });

            return { childContext: { ...result?.childContext ?? context, trait: newTrait } };
        });
    };

    const getRgbHex = (value: undefined | string): undefined | RgbHex => {
        if (!value){ return; }
        if (!value.match(/^#[0-9A-Fa-f]{6}$/)){ return;}
        return value as RgbHex;
    };
    const getDefPrimaryColor = (ref: undefined | string): undefined|RgbHex => {
        if (!ref){ return; }
        const def = defs?.elements.find(x => `#` + x.attributes.id === ref);
        if (!def){ return; }

        if (def.attributes[`xlink:href`]){
            return getDefPrimaryColor(def.attributes[`xlink:href`]);
        }

        const firstStop = def.elements?.find(x => x.name === `stop`);
        if (!firstStop){ return; }

        // style="stop-color:#896d2f;stop-opacity:1"
        const stopStyle = firstStop.attributes.style;
        const stopColor = stopStyle.match(/stop-color:([^;]+)/)?.[1];
        return getRgbHex(stopColor);

    };
    const getPrimaryColor = (style: undefined | SvgElementStyle, styleName: 'fill'|'stroke'): undefined|RgbHex => {
        if (!style){ return; }
        const styleValue = style.split(`;`).map(s => s.split(`:`)).find(s => s[0] === styleName)?.[1];
        if (!styleValue){ return; }

        // fill:url(#linearGradient99999);
        // fill:url(#radialGradient99999);
        if (styleValue.startsWith(`url(`)){
            const ref = styleValue.match(/url\(([^)]+)\)/)?.[1];
            return getDefPrimaryColor(ref);
        }

        return getRgbHex(styleValue);
    };

    const traitColors = {} as { [color in ColorTrait]: RgbHex[] };
    svg.elements.forEach(rootNode => {
        if (rootNode.name === `sodipodi:namedview`){ return; }
        if (rootNode.name === `defs`){ return; }

        visitNodeWithTraitContext(rootNode, {}, (n, context) => {
            // Grab style colors
            const addColor = (color?: RgbHex) => {
                if (!color){ return;}
                if (!traitColors[context.trait]){
                    traitColors[context.trait] = [];
                }
                traitColors[context.trait].push(color);
            };

            addColor(getPrimaryColor(n.attributes.style, `fill`));
            addColor(getPrimaryColor(n.attributes.style, `stroke`));

            return {};
        });

        // // Adjust style
        // const rootContext = {
        //     trait: `body` as ColorTrait,
        //     // color: selectedColors.body,
        // };

        // visitNode(rootNode, rootContext, (n, context) => {
        //     // Grab style colors
        //     const addColor = (color?: RgbHex) => {
        //         if (!color){ return;}
        //         traitColors[context.trait].push(color);
        //     };

        //     addColor(getPrimaryColor(n.attributes.style, `fill`));
        //     addColor(getPrimaryColor(n.attributes.style, `stroke`));

        //     // Detect trait change
        //     let newTrait = context.trait;

        //     const label = n.attributes[`inkscape:label`].toLocaleLowerCase();

        //     if (colorTraits.includes(label as ColorTrait)){
        //         newTrait = label as ColorTrait;
        //     }
        //     Object.entries(colorTraitParts).map(x => ({ key: x[0] as ColorTrait, value: x[1] })).forEach(p => {
        //         const valuesLower = [...p.value].map(x => x.toLocaleLowerCase());
        //         if (valuesLower.includes(label)){
        //             newTrait = p.key;
        //         }
        //     });

        //     return { childContext: { trait: newTrait } };
        // });

    });

    console.log(`traitColors`, { traitColors });

};


