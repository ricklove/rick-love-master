import { XCFParser, XCFImage } from './external/xcfreader/gimpparser';

type XCFReaderResult = {
    width: number;
    height: number;
    layers: {
        width: number;
        height: number;
    }[];
};
export const run = async (filePath: string) => {
    console.log(`START`);

    XCFParser.parseFile(filePath, (err: unknown, xcfReader: XCFReaderResult) => {
        if (err) throw err;

        // Get width and height
        console.log(xcfReader.width);
        console.log(xcfReader.height);

        // Get the number of layers
        console.log(xcfReader.layers.length);

        // Get the width and height of the top layer
        console.log(xcfReader.layers[0].width);
        console.log(xcfReader.layers[0].height);

        // // Flattern an image
        // const xcf = new XCFImage(); // should call your Image class.
        // xcf.fill({ red: 0, green: 0, blue: 0, alpha: 255 }); // You need to set up the image with the default background for the image.

        // // Layer[0] is the top most layer whilst layer[layer.length-1] is the lowest level
        // // So we need to apply from the end of the layer array.
        // const numLayers = xcfReader.layers.length;
        // for (let loop = numLayers - 1; loop >= 0; loop -= 1){
        //     xcfReader.layers[loop].makeImage(xcf, true); // Put the current layer on to the image.
        // }

        // xcf.save(`myImage.png`);
    });

};


void run(`../../code/art/artwork/nft-adventure/stories/nft-text-adventure-art/0000-arm-axe-parts.xcf`);

