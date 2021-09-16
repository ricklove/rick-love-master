  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC165.sol";
import "./IERC721.sol";
import "./IERC721Metadata.sol";
import "./IERC721Receiver.sol";
import "./OpenSeaProxy.sol";
import "./StringUtils.sol";

/**
 * @dev Minimal ERC721
 */
contract ERC721 is IERC165 
, IERC721
, IERC721Metadata
{
    using StringUtils for uint256;

    constructor () {
        _artist = msg.sender;
    }

    // constructor (string memory name_, string memory symbol_, string memory baseURI, address openSeaProxyRegistryAddress) {
    //     _name = name_;
    //     _symbol = symbol_;
    //     _baseURI = baseURI;
    //     _openSeaProxyRegistryAddress = openSeaProxyRegistryAddress;
    // }

    // Permissions ---
    address private _artist;
    function artist() public view  returns (address) {
        return _artist;
    }
    modifier onlyArtist() {
        require(artist() == msg.sender, "!artist");
        _;
    }

    // Interfaces ---
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public pure override(IERC165) returns (bool) {
        return
            interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId;
    }

    // Token Ownership ---
    // uint256 private _projectCount;

    /** tokenId => owner */ 
    mapping (uint256 => address) private _owners;
    function ownerOf(uint256 tokenId) public view override(IERC721) returns (address) {
        address owner = _owners[tokenId];
        
        // TODO: If no owner & in valid project tokenId => owner is artist?
        require(owner != address(0), "!owner");
        return owner;
    }

    /** Owner balances
     * 
     * PERFORMANCE: Why not just iterate over the contract data, instead of storing this and updating manually?
     */
    mapping(address => uint256) private _balances;
    function balanceOf(address user) public view override(IERC721) returns (uint256) {
        require(user != address(0), "!user");
        return _balances[user];
    }


    // Transfers ---
    function safeTransferFrom(address from, address to, uint256 tokenId) public override(IERC721) {
        safeTransferFrom(from, to, tokenId, "");
    }
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override(IERC721) {
        require(_isApprovedOrOwner(tokenId), "!owner");
        _safeTransfer(from, to, tokenId, _data);
    }
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        require(_isApprovedOrOwner(tokenId), "!owner");
        _transfer(from, to, tokenId);
    }

    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory _data) internal  {
        _transfer(from, to, tokenId);
        // require(_checkOnERC721Received(from, to, tokenId, _data), "!ERC721Receiver");

        // If contract, confirm is receiver
        uint256 size; 
        assembly { size := extcodesize(to) }
        if (size > 0)
        {
            bytes4 retval = IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, _data);
            require(retval == IERC721Receiver(to).onERC721Received.selector, '!receiver');
        }
    }

    function _transfer(address from, address to, uint256 tokenId) internal  {
        require(ownerOf(tokenId) == from, "!owner");
        require(to != address(0), "!to");

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    // Approvals ---
    /** Temporary approval during token transfer */ 
    mapping (uint256 => address) private _tokenApprovals;

    function approve(address to, uint256 tokenId) public override(IERC721) {
        address owner = ownerOf(tokenId);
        require(to != owner, "!to");
        require(owner == msg.sender || isApprovedForAll(owner, msg.sender), "!owner");

        _approve(to, tokenId);
    }
    function _approve(address to, uint256 tokenId) internal  {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

    function getApproved(uint256 tokenId) public view override(IERC721) returns (address) {
        return _tokenApprovals[tokenId];
    }

    /** Approval for all (operators approved to transfer tokens on behalf of an owner) */
    mapping (address => mapping (address => bool)) private _operatorApprovals;

    function setApprovalForAll(address operator, bool approved) public virtual override(IERC721) {
        require(operator != msg.sender, "!operator");

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    function isApprovedForAll(address owner, address operator) public view override(IERC721) returns (bool) {

        // Approve open sea proxies to allow gasless trading
        OpenSeaProxyRegistry proxyRegistry = OpenSeaProxyRegistry(0xF57B2c51dED3A29e6891aba85459d600256Cf317);
        if (address(proxyRegistry.proxies(owner)) == operator) {
            return true;
        }

        return _operatorApprovals[owner][operator];
    }
    function _isApprovedOrOwner(uint256 tokenId) internal view  returns (bool) {
        address owner = ownerOf(tokenId);
        return (owner == msg.sender || getApproved(tokenId) == msg.sender || isApprovedForAll(owner, msg.sender));
    }
     


    // Metadata ---
    function name() public pure override(IERC721Metadata) returns (string memory) {
        return 'TestArt';
    }

    function symbol() public pure override(IERC721Metadata) returns (string memory) {
        return 'TA';
    }

    string private _baseURI = 'https://ricklove.me/art/test/';
    function setBaseURI(string memory baseURI) public onlyArtist {
        _baseURI = baseURI;
    }

    function tokenURI(uint256 tokenId) public view override(IERC721Metadata) returns (string memory) {
        string memory baseURI = _baseURI;
        string memory json = ".json";
        return bytes(baseURI).length > 0
            ? string(abi.encodePacked(baseURI, tokenId.toString(), json))
            : '';
    }
}