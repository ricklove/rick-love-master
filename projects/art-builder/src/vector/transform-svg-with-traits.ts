import { selectTraits } from 'art/artwork/nft-adventure/stories/nft-text-adventure-art/trait-logic';
import { ColorTrait, colorTraitParts, colorTraits, versions } from 'art/artwork/nft-adventure/stories/nft-text-adventure-art/traits';
import { colorFormat, HslColor, RgbHexColor } from 'art/color-format';
import { RgbHex, StopStyleString, SvgDef, SvgDoc, SvgElement, SvgElementStyle } from './inkscape-svg-types';

export const transformSvgWithTraits = (svgDoc: SvgDoc, seed: string) => {

    const {
        selectedTraits,
        selectedColors,
    } = selectTraits(seed, versions._2021_08_21);

    console.log(`transformSvgWithTraits`, {
        selectedTraits: Object.entries(selectedTraits).map(x => `${x[0]}:${x[1].traitKey}`),
        selectedColors,
    });

    const svg = svgDoc.elements.find(x => x.name === `svg`);
    if (!svg || !svg.elements.length){
        console.error(`Missing svg`, { svgDoc });
        return;
    }

    const defs = svg.elements.find(x => x.name === `defs`) as typeof svg['elements'][1];
    if (!defs){
        console.error(`Missing defs`, { defs, svg });
        return;
    }

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
            parent: null as null | SvgElement,
        };

        visitNode(node, rootContext, (n, context) => {
            // Is selected trait
            // if( context.trait.)
            const label = n.attributes[`inkscape:label`]?.toLocaleLowerCase();

            const parentLabel = context.parent?.attributes[`inkscape:label`]?.toLocaleLowerCase();
            const traitGroup = Object.entries(selectedTraits).map(x => ({ key: x[0], value: x[1] }))
                .find(x => x.key.toLocaleLowerCase() === parentLabel);
            const isSelectedTrait = traitGroup?.value.traitKey.toLocaleLowerCase() === label;
            if (traitGroup && !isSelectedTrait){
                console.log(`Skipping unselected trait`, { label, parentLabel });
                return { skipChildren: true };
            }
            if (traitGroup){
                console.log(`Visiting selected trait`, { label, parentLabel });
            }

            const result = handleNode(n, context);

            // Detect trait change
            let newTrait = context.trait;

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

            return { childContext: { ...result?.childContext ?? context, trait: newTrait, parent: n } };
        });
    };

    const getRgbHex = (value: undefined | string): undefined | RgbHex => {
        if (!value){
            console.error(`Missing rgb hex`, { value });
            return;
        }
        if (!value.match(/^#[0-9A-Fa-f]{6}$/)){
            console.error(`Invalid rgb hex`, { value });
            return;
        }
        return value as RgbHex;
    };
    const getDefPrimaryColor = (ref: undefined | string): undefined|RgbHex => {
        if (!ref){
            console.error(`Missing ref`, { ref });
            return;
        }
        const def = defs?.elements.find(x => `#` + x.attributes.id === ref);
        if (!def){
            console.error(`Missing def`, { ref, def, defs });
            return;
        }

        if (def.attributes[`xlink:href`]){
            return getDefPrimaryColor(def.attributes[`xlink:href`]);
        }

        const firstStop = def.elements?.find(x => x.name === `stop`);
        if (!firstStop){
            console.error(`Missing stop`, { ref, firstStop });
            return;
        }

        // style="stop-color:#896d2f;stop-opacity:1"
        const stopStyle = firstStop.attributes.style;
        const stopColor = stopStyle.match(/stop-color:([^;]+)/)?.[1];
        return getRgbHex(stopColor);

    };
    const getPrimaryColor = (style: undefined | SvgElementStyle, styleName: 'fill'|'stroke'): undefined|RgbHex => {
        if (!style){ return; }
        const styleValue = style.split(`;`).map(s => s.split(`:`)).find(s => s[0] === styleName)?.[1];
        if (!styleValue){ return; }
        if (styleValue === `none`){ return; }

        // fill:url(#linearGradient99999);
        // fill:url(#radialGradient99999);
        if (styleValue.startsWith(`url(`)){
            const ref = styleValue.match(/url\(([^)]+)\)/)?.[1];
            return getDefPrimaryColor(ref);
        }

        return getRgbHex(styleValue);
    };

    const traitColors_rgb = {} as { [color in ColorTrait]: RgbHex[] };
    svg.elements.forEach(rootNode => {
        if (rootNode.name === `sodipodi:namedview`){ return; }
        if (rootNode.name === `defs`){ return; }

        visitNodeWithTraitContext(rootNode, {}, (n, context) => {

            // Grab style colors
            const addColor = (color?: RgbHex) => {
                if (!color){ return;}
                if (!traitColors_rgb[context.trait]){
                    traitColors_rgb[context.trait] = [];
                }
                // if (traitColors[context.trait].includes(color)){ return; }
                traitColors_rgb[context.trait].push(color);
            };

            addColor(getPrimaryColor(n.attributes.style, `fill`));
            addColor(getPrimaryColor(n.attributes.style, `stroke`));

            return {};
        });
    });
    console.log(`traitColors`, {
        traitColors_rgb,
        selectedColors_rgb: Object.entries(selectedColors)
            .map(x => ({
                key: x[0],
                value: colorFormat.rgbToRgbHex(colorFormat.hslToRgb(x[1])),
            })),
        selectedColors,
    });

    const traitColorShifts = colorTraits.map(t => {

        const target = selectedColors[t];
        const hslColors = (traitColors_rgb[t] ?? []).map(x => colorFormat.rgbToHsl(colorFormat.rgbHexToRgb(x)));
        if (!hslColors.length){
            return {
                trait: t,
                colorChange: undefined,
            };
        }

        const minChange = { h: 360, s: 100, l: 100 };
        hslColors.forEach(x => {
            const change = {
                h: target.h - x.h,
                s: target.s - x.s,
                l: target.l - x.l,
            };

            if (Math.abs(change.h) < minChange.h){ minChange.h = change.h; }
            if (Math.abs(change.s) < minChange.s){ minChange.s = change.s; }
            if (Math.abs(change.l) < minChange.l){ minChange.l = change.l; }
        });

        return {
            trait: t,
            colorChange: minChange,
        };
    });
    console.log(`traitColorShifts`, {
        traitColorShifts: traitColorShifts
            .map(x => `${x.trait}: hsl(${x.colorChange?.h},${x.colorChange?.s},${x.colorChange?.l})`),
    });


    // TODO: Apply the color shifts
    const calculateShiftedColorHex = (hexValue: RgbHexColor, colorChange: HslColor) => {
        const hsl = colorFormat.rgbToHsl(colorFormat.rgbHexToRgb(hexValue));
        const newHsl = {
            h: Math.max(0, Math.min(360, (hsl.h + colorChange.h) % 360)),
            s: Math.max(0, Math.min(100, hsl.s + colorChange.s)),
            l: Math.max(0, Math.min(100, hsl.l + colorChange.l)),
        };
        const newHexValue = colorFormat.rgbToRgbHex(colorFormat.hslToRgb(newHsl));
        // console.log(`calculateShiftedColorHex`, { hexValue, newHexValue, colorChange });
        return newHexValue;
    };

    const changedDefIds = new Set<string>([]);
    const applyColorShiftToDef = (ref: undefined | string, colorChange: HslColor): undefined|RgbHex => {
        if (!ref){
            console.error(`Missing ref`, { ref });
            return;
        }
        const def = defs?.elements.find(x => `#` + x.attributes.id === ref);
        if (!def){
            console.error(`Missing def`, { ref, def, defs });
            return;
        }

        if (changedDefIds.has(def.attributes.id)){ return; }
        changedDefIds.add(def.attributes.id);

        if (def.attributes[`xlink:href`]){
            applyColorShiftToDef(def.attributes[`xlink:href`], colorChange);
        }

        const stops = def.elements?.filter(x => x.name === `stop`);

        stops?.forEach(stop => {
            // style="stop-color:#896d2f;stop-opacity:1"
            const stopStyle = stop.attributes.style;
            const stopColor = stopStyle.match(/stop-color:([^;]+)/)?.[1];
            const hexValue = getRgbHex(stopColor);
            if (!hexValue){ return;}

            const newStopStyle = stopStyle.replace(hexValue, calculateShiftedColorHex(hexValue, colorChange));
            stop.attributes.style = newStopStyle as StopStyleString;
        });

    };

    const applyColorShift = (styleObj: undefined | { style?: undefined | SvgElementStyle }, styleName: 'fill'|'stroke', colorChange: HslColor): undefined|RgbHex => {
        if (!styleObj){ return; }
        const { style } = styleObj;
        if (!style){ return; }
        const styleValue = style.split(`;`).map(s => s.split(`:`)).find(s => s[0] === styleName)?.[1];
        if (!styleValue){ return; }
        if (styleValue === `none`){ return; }

        // fill:url(#linearGradient99999);
        // fill:url(#radialGradient99999);
        if (styleValue.startsWith(`url(`)){
            const ref = styleValue.match(/url\(([^)]+)\)/)?.[1];
            return applyColorShiftToDef(ref, colorChange);
        }

        const hexValue = getRgbHex(styleValue);
        if (!hexValue){ return;}

        const newHexValue = calculateShiftedColorHex(hexValue, colorChange);
        const newStyle = style.replace(hexValue, newHexValue);
        styleObj.style = newStyle as SvgElementStyle;

        // console.log(`applyColorShift - style`, { hexValue, style, newStyle });

    };

    svg.elements.forEach(rootNode => {
        if (rootNode.name === `sodipodi:namedview`){ return; }
        if (rootNode.name === `defs`){ return; }

        visitNodeWithTraitContext(rootNode, {}, (n, context) => {

            const colorShift = traitColorShifts.find(x => x.trait === context.trait);
            if (!colorShift?.colorChange){ return; }

            // Apply style colors (also prevent multiple changes)
            applyColorShift(n.attributes, `fill`, colorShift.colorChange);
            applyColorShift(n.attributes, `stroke`, colorShift.colorChange);

            return {};
        });
    });

    return {
        selectedTraits,
        selectedColors,
    };
};

