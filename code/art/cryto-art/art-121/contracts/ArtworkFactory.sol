// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./_Config.sol";
import "./IFactoryERC721.sol";
import "./Artwork.sol";
import "./StringHelpers.sol";

contract ArtworkFactory is FactoryERC721, Ownable {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    address public proxyRegistryAddress;
    address public nftAddress;
    string public factoryBaseURI = _Config.factoryDefaultBaseURI();

    uint256 ARTWORK_SUPPLY = _Config.artworkSupply();
    uint256 NUM_OPTIONS = 1;

    constructor(address _proxyRegistryAddress, address _nftAddress) public {
        proxyRegistryAddress = _proxyRegistryAddress;
        nftAddress = _nftAddress;

        fireTransferEvents(address(0), owner());
    }

    function setFactoryBaseURI(string memory factoryBaseURI_) public onlyOwner {
        factoryBaseURI = factoryBaseURI_;
    }

    function name() external view returns (string memory) {
        return _Config.factoryName();
    }

    function symbol() external view returns (string memory) {
        return _Config.factorySymbol();
    }

    function supportsFactoryInterface() public view returns (bool) {
        return true;
    }

    function numOptions() public view returns (uint256) {
        return NUM_OPTIONS;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        address _prevOwner = owner();
        super.transferOwnership(newOwner);
        fireTransferEvents(_prevOwner, newOwner);
    }

    function fireTransferEvents(address _from, address _to) private {
        for (uint256 i = 0; i < NUM_OPTIONS; i++) {
            emit Transfer(_from, _to, i);
        }
    }

    function mint(uint256 _optionId, address _toAddress) public {
        // Must be sent from the owner proxy or owner.
        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        assert(
            address(proxyRegistry.proxies(owner())) == msg.sender ||
                owner() == msg.sender
        );
        require(canMint(_optionId));

        Artwork artwork = Artwork(nftAddress);
        artwork.mintArtwork(_toAddress, block.timestamp);
    }

    function canMint(uint256 _optionId) public view returns (bool) {
        if (_optionId >= NUM_OPTIONS) {
            return false;
        }

        Artwork artwork = Artwork(nftAddress);
        uint256 existingCount = artwork.totalSupply();

        return existingCount < ARTWORK_SUPPLY;
    }

    function tokenURI(uint256 _optionId) external view returns (string memory) {
        return
            StringHelpers.strConcat(baseURI, StringHelpers.uint2str(_optionId));
    }

    // --- Open Sea Integration ---

    /**
     * Hack to get things to work automatically on OpenSea.
     * Use transferFrom so the frontend doesn't have to worry about different method names.
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        mint(_tokenId, _to);
    }

    /**
     * Hack to get things to work automatically on OpenSea.
     * Use isApprovedForAll so the frontend doesn't have to worry about different method names.
     */
    function isApprovedForAll(address _owner, address _operator)
        public
        view
        returns (bool)
    {
        if (owner() == _owner && _owner == _operator) {
            return true;
        }

        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        if (
            owner() == _owner &&
            address(proxyRegistry.proxies(_owner)) == _operator
        ) {
            return true;
        }

        return false;
    }

    /**
     * Hack to get things to work automatically on OpenSea.
     * Use isApprovedForAll so the frontend doesn't have to worry about different method names.
     */
    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return owner();
    }
}
