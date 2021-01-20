// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

library _Config {
    function defaultArtworkBaseURI() internal pure returns (string memory) {
        return
            "https://s7mrgkmtk5.execute-api.us-east-1.amazonaws.com/prod/nft-api/art121/art/";
    }

    function defaultArtworkContractURI() internal pure returns (string memory) {
        return
            "https://s7mrgkmtk5.execute-api.us-east-1.amazonaws.com/prod/nft-api/art121/contract/";
    }

    function defaultFactoryBaseURI() internal pure returns (string memory) {
        return
            "https://s7mrgkmtk5.execute-api.us-east-1.amazonaws.com/prod/nft-api/art121/factory/";
    }

    function artworkName() internal pure returns (string memory) {
        return "1/21/21 21:21:21.212";
    }

    function artworkSymbol() internal pure returns (string memory) {
        return "RLART121";
    }

    function artworkSupply() internal pure returns (uint256) {
        return 1212;
    }

    function factoryName() internal pure returns (string memory) {
        return "1/21/21 21:21:21.212 Artwork Sell";
    }

    function factorySymbol() internal pure returns (string memory) {
        return "RLART121F";
    }
}
