import { parseTokenId_art121 } from '../../../artwork/art-121-helpers';

export const generateNftMetadata_art121 = async ({ params }: { params: { [name: string]: string } }) => {

    // Contract
    /*
  {
      "name": "OpenSea Creatures",
      "description": "OpenSea Creatures are adorable aquatic beings primarily for demonstrating what can be done using the OpenSea platform. Adopt one today to try out all the OpenSea buying, selling, and bidding feature set.",
      "image": "https://openseacreatures.io/image.png",
      "external_link": "https://openseacreatures.io"
  }
  */
    if (params.type === `contract`) {
        return {
            name: `1/21/21 21:21:21 Art Sell`,
            description: `This exact time pattern will occur only once in our human timeline. This NFT crypto art will attempt to capture that time to the precise second and embed it in the distributed blockchain forever.`,
            image: `https://ricklove.me/blog-content/posts/2021-01-21-crypto-art-121/art-121.png`,
            external_link: `https://ricklove.me/art?artwork=art-121`,
        };
    }

    // Factory
    if (params.type === `factory`) {
        return {
            name: `1/21/21 21:21:21 Art Sell`,
            description: `This exact time pattern will occur only once in our human timeline. This NFT crypto art will attempt to capture that time to the precise second and embed it in the distributed blockchain forever.`,
            image: `https://ricklove.me/blog-content/posts/2021-01-21-crypto-art-121/art-121.png`,
            external_link: `https://ricklove.me/art?artwork=art-121`,
        };
    }


    // Artwork
    /*
  {
    "attributes": [
      {
        "trait_type": "Base",
        "value": "starfish"
      },
      {
        "trait_type": "Eyes",
        "value": "joy"
      },
      {
        "trait_type": "Mouth",
        "value": "surprised"
      },
      {
        "trait_type": "Level",
        "value": 2
      },
      {
        "trait_type": "Stamina",
        "value": 2.3
      },
      {
        "trait_type": "Personality",
        "value": "Sad"
      },
      {
        "display_type": "boost_number",
        "trait_type": "Aqua Power",
        "value": 40
      },
      {
        "display_type": "boost_percentage",
        "trait_type": "Stamina Increase",
        "value": 10
      },
      {
        "display_type": "number",
        "trait_type": "Generation",
        "value": 2
      }
    ],
    "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
    "external_url": "https://openseacreatures.io/1",
    "image": "https://storage.googleapis.com/opensea-prod.appspot.com/creature/1.png",
    "name": "Sprinkles Fisherton"
  }
  */

    const tokenId = params.tokenId || ``;

    const {
        tokenCounter,
        timestampSecs,
        targetSecs,
        timeDeltaSecs,
    } = parseTokenId_art121(tokenId) || {
        tokenCounter: -1,
        timestampSecs: 0,
        targetSecs: 0,
        timeDeltaSecs: 1000000000,
        tokenId: -1,
    };

    // TODO: Generate image using:
    // https://www.npmjs.com/package/node-p5
    // and save to bucket
    // TODO: Check if image already exists in image bucket
    //

    // // TESTING - return art cats metadata
    // return {
    //     "platform": `Art Blocks Factory`,
    //     "name": `CatBlocks #362`,
    //     "curation_status": `factory`,
    //     "series": `N/A`,
    //     "description": `TESTING - NOT REAL NFT! Adorable and purrfect, these carefully bred kitties express a wide range of emotions and personalities. They live entirely on-chain and they just love receiving pets. Additional project feature(s) => Breed: Tabby, Color: Ginger, Body Pattern: 3, Face Pattern: 7, Eye Color: Yellow, Head: Cheeky, Ears: Floppy, Eyes: Doe, Pupils: Normal, Mouth: Pouting`,
    //     "external_url": `https://www.artblocks.io/token/73000362`,
    //     "artist": `Kristy Glas`,
    //     "royaltyInfo": {
    //         "artistAddress": `0x0EB47BEabd9CE2cab7CbED57aA6B040975BDc1b7`,
    //         "additionalPayee": `0x0000000000000000000000000000000000000000`,
    //         "additionalPayeePercentage": `0`,
    //         "royaltyFeeByID": `10`,
    //     },
    //     "collection_name": `CatBlocks by Kristy Glas`,
    //     "traits": [
    //         {
    //             "trait_type": `CatBlocks`,
    //             "value": `All CatBlocks`,
    //         },
    //         {
    //             "trait_type": `CatBlocks`,
    //             "value": `Breed: Tabby`,
    //         },
    //         {
    //             "trait_type": `CatBlocks`,
    //             "value": `Color: Ginger`,
    //         },
    //         {
    //             "trait_type": `CatBlocks`,
    //             "value": `Body Pattern: 3`,
    //         },
    //         {
    //             "trait_type": `CatBlocks`,
    //             "value": `Face Pattern: 7`,
    //         },
    //         {
    //             "trait_type": `CatBlocks`,
    //             "value": `Eye Color: Yellow`,
    //         },
    //         {
    //             "trait_type": `CatBlocks`,
    //             "value": `Head: Cheeky`,
    //         },
    //         {
    //             "trait_type": `CatBlocks`,
    //             "value": `Ears: Floppy`,
    //         },
    //         {
    //             "trait_type": `CatBlocks`,
    //             "value": `Eyes: Doe`,
    //         },
    //         {
    //             "trait_type": `CatBlocks`,
    //             "value": `Pupils: Normal`,
    //         },
    //         {
    //             "trait_type": `CatBlocks`,
    //             "value": `Mouth: Pouting`,
    //         },
    //     ],
    //     "payout_address": `0x6C093Fe8bc59e1e0cAe2Ec10F0B717D3D182056B`,
    //     "features": [
    //         `Breed: Tabby`,
    //         `Color: Ginger`,
    //         `Body Pattern: 3`,
    //         `Face Pattern: 7`,
    //         `Eye Color: Yellow`,
    //         `Head: Cheeky`,
    //         `Ears: Floppy`,
    //         `Eyes: Doe`,
    //         `Pupils: Normal`,
    //         `Mouth: Pouting`,
    //     ],
    //     "website": `https://www.kristyglas.com/`,
    //     "is dynamic": true,
    //     "script type": `p5js`,
    //     "aspect ratio (w/h)": `1`,
    //     "uses hash": true,
    //     "tokenID": `73000362`,
    //     "token hash": `0x820969f356d934272722976f870d6743fc90938275e1c93866a2e025565fa71f`,
    //     "license": `NIFTY`,
    //     "animation_url": `https://generator.artblocks.io/73000362`,
    //     "image": `https://api.artblocks.io/image/73000362`,
    //     "interactive_nft": {
    //         "code_uri": `https://generator.artblocks.io/73000362`,
    //         "version": `0.0.9`,
    //     },
    // };


    return {
        attributes: [
            {
                "display_type": `number`,
                "trait_type": `Sequence`,
                "value": tokenCounter,
            },
            {
                "display_type": `number`,
                "trait_type": `Seconds from Target`,
                "value": timeDeltaSecs,
            },
            {
                "display_type": `date`,
                "trait_type": `Timestamp`,
                "value": timestampSecs,
            },
            {
                "display_type": `number`,
                "trait_type": `Interactive Version`,
                "value": 5,
            },
        ],
        name: `2021-01-21 21:21:21 Art`,
        description: `TEST ONLY - Not a real NFT! --- Capture this unique second in our human timeline with this NFT crypto art. (5)`,
        // TODO: use an actual image
        image: `https://ricklove.me/blog-content/posts/2021-01-21-crypto-art-121/art-121.png`,
        external_link: `https://ricklove.me/art/art-121?tokenId=${tokenId}`,

        // TESTING Interactive
        // "is dynamic": true,
        // "script type": `p5js`,
        // "animation_url": `https://ricklove.me/art/art-121?tokenId=${tokenId}`,
        // interactive_nft: {
        //     code_uri: `https://ricklove.me/art/art-121?tokenId=${tokenId}`,
        //     version: `0.0.9`,
        // },

        // TESTING Interactive - FROM cat blocks
        "is dynamic": true,
        "script type": `p5js`,
        "aspect ratio (w/h)": `1`,
        "uses hash": true,
        "tokenID": `73000362`,
        "token hash": `0x820969f356d934272722976f870d6743fc90938275e1c93866a2e025565fa71f`,
        "license": `NIFTY`,
        "animation_url": `https://generator.artblocks.io/73000362`,
        "interactive_nft": {
            "code_uri": `https://generator.artblocks.io/73000362`,
            "version": `0.0.9`,
        },
    };
};
