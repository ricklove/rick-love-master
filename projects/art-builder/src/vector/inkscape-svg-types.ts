
export type SvgDoc = {
    name: 'definitions';
    elements: [{
        name: 'svg';
        elements: [{
            name: 'sodipodi:namedview';
        }, {
            name: 'defs';
            elements: SvgDef[];
        }, ...SvgElement[]];
    }];
};

// type HexChar = '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'A'|'B'|'C'|'D'|'E'|'F'|'a'|'c'|'b'|'d'|'e'|'f';
// type HexColorString = `#${HexChar}${HexChar}${HexChar}${HexChar}${HexChar}${HexChar}`;
export type RgbHex = string & { __type: '#000000' };
// type StopStyleString = `stop-color:#${RgbHex};stop-opacity:${number}`;
type StopStyleString = string & { __type: 'stop-color:#ffffff;stop-opacity:1' };
type LinearGradientRef = string & { __type: '#linearGradient99999' };
export type SvgDef = {
    name: 'linearGradient' | 'radialGradient' | '';
    attributes: {
        'id': string;
        'xlink:href'?: LinearGradientRef;
    };
    elements?: {
        name: 'stop';
        attributes: {
            style: StopStyleString;
        };
    }[];
};

export type SvgElementStyle = string & { __type: 'fill:url(#linearGradient99999);fill-opacity:1;stroke:none;stroke-width:1;stroke-linejoin:round';
    __solid: `fill:#ff0000;`;
    __solid_stroke: `stroke:#ff0000;`;
    __linear: `fill:url(#linearGradient99999);`;
    __radial: `fill:url(#radialGradient99999-9);`;
};
export type SvgElement = {
    name?: 'g'|'path'|'image';
    attributes: {
        'inkscape:label'?: string;
        style?: SvgElementStyle;
    };
    elements?: SvgElement[];
};
