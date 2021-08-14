import type p5 from 'p5';

export type GameImage = {
    image: p5.Image;
    // isLoaded: () => boolean;
    imageScales: {
        scaleRatio: number;
        image: p5.Image;
    }[];
};
export const loadAndScaleImage = (s: p5, base64: string,
    targetSizes: { width: number, height: number }[],
): GameImage => {

    //let isLoaded = false;
    const image = s.loadImage(base64, () => {
        //  isLoaded = true;

        image.loadPixels();

        const scaleRatios = targetSizes.map(t =>
            Math.floor(Math.min(t.width / image.width, t.height / image.height)));
        for (const scaleRatio of scaleRatios){
            scaleImage(s, data, scaleRatio);
        }
    });

    const data: GameImage = {
        image,
        // isLoaded: () => isLoaded,
        imageScales: [],
    };

    return data;
};

const scaleImage = (s: p5, image: GameImage, scaleRatio: number) => {
    // Draw each pixel

    const img = image.image;
    const width = img.width;
    const height = img.height;

    const pixels = img.pixels;

    const dest = s.createImage(width * scaleRatio, height * scaleRatio);

    dest.loadPixels();
    const destPixels = dest.pixels;

    for (let i = 0; i < width; i++){
        for (let j = 0; j < height; j++){
            const sourceIndex = 4 * (j * width + i);

            for (let i2 = 0; i2 < scaleRatio; i2++){
                for (let j2 = 0; j2 < scaleRatio; j2++){
                    const xp = i * scaleRatio + i2;
                    const yp = j * scaleRatio + j2;
                    const destIndex = 4 * (yp * width * scaleRatio + xp);

                    destPixels[destIndex + 0] = pixels[sourceIndex + 0];
                    destPixels[destIndex + 1] = pixels[sourceIndex + 1];
                    destPixels[destIndex + 2] = pixels[sourceIndex + 2];
                    destPixels[destIndex + 3] = pixels[sourceIndex + 3];
                }
            }
        }
    }

    dest.updatePixels();
    image.imageScales.push({ scaleRatio, image: dest });
};
