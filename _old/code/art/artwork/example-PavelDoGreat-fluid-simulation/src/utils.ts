/* eslint-disable no-bitwise */
export function isMobile() {
    return /mobi|android/i.test(navigator.userAgent);
}
export function clamp01(input: number) {
    return Math.min(Math.max(input, 0), 1);
}

export function correctDeltaX(delta: number, canvas: { width: number, height: number }) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 1) delta *= aspectRatio;
    return delta;
}

export function correctDeltaY(delta: number, canvas: { width: number, height: number }) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) delta /= aspectRatio;
    return delta;
}

export function generateColor() {
    const c = HSVtoRGB(Math.random(), 1, 1);
    c.r *= 0.15;
    c.g *= 0.15;
    c.b *= 0.15;
    return c;
}

export function HSVtoRGB(h: number, s: number, v: number) {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: return { r: v, g: t, b: p };
        case 1: return { r: q, g: v, b: p };
        case 2: return { r: p, g: v, b: t };
        case 3: return { r: p, g: q, b: v };
        case 4: return { r: t, g: p, b: v };
        case 5: return { r: v, g: p, b: q };
        default: return { r: v, g: p, b: q };
    }
}

export function normalizeColor(input: { r: number, g: number, b: number }) {
    const output = {
        r: input.r / 255,
        g: input.g / 255,
        b: input.b / 255,
    };
    return output;
}

export function wrap(value: number, min: number, max: number) {
    const range = max - min;
    if (range === 0) return min;
    return (value - min) % range + min;
}


export function getTextureScale(texture: { width: number, height: number }, width: number, height: number) {
    return {
        x: width / texture.width,
        y: height / texture.height,
    };
}

export function scaleByPixelRatio(input: number) {
    const pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
}

export function hashCode(s: string) {
    if (!s) return 0;

    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

export const randomIntRange = (minInclusive: number, maxInclusive: number) => {
    return (minInclusive + (maxInclusive - minInclusive + 1) * Math.random()) | 0;
};

export type ColorRgb = { r: number, g: number, b: number };
