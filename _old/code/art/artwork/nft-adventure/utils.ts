import type p5 from 'p5';

export type GameImage = {
    source?: p5.Image | p5.Graphics;
    isLoaded: () => boolean;
    imageScales: {
        scaleRatio: number;
        image: p5.Image;
    }[];
};
export const loadAndScaleImage = (s: p5, base64: string,
    targetSizes: { width: number, height: number }[],
): GameImage => {

    let isLoaded = false;
    const source = s.loadImage(base64, () => {
        isLoaded = true;

        source.loadPixels();

        const scaleRatios = targetSizes.map(t =>
            Math.floor(Math.min(t.width / source.width, t.height / source.height)));
        for (const scaleRatio of scaleRatios){
            const dest = scaleImage(s, source, scaleRatio);
            data.imageScales.push({ scaleRatio, image: dest });
        }
    });

    const data: GameImage = {
        source: source,
        isLoaded: () => isLoaded,
        imageScales: [],
    };

    return data;
};

export const scaleImage = (s: p5, source: p5.Image | p5.Graphics, scaleRatio: number) => {
    // Draw each pixel

    const width = source.width;
    const height = source.height;

    const pixels = source.pixels;

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
    return dest;
};
