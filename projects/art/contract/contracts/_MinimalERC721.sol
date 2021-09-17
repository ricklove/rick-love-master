  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC165.sol";
import "./IERC721.sol";
import "./IERC721Enumerable.sol";
import "./IERC721Metadata.sol";
import "./IERC721Receiver.sol";
import "./OpenSeaProxy.sol";

/**
 * @dev Minimal ERC721
 */
contract MinimalERC721 is IERC165 
, IERC721
, IERC721Metadata
, IERC721Enumerable
{
    constructor () {
        _artist = msg.sender;
        _totalSupply = 100000;
        _balances[_artist] = _totalSupply;
    }

    // constructor (string memory name_, string memory symbol_, string memory baseURI, address openSeaProxyRegistryAddress) {
    //     _name = name_;
    //     _symbol = symbol_;
    //     _baseURI = baseURI;
    //     _openSeaProxyRegistryAddress = openSeaProxyRegistryAddress;
    // }

    // Permissions ---
    address private _artist;

    // Interfaces ---
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public pure override(IERC165) returns (bool) {
        return
            interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            interfaceId == type(IERC721Enumerable).interfaceId 
            ;
    }

    // Token Ownership ---
    uint256 private _totalSupply;
    function totalSupply() public view override(IERC721Enumerable) returns (uint256) {
        return _totalSupply;
    }
    function tokenByIndex(uint256 index) public view override(IERC721Enumerable) returns (uint256) {
        require(index < _totalSupply, "!");
        return index;
    }
    function tokenOfOwnerByIndex(address user, uint256 _index) public view override(IERC721Enumerable) returns (uint256) {
        // Is a loop ok on user nodes? - Runs fine on etherscan
        uint iSoFar = 0;
        for(uint i = 0; i < _totalSupply; i++){
            if(_ownerOf(i) != user){ continue; }
            if(iSoFar == _index){ return i; }
            iSoFar++;
        }

        revert('!');
    }

    // uint256 private _projectCount;

    /** tokenId => owner */ 
    mapping (uint256 => address) private _owners;
    function ownerOf(uint256 tokenId) public view override(IERC721) returns (address) {
        require(tokenId < _totalSupply, "!");
        return _ownerOf(tokenId);
    }
    function _ownerOf(uint256 tokenId) internal view returns (address) {
        address owner = _owners[tokenId];
        
        // Artist is default owner
        if(owner == address(0)){ return _artist; }

        return owner;
    }

    /** Owner balances
     * 
     * PERFORMANCE: Why not just iterate over the contract data, instead of storing this and updating manually?
     */
    mapping(address => uint256) private _balances;
    function balanceOf(address user) public view override(IERC721) returns (uint256) {
        require(user != address(0), "u");
        return _balances[user];
    }


    // Transfers ---
    function safeTransferFrom(address from, address to, uint256 tokenId) public override(IERC721) {
        safeTransferFrom(from, to, tokenId, "");
    }
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data_) public override(IERC721) {
        require(_isApprovedOrOwner(tokenId), "o");
        _safeTransfer(from, to, tokenId, data_);
    }
    function transferFrom(address from, address to, uint256 tokenId) public virtual override(IERC721) {
        require(_isApprovedOrOwner(tokenId), "o");
        _transfer(from, to, tokenId);
    }

    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data_) internal  {
        _transfer(from, to, tokenId);
        _checkReceiver(from, to, tokenId, data_);
    }
    function _checkReceiver(address from, address to, uint256 tokenId, bytes memory data_) internal  {
        
        // If contract, confirm is receiver
        uint256 size; 
        assembly { size := extcodesize(to) }
        if (size > 0)
        {
            bytes4 retval = IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data_);
            require(retval == IERC721Receiver(to).onERC721Received.selector, '!receiver');
        }
    }

    function _transfer(address from, address to, uint256 tokenId) internal  {
        require(ownerOf(tokenId) == from, "o");
        require(to != address(0), "t");

        // Clear approvals from the previous owner
        if(_tokenApprovals[tokenId] != address(0)){
            _approve(address(0), tokenId);
        }

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }
    function _transferForMint(address to, uint256 tokenId) internal  {
        _balances[_artist] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }

    // Approvals ---

    /** Temporary approval during token transfer */ 
    mapping (uint256 => address) private _tokenApprovals;

    function approve(address to, uint256 tokenId) public override(IERC721) {
        address owner = ownerOf(tokenId);
        require(to != owner, "t");
        require(owner == msg.sender || isApprovedForAll(owner, msg.sender), "o");

        _approve(to, tokenId);
    }
    function _approve(address to, uint256 tokenId) internal {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

    function getApproved(uint256 tokenId) public view override(IERC721) returns (address) {
        return _tokenApprovals[tokenId];
    }

    /** Approval for all (operators approved to transfer tokens on behalf of an owner) */
    mapping (address => mapping (address => bool)) private _operatorApprovals;

    function setApprovalForAll(address operator, bool approved) public virtual override(IERC721) {
        require(operator != msg.sender, "p");

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
    function setBaseURI(string memory baseURI) public {
        require(_artist == msg.sender, "a");
        _baseURI = baseURI;
    }

    // Open sea contractURI to get open sea metadata
    // https://docs.opensea.io/docs/contract-level-metadata
    function contractURI() public view returns (string memory) {
        return string(abi.encodePacked(_baseURI, 'contract.json'));
    }
    // Token Metadata:
    // https://docs.opensea.io/docs/metadata-standards
    function tokenURI(uint256 tokenId) public view override(IERC721Metadata) returns (string memory) {
        return string(abi.encodePacked(_baseURI, _uint2str(tokenId), ".json"));
    }
    function _uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint256 temp = _i;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (_i != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(_i % 10)));
            _i /= 10;
        }
        return string(buffer);
    }

    // Minting --- 
    uint256 private _nextTokenId;
    function mint() public payable {
        // Don't buy yourself
        require(msg.sender != _artist, "a");
        // Got any left?
        require(_totalSupply > _nextTokenId, "#" );
        // Show me da money
        require(msg.value >= 0.1 ether, "$" );
        // Pay up
        require(payable(_artist).send(msg.value), "F");
      

        _transferForMint(msg.sender, _nextTokenId);
        _nextTokenId++;
    }
    function safeMint() public payable {
        mint();
        _checkReceiver(_artist, msg.sender, _nextTokenId, "");
    }
     function safeMint(bytes memory data_) public payable {
        mint();
        _checkReceiver(_artist, msg.sender, _nextTokenId, data_);
    }
}