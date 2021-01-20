// SPDX-License-Identifier: UNLICENSED
// Based on: https://github.com/ProjectOpenSea/opensea-creatures/blob/master/contracts/Creature.sol
pragma solidity ^0.7.0;

import "./_Config.sol";
import "./ERC721Tradable.sol";

/**
 * @title Artwork
 * Artwork - a contract for my non-fungible artwork.
 */
contract Artwork is ERC721Tradable {
    string private _contractURI;
    uint256 private _tokenCounter = 0;

    constructor(address _proxyRegistryAddress)
        ERC721Tradable(
            _Config.artworkName(),
            _Config.artworkSymbol(),
            _proxyRegistryAddress
        )
    {
        _setBaseURI(_Config.defaultArtworkBaseURI());
        _contractURI = _Config.defaultArtworkContractURI();
    }

    // Note: onlyOwner refers to the creator, not to a specific token owner

    function setBaseURI(string memory baseURI) public onlyOwner {
        _setBaseURI(baseURI);
    }

    function setContractURI(string memory contractURI_) public onlyOwner {
        _contractURI = contractURI_;
    }

    function contractURI() public view returns (string memory) {
        return _contractURI; //"https://creatures-api.opensea.io/contract/opensea-creatures";
    }

    function mintArtwork(address buyer) public {
        // Must be sent from the owner proxy or owner.
        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        assert(
            address(proxyRegistry.proxies(owner())) == msg.sender ||
                owner() == msg.sender
        );

        // Use the timestamp & token counter as the token id, so no custom storage is needed for the timestamp
        // Note: timestamp is seconds since UNIX epoch
        uint256 newTokenId = block.timestamp * 1000000 + _tokenCounter;
        _mint(buyer, newTokenId);
        _tokenCounter++;
    }
}
