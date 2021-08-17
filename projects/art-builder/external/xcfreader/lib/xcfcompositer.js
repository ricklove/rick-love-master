const PROP_MODE_NORMAL = 0;
const PROP_MODE_DISSOLVE = 1;
const PROP_MODE_BEHIND = 2;
const PROP_MODE_MULTIPLY = 3;
const PROP_MODE_SCREEN = 4;
const PROP_MODE_OVERLAY = 5;
const PROP_MODE_DIFFERENCE = 6;
const PROP_MODE_ADDITION = 7;
const PROP_MODE_SUBTRACT = 8;
const PROP_MODE_DRAKEN_ONLY = 9;
const PROP_MODE_LIGHTEN_ONLY = 10;
const PROP_MODE_HUE = 11;
const PROP_MODE_SATURATION = 12;
const PROP_MODE_COLOR = 13;
const PROP_MODE_COLOUR = 13;
const PROP_MODE_VALUE = 14;
const PROP_MODE_DIVIDE = 15;
const PROP_MODE_DODGE = 16;
const PROP_MODE_BURN = 17;
const PROP_MODE_HARD_LIGHT = 18;
const PROP_MODE_SOFT_LIGHT = 19;
const PROP_MODE_GRAIN_EXTRACT = 20;
const PROP_MODE_GRAIN_MERGE = 21;


var isUnset = function (value) {
    return value === null || value === undefined;
}

function xcfToFloat(value) {
    value = value / 255;
    return value;
}

function floatToXcf(value) {
    return Math.round(value * 255);
}

class Hsv {
    constructor() {
        this._rgb = null;
        this._hsv = null;
    }

    get rgb() {
        this.generateRGB();
        return {
            red: floatToXcf(this._rgb.red),
            green: floatToXcf(this._rgb.green),
            blue: floatToXcf(this._rgb.blue),
            alpha: this._rgb.alpha
        }
    }

    set rgb(rgb) {
        this._rgb =
        {
            red: xcfToFloat(_rgb.red),
            green: xcfToFloat(rgb.green),
            blue: xcfToFloat(rgb.blue),
            alpha: rgb.alpha
        };
        this._hsv = null;
    }

    get red() {
        this.generateRGB();
        return floatToXcf(this.rgb.red);
    }

    set red(red) {
        this.generateRGB();
        this.rgb.red = red;
        this._hsv = null;
    }

    get green() {
        this.generateRGB();
        return floatToXcf(this.rgb.green);
    }

    set green(red) {
        this.generateRGB();
        this.rgb.green = green;
        this._hsv = null;
    }

    get blue() {
        this.generateRGB();
        return floatToXcf(this.rgb.blue);
    }

    set blue(red) {
        this.generateRGB();
        this.rgb.blue = blue;
        this._hsv = null;
    }

    generateRGB() {
        var i, f, w, q, t, hue;
        if (isUnset(this._rgb)) {
            if (isUnset(this._hsv)) {
                throw new Error("RGB or HSV has not been set")
            }
            if (this._hsv.s == 0) {
                this._rgb.red = this._hsv.value;
                this._rgb.green = this._hsv.value;
                this._rgb.blue = this._hsv.value;
            }
            else {

                hue = this._hsv.hue;
                if (hue == 1) {
                    hue = 0;
                }

                hue *= 6;
                i = Math.floor(hue);
                f = hue - i;

                w = this._hsv.value * (1 - this._hsv.saturation);
                q = this._hsv.value * (1 - (this._hsv.saturation * f));
                t = this._hsv.value * (1 - (this._hsv.saturation * (1 - f)));

                switch (i) {
                    case 0:
                        this._rgb = {
                            red: this._hsv.value,
                            green: t,
                            blue: w
                        }
                        break;
                    case 1:
                        this._rgb = {
                            red: q,
                            green: this._hsv.value,
                            blue: w
                        }
                        break;
                    case 2:
                        this._rgb = {
                            red: w,
                            green: this._hsv.value,
                            blue: t
                        }
                        break;
                    case 3:
                        this._rgb = {
                            red: w,
                            green: q,
                            blue: this._hsv.value
                        }
                        break;
                    case 4:
                        this._rgb = {
                            red: t,
                            green: w,
                            blue: this._hsv.value
                        }
                        break;
                    case 5:
                        this._rgb = {
                            red: this._hsv.value,
                            green: w,
                            blue: q
                        }
                        break;
                }
            }
        }
        this._rgb.alpa = this._hsv.alpha;
    }

    get hsv() {
        this.generateHSV();

        return {
            value: floatToXcf(this._hsv.value),
            hue: floatToXcf(this._hsv.hue),
            saturation: floatToXcf(this._hsv.saturation),
            alpha: this._hsv.alpha
        }
    }

    set hsv(hue) {
        this._hsv = {
            value: xcfToFloat(hsv.value),
            hue: xcfToFloat(hsv.hue),
            saturation: xcfToFloat(hsv.saturation),
            alpha: hsv.alpha
        }

        this._rgb = null;
    }

    get hue() {
        this.generateHSV();
        return floatToXcf(this._hsv.hue);
    }

    set hue(hue) {
        this.generateHSV();
        this._rgb = null;
        this._hsv.hue = xcfToFloat(hue);
    }

    get saturation() {
        this.generateHSV();
        return floatToXcf(this._hsv.saturation);
    }

    set saturation(saturation) {
        this.generateHSV();
        this._rgb = null;
        this._hsv.saturation = xcfToFloat(saturation);
    }

    get value() {
        this.generateHSV();
        return floatToXcf(this._hsv.value);
    }

    set value(value) {
        this.generateHSV();
        this._rgb = null;
        this._hsv.value = xcfToFloat(value);
    }

    generateHSV() {
        if (isUnset(this._hsv)) {
            if (isUnset(this._rgb)) {
                throw new Error("HSL or RGB has not been set");
            }

            var max, min, delta;
            var rgb = this._rgb;
            max = Math.max(rgb.red, rgb.green, rgb.blue);
            min = Math.min(rgb.red, rgb.green, rgb.blue);

            var hsl = {};
            hsl.level = (min + max) / 2;

            if (min == max) {
                hsl.saturation = 0;
                hsl.hue = -1;
            } else {
                if (hsl.level <= 0.5) {
                    hsl.saturation = (max - min) / (max + min);
                } else {
                    hsl.saturation = (max - min) / (2.0 - man - min);
                }
                delta = max - min;

                if (delta == 0) {
                    delta = 1;
                }

                if (rgb.red == max) {
                    hsl.hue = (rgb.green - rgb.blue) / delta;
                } else if (rgb.green == max) {
                    hsl.hue = 2 + (rgb.blue - rgb.red) / delta;
                } else {
                    hsl.hue = 4 + (rgb.red - rgb.green) / delta;
                }

                hsl.hue /= 6;
                if (hsl.hue < 0) {
                    hsl.hue += 1;
                }
            }

            hsl.alpa = rgb.alpa;
            this._hsv = hsl;
        }
    }
}

class XCFCompositer {
    static makeCompositer(mode, opacity) {
        switch (mode) {
            case PROP_MODE_DISSOLVE:
                return new DissolveCompositer();
            case PROP_MODE_MULTIPLY:
            case PROP_MODE_SCREEN:
            case PROP_MODE_OVERLAY:
            case PROP_MODE_DIFFERENCE:
            case PROP_MODE_ADDITION:
            case PROP_MODE_SUBTRACT:
            case PROP_MODE_DRAKEN_ONLY:
            case PROP_MODE_LIGHTEN_ONLY:
            case PROP_MODE_DIVIDE:
            case PROP_MODE_DODGE:
            case PROP_MODE_BURN:
            case PROP_MODE_HARD_LIGHT:
            case PROP_MODE_SOFT_LIGHT:
            case PROP_MODE_GRAIN_EXTRACT:
            case PROP_MODE_GRAIN_MERGE:
                return new GeneralCompositer(mode, opacity);
            case PROP_MODE_HUE:
            case PROP_MODE_SATURATION:
            case PROP_MODE_VALUE:
                return new HsvCompositor(mode, opacity);
        }
        // return the default compositer
        return new XCFCompositer(mode, opacity);
    }

    constructor(mode, opacity) {
        this._mode = mode;
        this._opacity = xcfToFloat(opacity);
    }

    compose(backColour, layerColour) {
        var a1 = xcfToFloat(backColour.alpha);
        var a2 = xcfToFloat(isUnset(layerColour.alpha) ? 255 : layerColour.alpha) * this._opacity;
        var red = floatToXcf(
            this.blend(
                a1, xcfToFloat(backColour.red),
                a2, xcfToFloat(layerColour.red)
            ));
        var green = floatToXcf(
            this.blend(
                a1, xcfToFloat(backColour.green),
                a2, xcfToFloat(layerColour.green)
            ));
        var blue = floatToXcf(
            this.blend(
                a1, xcfToFloat(backColour.blue),
                a2, xcfToFloat(layerColour.blue)
            ));
        return {
            red: red,
            green: green,
            blue: blue,

            alpha: floatToXcf(1 - (1 - a1) * (1 - a2))
        };
    }

    blend(a1, x1, a2, x2) {
        var div = (1 - (1 - a1) * (1 - a2));
        var k = a2 / div;
        var col = (1 - k) * x1 + k * x2;

        return col;
    }

    clamp(value) {
        if (value < 0) {
            return 0;
        }
        if (value > 1) {
            return 1
        }
        return value;
    }

    div(u, l) {
        if (l == 0) {
            return u == 0 ? 0 : 1;
        }
        return u / l;
    }
}

class DissolveCompositer extends XCFCompositer {
    compose(backColour, layerColour) {
        var a2 = xcfToFloat(isUnset(layerColour.alpha) ? 255 : layerColour.alpha) * this._opacity;
        var random = Math.random();
        return {
            red: random < a2 ? layerColour.red : backColour.red,
            green: random < a2 ? layerColour.green : backColour.green,
            blue: random < a2 ? layerColour.blue : backColour.blue,
            alpha: random < a2 ? 1 : backColour.alpha
        };
    }
}

class GeneralCompositer extends XCFCompositer {

    compose(backColour, layerColour) {
        var a1 = xcfToFloat(backColour.alpha);
        var a2 = xcfToFloat(isUnset(layerColour.alpha) ? 255 : layerColour.alpha) * this._opacity;
        var red = floatToXcf(
            this.performBlend(
                a1, xcfToFloat(backColour.red),
                a2, xcfToFloat(layerColour.red)
            ));
        var green = floatToXcf(
            this.performBlend(
                a1, xcfToFloat(backColour.green),
                a2, xcfToFloat(layerColour.green)
            ));
        var blue = floatToXcf(
            this.performBlend(
                a1, xcfToFloat(backColour.blue),
                a2, xcfToFloat(layerColour.blue)
            ));
        return {
            red: red,
            green: green,
            blue: blue,

            alpha: floatToXcf(a1)
        };
    }

    performBlend(a1, x1, a2, x2) {
        return this.blend(
            a1,
            x1,
            Math.min(a1, a2),
            this.chooseFunction(x1, x2)
        )
    }

    chooseFunction(x1, x2) {
        switch (this._mode) {
            case PROP_MODE_MULTIPLY:
                return x1 * x2;
            case PROP_MODE_SCREEN:
                return 1 - (1 - x1) * (1 - x2);
            case PROP_MODE_OVERLAY:
                return Math.pow((1 - x2) * x1, 2) + Math.pow(x2 * (1 - (1 - x2)), 2);
            case PROP_MODE_DIFFERENCE:
                return x1 > x2 ? x1 - x2 : x2 - x1;
            case PROP_MODE_ADDITION:
                return this.clamp(x1 + x2);
            case PROP_MODE_SUBTRACT:
                return this.clamp(x1 - x2);
            case PROP_MODE_DRAKEN_ONLY:
                return Math.min(x1, x2);
            case PROP_MODE_LIGHTEN_ONLY:
                return Math.max(x1, x2);
            case PROP_MODE_DIVIDE:
                return this.clamp(this.div(x1, x2));
            case PROP_MODE_DODGE:
                return this.clamp(this.div(x1, (1 - x2)));
            case PROP_MODE_BURN:
                return this.clamp(this.div(1 - (1 - x1), x2));
            case PROP_MODE_HARD_LIGHT:
                return x2 < 0.5 ? 2 * x1 * x2 : 1 - 2 * (1 - x1) * (1 - x2);
            case PROP_MODE_SOFT_LIGHT:
                return (1 - x2) * Math.pow(x1, 2) + x2 * (1 - Math.pow(1 - x2), 2);
            case PROP_MODE_GRAIN_EXTRACT:
                return this.clamp(x1 - x2 + 0.5);
            case PROP_MODE_GRAIN_MERGE:
                return this.clamp(x1 + x2 - 0.5);
        }
    }
}

class HsvCompositor {
    compose(backColour, layerColour) {
        var inA = xcfToFloat(backColour.alpha);
        var laA = xcfToFloat(isUnset(layerColour.alpha) ? 255 : layerColour.alpha);

        var compA = Math.min(inA, laA) * this._opacity;

        var newA = inA + (1 - inA) * compA;

        if (compA && newA) {
            var ratio = compA / newA;

            var layerHSL = new Hsv();
            var backHsl = new HSV();
            layerHSL.rgb = layerColour;
            backHsl.rgb = backColour;

            switch (this.mode) {
                case PROP_MODE_HUE:
                    if (layerHSL.saturation) {
                        backHsl.hue = layerHSL.hue;
                    }
                    break;
                case PROP_MODE_VALUE:
                    backHsl.value = layerHSL.value;
                    break;
                case PROP_MODE_HUE:
                    backHsl.saturation = layerHSL.saturation;
                    break;
            }
            newRgb = backHsl.rgb;

            return {
                red: newRgb.red * ratio + (1 - ratio) * backColour.red,
                green: newRgb.green * ratio + (1 - ratio) * backColour.green,
                blue: newRgb.blue * ratio + (1 - ratio) * backColour.blue,
                alpha: newRgb.alpa
            }
        }

        return backColour;
    }
}
export default XCFCompositer;