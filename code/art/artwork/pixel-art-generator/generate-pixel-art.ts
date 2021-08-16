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

    // Back Arm
    drawRectangle(sImage, {
        center: { x: 12, y: 15 },
        size: { x: 2, y: 10 },
        rotation: { degrees: 60 },
        color: hexToRgb(`#a77f51`),
        colorRange: 15,
        cornerRadius: 1,
        random,
    });

    // Body
    drawRectangle(sImage, {
        center: { x: 0, y: 18 },
        size: { x: 7, y: 20 },
        rotation: { degrees: -60 },
        color: hexToRgb(`#6b2d0a`),
        colorRange: 15,
        cornerRadius: 1,
        random,
    });

    // Arm
    drawRectangle(sImage, {
        center: { x: 9, y: 18 },
        size: { x: 2, y: 10 },
        rotation: { degrees: 60 },
        color: hexToRgb(`#a77f51`),
        colorRange: 15,
        cornerRadius: 1,
        random,
    });


    // Head
    drawHead_pixels(s, {
        tilt: Math.floor(60 - (timeMs / 100) % 120),
        pan: Math.floor((timeMs / (100 * 120 / 30)) % 90),
        center: { x: 10, y: 10 },
        size: { x: 5, y: 6 },
        random,
        sImage,
    });

    drawHead_pixels(s, {
        tilt: Math.floor(60 - (timeMs / 100) % 120),
        pan: Math.floor((timeMs / (100 * 120 / 30)) % 90),
        center: { x: 24, y: 8 },
        size: { x: 6, y: 8 },
        // size: { x: 3, y: 4 },
        random,
        sImage,
    });

    drawHead_pixels(s, {
        tilt: Math.floor(60 - (timeMs / 100) % 120),
        pan: Math.floor((timeMs / (100 * 120 / 30)) % 90),
        center: { x: 24, y: 24 },
        size: { x: 8, y: 10 },
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

    // Options

    // Normal
    const hairColor: RGBA = hexToRgb(`#633813`);
    const topHairStyle: 'none' | 'normal' = `none`;
    const backHairLength: 'none' | 'short' |'medium' |'long' = `medium`;
    const beardColor: RGBA| undefined = hexToRgb(`#633813`);
    const moustacheColor: RGBA | undefined = hexToRgb(`#633813`);
    const skinColor: RGBA = hexToRgb(`#ad7e46`);
    const noseColor: RGBA = hexToRgb(`#faae86`);
    const eyeColor: RGBA = hexToRgb(`#cccccc`);
    const mouthColor: RGBA = hexToRgb(`#221111`);


    // // Bald Red Beard
    // const hairColor: RGBA = hexToRgb(`#633813`);
    // const topHairStyle: 'none' | 'normal' = `none`; //`medium` ;
    // const backHairLength: 'none' | 'short' |'medium' |'long' = `none`; //`medium` ;
    // const beardColor: RGBA| undefined = hexToRgb(`#933813`);
    // const moustacheColor: RGBA | undefined = undefined; //hexToRgb(`#633813`);
    // const skinColor: RGBA = hexToRgb(`#ad7e46`);
    // const noseColor: RGBA = hexToRgb(`#ba8e56`);
    // const eyeColor: RGBA = hexToRgb(`#cccccc`);
    // const mouthColor: RGBA = hexToRgb(`#221111`);

    // // Zombie with purple beard
    // const hairColor: RGBA = hexToRgb(`#639813`);
    // const topHairStyle: 'none' | 'normal' = `normal`;
    // const backHairLength: 'none' | 'short' |'medium' |'long' = `long`;
    // const beardColor: RGBA| undefined = hexToRgb(`#933883`);
    // const moustacheColor: RGBA | undefined = hexToRgb(`#933813`);
    // const skinColor: RGBA = hexToRgb(`#354e46`);
    // const noseColor: RGBA = hexToRgb(`#356e46`);
    // const eyeColor: RGBA = hexToRgb(`#ff7777`);
    // const mouthColor: RGBA = hexToRgb(`#221111`);


    const tiltQuantized = Math.round(tilt / 15) * 15;
    const panQuantized = Math.round(pan / 15) * 15;

    const rotation = { radians: tiltQuantized / 180 * Math.PI };
    const xOffset = -panQuantized / 45;
    const scale = size.x / 6;

    drawRectangle(sImage, {
        center,
        size,
        rotation,
        color: skinColor,
        colorRange: 15,
        cornerRadius: 1,
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


    // Top Hair
    if (topHairStyle !== `none`){
        for (let i = -3; i <= 3; i += 0.5){
            for (let j = -5; j <= -3; j += 0.5){
                drawPixelInRect(sImage, {
                    x: i,
                    y: j,
                }, getColorVariant(hairColor, 20, random), { center, scale, rotation, random });
            }
        }
    }

    // else {
    //     // Draw a forehead if no top hair
    //     for (let i = -2; i <= 2; i += 0.5){
    //         for (let j = -4; j <= -3; j += 0.5){
    //             drawPixelInRect(sImage, {
    //                 x: i,
    //                 y: j,
    //             }, getColorVariant(skinColor, 20, random), { center, scale, rotation });
    //         }
    //     }
    // }
    // Back Hair
    if (backHairLength !== `none`){
        for (let i = -4; i <= -2 + xOffset * 0.5; i += 0.5){
            for (let j = -4; j <= (backHairLength === `short` ? 1 : backHairLength === `long` ? 5 : 3); j += 0.5){
                drawPixelInRect(sImage, {
                    x: i,
                    y: j,
                }, getColorVariant(hairColor, 20, random), { center, scale, rotation, random });
            }
        }
    }
    // Beard Hair
    if (beardColor){
        for (let i = -2; i <= 4 + xOffset * 0.5; i += 0.5){
            for (let j = 3; j <= 5; j += 0.5){
                drawPixelInRect(sImage, {
                    x: i,
                    y: j,
                }, getColorVariant(beardColor, 20, random), { center, scale, rotation, random });
            }
        }
    }


    // Moustache Hair
    if (moustacheColor) {
        for (let i = 1.25 + xOffset; i <= 2.75 + xOffset * 0.5; i += 0.5){
            for (let j = 1.5; j <= 3; j += 0.5){
                drawPixelInRect(sImage, {
                    x: i,
                    y: j,
                }, getColorVariant(moustacheColor, 20, random), { center, scale, rotation, random });
            }
        }
    }

    drawFace(sImage, {
        eyeColor, noseColor, mouthColor, eyeBrowColor: hairColor,
        center, scale, rotation, random,
        pan,
    });


};

const drawFace = (sImage: p5.Image, {
    center,
    pan,
    rotation,
    random,
    eyeColor,
    noseColor,
    mouthColor,
    eyeBrowColor,
    scale,
}: {
    center: Vector2;
    pan: number;
    rotation: Angle;
    random: () => number;
    eyeColor: RGBA;
    noseColor: RGBA;
    mouthColor: RGBA;
    eyeBrowColor: RGBA;
    scale: number;
}) => {
    const panQuantized = Math.round(pan / 15) * 15;
    const xOffset = -panQuantized / 45;

    const has2Eyes = xOffset < -0.6;
    const xEye1 = 1.0 + xOffset;
    const xEye2 = 4.0 + xOffset;
    const yEye = -1.0;
    const xCenter = (xEye1 + xEye2) / 2;

    // Nose
    drawPixelInRect(sImage, {
        x: xCenter + 0.5,
        y: 1.0,
    }, getColorVariant(noseColor, 5, random), { center, scale, rotation, random });


    // Mouth
    // drawPixelInRect(sImage, {
    //     x: 2.00,
    //     y: 2.00,
    // }, getColorVariant(hexToRgb(`#333333`), 5, random), { center, size, rotation });
    drawPixelInRect(sImage, {
        x: xCenter - 0.25,
        y: 3.0,
    }, getColorVariant(mouthColor, 5, random), { center, scale, rotation, random });


    // Eye brow
    // console.log(`scale`, { scale });
    // drawPixelInRect(sImage, {
    //     x: xEye1 - 0.75 / scale,
    //     y: yEye - 0.5 / scale,
    // }, eyeBrowColor, { center, scale, rotation, random });
    // drawPixelInRect(sImage, {
    //     x: xEye1 - 0.25 / scale,
    //     y: yEye - 0.75 / scale,
    // }, eyeBrowColor, { center, scale, rotation, random });
    // drawPixelInRect(sImage, {
    //     x: xEye1 + 0.25 / scale,
    //     y: yEye - 0.75 / scale,
    // }, eyeBrowColor, { center, scale, rotation, random });

    const drawEyeBrow = (actualEyePos: Vector2) => {
        const rDeg = (rotation.degrees ?? ((rotation.radians ?? 0) / Math.PI * 180));
        const dir = rDeg < -30 ? `down`
            : rDeg > 30 ? `up`
                : `normal`;

        if (dir === `down`){
            drawPixel(sImage, {
                position: {
                    x: actualEyePos.x + 1,
                    y: actualEyePos.y,
                },
                color: eyeBrowColor,
                lightRatio: 1,
                random,
            });
        }
        drawPixel(sImage, {
            position: {
                x: actualEyePos.x,
                y: actualEyePos.y - 1,
            },
            color: eyeBrowColor,
            lightRatio: 1,
            random,
        });
        if (dir === `up`){
            drawPixel(sImage, {
                position: {
                    x: actualEyePos.x - 1,
                    y: actualEyePos.y,
                },
                color: eyeBrowColor,
                lightRatio: 1,
                random,
            });
        }
        if (dir === `normal`){
            drawPixel(sImage, {
                position: {
                    x: actualEyePos.x - 1,
                    y: actualEyePos.y - 1,
                },
                color: eyeBrowColor,
                lightRatio: 1,
                random,
            });
        }
    };

    // Eye
    const actualEyePos1 = drawPixelInRect(sImage, {
        x: xEye1,
        y: yEye,
    }, eyeColor, { center, scale, rotation, random });
    if (actualEyePos1){
        drawEyeBrow(actualEyePos1.actualPosition);
    }

    if (has2Eyes){
        const actualEyePos2 = drawPixelInRect(sImage, {
            x: xEye2,
            y: yEye,
        }, eyeColor, { center, scale, rotation, random });
        if (actualEyePos2){
            drawEyeBrow(actualEyePos2.actualPosition);
        }
    }

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


    for (let i = 0; i < size.x; i += 0.1){
        for (let j = 0; j < size.y; j += 0.1){

            // TODO: Skip corner pixels
            if (i + j <= cornerRadius){ continue;}
            if (i + (size.y - j) <= cornerRadius){ continue;}
            if ((size.x - i) + j <= cornerRadius){ continue;}
            if ((size.x - i) + (size.y - j) <= cornerRadius){ continue;}

            const scale = 1;
            drawPixelInRect(sImage, {
                x: i - size.x * 0.5,
                y: j - size.y * 0.5,
            }, getColorVariant(color, colorRange, random), { center, scale, rotation, random });
        }
    }

};

const drawPixelInRect = (sImage: p5.Image, positionFromCenter: Vector2, color: RGBA, {
    center,
    scale,
    rotation,
    random,
}: {
    center: Vector2;
    scale: number;
    rotation: Angle;
    random: () => number;
}) => {
    const pos = getPixelPositionInRect(positionFromCenter, { center, scale, rotation });

    if (pos.x < 0
        || pos.y < 0
        || pos.x >= sImage.width
        || pos.y >= sImage.height
    ){ return; }

    const shadowRatioRaw =
        (1 - 0.5 * Math.max(0, Math.min(1, (pos.y - (center.y - 1)) / 5) + (pos.x - (center.x - 1)) / 10));

    drawPixel(sImage, { position: pos, color, lightRatio: shadowRatioRaw, random });

    return { actualPosition: pos };
};

const drawPixel = (sImage: p5.Image, {
    position,
    color,
    lightRatio: lightRatioRaw,
    random,
}: {
    position: Vector2;
    color: RGBA;
    lightRatio: number;
    random: () => number;
}) => {

    if (position.x < 0
        || position.y < 0
        || position.x >= sImage.width
        || position.y >= sImage.height
    ){ return; }

    const lightRatio = 1 - (1 - lightRatioRaw) * (0.9 + 0.1 * random());

    const rIndex = (position.y * sImage.width + position.x) * 4;
    sImage.pixels[rIndex + 0] = color.r * lightRatio;
    sImage.pixels[rIndex + 1] = color.g * lightRatio;
    sImage.pixels[rIndex + 2] = color.b * lightRatio;
    sImage.pixels[rIndex + 3] = color.a ?? 255;
};

const getPixelPositionInRect = (positionFromCenter: Vector2, {
    center,
    scale,
    rotation,
}: {
    center: Vector2;
    scale: number;
    rotation: Angle;
}) => {

    const radRaw = rotation.radians ?? ((rotation.degrees ?? 0) / 180 * Math.PI);
    // Inverse rotation for flipped y
    const rad = -radRaw;

    const xRel = positionFromCenter.x * scale;
    const yRel = positionFromCenter.y * scale;

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
