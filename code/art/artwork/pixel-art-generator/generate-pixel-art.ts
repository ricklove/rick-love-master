import { createRandomGenerator } from 'art/rando';
import type p5 from 'p5';
import { GameImage, scaleImage } from '../nft-adventure/utils';

export type Vector2 = { x: number, y: number };
export type Angle = {
    degrees?: number;
    radians?: number;
};

export const createPixelArt = (sMain: p5, options: {
    size: { width: number, height: number };
    timeMs: number;
}) => {

    const { size, timeMs } = options;
    const { random } = createRandomGenerator(timeMs + ``);

    const s = sMain.createGraphics(size.width, size.height, `p2d`);
    // s.translate(-size.width * 0.5, -size.height * 0.5, 0);

    // drawHead(s, {
    //     tilt: 90 - (timeMs / 100) % 180,
    //     pan: 0,
    //     position: { x: 10, y: 10 },
    //     random,
    // });

    const sImage = sMain.createImage(s.width, s.height);
    sImage.copy(s, 0, 0, s.width, s.height, 0, 0, s.width, s.height);
    sImage.loadPixels();

    drawHead_pixels(s, {
        tilt: Math.floor(60 - (timeMs / 100) % 120),
        pan: Math.floor((timeMs / (100 * 120 / 30)) % 90),
        center: { x: 10, y: 10 },
        size: { x: 5, y: 8 },
        random,
        sImage,
    });

    // // Remove alpha
    // for (let a = 3; a < sImage.pixels.length; a += 4){
    //     if (sImage.pixels[a] < 150){
    //         sImage.pixels[a] = 0;
    //     } else {
    //         sImage.pixels[a] = 255;
    //     }
    // }

    // // Jagger
    // for (let i = 0; i < sImage.pixels.length; i += 4){
    //     if (i % 4 === 3){ continue; }

    //     const index = i + Math.floor(3 * random());

    //     const STRENGTH = 15;
    //     sImage.pixels[index] = Math.min(255, Math.max(0, sImage.pixels[index] + STRENGTH - Math.floor(random() * 2 * STRENGTH)));
    // }

    const result = scaleImage(sMain, sImage, 8);

    console.log(`createPixelArt`, { image: result });

    const data: GameImage = {
        source: s,
        isLoaded: () => true,
        imageScales: [
            { scaleRatio: 8, image: result },
        ],
    };

    return data;
};


// export const drawHead = (s: p5, {
//     position,
//     tilt,
//     pan,
//     random,
// }: {
//     position: Vector2;
//     tilt: number;
//     pan: number;
//     random: () => number;
// }) => {
//     // Head

//     s.push();

//     // Move to position
//     s.translate(position.x, position.y);

//     // Bring to origin & rotate
//     s.rotate(tilt / 180 * Math.PI);
//     s.translate(-3, -5);


//     s.noStroke();
//     s.fill(s.color(`#ad7e46`));
//     s.rect(1, 2, 5, 8, 2, 2, 2, 2);

//     // Eye
//     // s.fill(s.color(`#cccccc`));
//     // s.rect(4, 4, 1, 1);
//     s.noFill();
//     s.stroke(s.color(`#cccccc`));
//     s.point(4, 4);


//     // Nose
//     // s.fill(s.color(`#ad7e46`));
//     // s.rect(6, 6, 1, 1);
//     s.noFill();
//     s.stroke(s.color(`#ad7e46`));
//     s.point(6, 6);

//     // Mouth
//     // s.fill(s.color(`#333333`));
//     // s.rect(5, 8, 1, 1);
//     s.noFill();
//     s.stroke(s.color(`#333333`));
//     s.point(5, 8);


//     s.pop();
// };


export const drawHead_pixels = (s: p5, {
    center,
    size,
    tilt,
    pan,
    random,
    sImage,
}: {
    center: Vector2;
    size: Vector2;
    tilt: number;
    pan: number;
    random: () => number;
    sImage: p5.Image;
}) => {

    console.log(`drawHead_pixels`, { center, size, tilt, pan });
    // Head

    // s.push();

    // // Move to position
    // s.translate(position.x, position.y);

    // // Bring to origin & rotate
    // s.rotate(tilt / 180 * Math.PI);
    // s.translate(-3, -5);

    const rotation = { radians: tilt / 180 * Math.PI };
    // const rotation: Angle = {};

    drawRectangle(sImage, {
        center,
        size,
        rotation,
        color: hexToRgb(`#ad7e46`),
        colorRange: 15,
        cornerRadius: 0,
        random,
    });

    // // Remove alpha
    // for (let a = 3; a < sImage.pixels.length; a += 4){
    //     if (sImage.pixels[a] < 150){
    //         sImage.pixels[a] = 0;
    //     } else {
    //         sImage.pixels[a] = 255;
    //     }
    // }

    // // Scatter color
    // for (let i = 0; i < sImage.pixels.length; i += 4){
    //     if (i % 4 === 3){ continue; }

    //     const index = i + Math.floor(3 * random());

    //     const STRENGTH = 15;
    //     sImage.pixels[index] = Math.min(255, Math.max(0, sImage.pixels[index] + STRENGTH - Math.floor(random() * 2 * STRENGTH)));
    // }

    // const xOffset = -Math.floor(pan / 30);
    const xOffset = -pan / 45;

    // Top Hair
    for (let i = -3; i <= 3; i += 0.5){
        for (let j = -5; j <= -3; j += 0.5){
            drawPixelInRect(sImage, {
                x: i,
                y: j,
            }, getColorVariant(hexToRgb(`#633813`), 20, random), { center, size, rotation });
        }
    }
    // Back Hair
    for (let i = -4; i <= -2 + xOffset * 0.5; i += 0.5){
        for (let j = -4; j <= 3; j += 0.5){
            drawPixelInRect(sImage, {
                x: i,
                y: j,
            }, getColorVariant(hexToRgb(`#633813`), 20, random), { center, size, rotation });
        }
    }
    // Beard Hair
    for (let i = -2; i <= 3 + xOffset * 0.5; i += 0.5){
        for (let j = 3; j <= 4; j += 0.5){
            drawPixelInRect(sImage, {
                x: i,
                y: j,
            }, getColorVariant(hexToRgb(`#633813`), 20, random), { center, size, rotation });
        }
    }


    // Moustache Hair
    for (let i = 1.25 + xOffset; i <= 2.75 + xOffset * 0.5; i += 0.5){
        for (let j = 1.5; j <= 3; j += 0.5){
            drawPixelInRect(sImage, {
                x: i,
                y: j,
            }, getColorVariant(hexToRgb(`#633813`), 20, random), { center, size, rotation });
        }
    }

    // Eye
    const has2Eyes = xOffset < -1.0;
    const xEye1 = 1 + xOffset;
    const xEye2 = 3.0 + xOffset * 0.75;
    drawPixelInRect(sImage, {
        x: xEye1,
        y: -1,
    }, hexToRgb(`#cccccc`), { center, size, rotation });

    // Eye 2
    if (has2Eyes){
        drawPixelInRect(sImage, {
            x: xEye2,
            y: -1,
        }, hexToRgb(`#cccccc`), { center, size, rotation });
    }

    // Nose
    const xCenter = has2Eyes ? (xEye1 + xEye2) / 2 : undefined;
    drawPixelInRect(sImage, {
        x: xCenter != null ? xCenter : 2.55,
        y: 0.25,
    }, getColorVariant(hexToRgb(`#ba8e56`), 5, random), { center, size, rotation });

    // Mouth
    // drawPixelInRect(sImage, {
    //     x: 2.00,
    //     y: 2.00,
    // }, getColorVariant(hexToRgb(`#333333`), 5, random), { center, size, rotation });
    drawPixelInRect(sImage, {
        x: xCenter != null ? xCenter : 2.25,
        y: 1.75,
    }, getColorVariant(hexToRgb(`#221111`), 5, random), { center, size, rotation });
};

const drawRectangle = (sImage: p5.Image, {
    center,
    size,
    rotation,
    color,
    colorRange,
    cornerRadius,
    random,
}: {
    center: Vector2;
    size: Vector2;
    rotation: Angle;
    color: RGBA;
    colorRange: number;
    cornerRadius: number;
    random: () => number;
}) => {


    for (let i = 0; i < size.x; i++){
        for (let j = 0; j < size.y; j++){

            // TODO: Skip corner pixels


            drawPixelInRect(sImage, {
                x: i - size.x * 0.5,
                y: j - size.y * 0.5,
            }, getColorVariant(color, colorRange, random), { center, size, rotation });
            drawPixelInRect(sImage, {
                x: i - size.x * 0.5 + 0.51,
                y: j - size.y * 0.5 + 0.51,
            }, getColorVariant(color, colorRange, random), { center, size, rotation });
        }
    }

};

const drawPixelInRect = (sImage: p5.Image, positionFromCenter: Vector2, color: RGBA, {
    center,
    rotation,
}: {
    center: Vector2;
    size: Vector2;
    rotation: Angle;
}) => {
    const pos = getPixelPositionInRect(positionFromCenter, { center, rotation });

    if (pos.x < 0
        || pos.y < 0
        || pos.x >= sImage.width
        || pos.y >= sImage.height
    ){ return; }

    const rIndex = (pos.y * sImage.width + pos.x) * 4;
    sImage.pixels[rIndex + 0] = color.r;
    sImage.pixels[rIndex + 1] = color.g;
    sImage.pixels[rIndex + 2] = color.b;
    sImage.pixels[rIndex + 3] = color.a ?? 255;
};

const getPixelPositionInRect = (positionFromCenter: Vector2, {
    center,
    rotation,
}: {
    center: Vector2;
    rotation: Angle;
}) => {

    const rad = rotation.radians ?? ((rotation.degrees ?? 0) / 180 * Math.PI);

    const xRel = positionFromCenter.x;
    const yRel = positionFromCenter.y;

    const xRot = xRel * Math.cos(rad) - yRel * Math.sin(rad);
    const yRot = xRel * Math.sin(rad) + yRel * Math.cos(rad);
    const xFloat = xRot + center.x;
    const yFloat = yRot + center.y;
    const x = Math.round(xFloat);
    const y = Math.round(yFloat);

    return { x, y };
};

const getColorVariant = (color: RGBA, variance: number, random: () => number) => {

    const rgb = [`r`, `g`, `b`][Math.floor(3 * random())];
    return {
        r: (rgb === `r` ? Math.min(255, Math.max(0, color.r + variance - Math.floor(random() * 2 * variance))) : color.r),
        g: (rgb === `g` ? Math.min(255, Math.max(0, color.g + variance - Math.floor(random() * 2 * variance))) : color.g),
        b: (rgb === `b` ? Math.min(255, Math.max(0, color.b + variance - Math.floor(random() * 2 * variance))) : color.b),
        a: color.a,
    };
};


type RGB = { r: number, g: number, b: number };
type RGBA = RGB & { a?: number };
const hexToRgb = (hex: string): RGB => {
    hex = hex.replace(`#`, ``);

    const bigint = parseInt(hex, 16);

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
};
