  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './IERC165.sol';
import './IERC721.sol';
import './IERC721Metadata.sol';
import './IERC721Receiver.sol';
import './Base64.sol';

/**
 * @dev Minimal ERC721 with projects
 * 
 * Does not implement enumerable to reduce gas cost and since Transfer events are used everywhere anyway to calculate ownership
 * 
 * It is also possible to iterate ownerOf for all tokenIds by using projectIdLast() & project(projectId).projectTokenCount
 * projectTokenIDs = projectId * PROJECT_BUCKET_SIZE + [0..projectTokenCount]
 */
contract OnchainNftContract is IERC165 
, IERC721
, IERC721Metadata
{
    constructor () {
        _artist = msg.sender;
    }

    // Permissions ---
    address private _artist;
    modifier onlyArtist(){
        require(_artist == msg.sender, 'a');
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
            interfaceId == type(IERC721Metadata).interfaceId
            ;
    }

    // Metadata ---
    string public constant _name = 'TestContract';
    string public constant _symbol = 'TEST';
    string public constant _contractJson = "{\"name\":\"TestContract\",\"description\":\"Test Description\"}";

    /**
{
    "name": "{tokenName}",
    "description": "This is some great art!", 
    "image": "<svg width='100%' height='100%' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><image width='100%' height='100%' style='image-rendering:pixelated; image-rendering:crisp-edges' xlink:href='data:image/webp;base64,{tokenImage}'/></svg>", 
}
     */
    string public constant _tokenJson_beforeName = '{"name":"';
    string public constant _tokenJson_afterNameBeforeImage = "\",\"image\":\"<svg width='100%' height='100%' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><image width='100%' height='100%' style='image-rendering:pixelated; image-rendering:crisp-edges' xlink:href='";
    string public constant _tokenJson_afterImage = "'/></svg>\"}";

    // function setupProject(
    //     string memory name_,
    //     string memory symbol_, 
    //     string memory contractJson, 
    //     string memory tokenJson_beforeName,
    //     string memory tokenJson_afterNameBeforeImage,
    //     string memory tokenJson_afterImage
    // ) public onlyArtist {
    //     _name = name_;
    //     _symbol = symbol_;
    //     _contractJson = contractJson;
    //     _tokenJson_beforeName = tokenJson_beforeName;
    //     _tokenJson_afterNameBeforeImage = tokenJson_afterNameBeforeImage;
    //     _tokenJson_afterImage = tokenJson_afterImage;
    // }

    function name() public view override(IERC721Metadata) returns (string memory) {
        return _name;
    }

    function symbol() public view override(IERC721Metadata) returns (string memory) {
        return _symbol;
    }

    // On-chain json must be wrapped in base64 dataUri also: 
    // Reference: https://andyhartnett.medium.com/solidity-tutorial-how-to-store-nft-metadata-and-svgs-on-the-blockchain-6df44314406b

    // Open sea contractURI to get open sea metadata
    // https://docs.opensea.io/docs/contract-level-metadata
    function contractURI() public view returns (string memory) {
        string memory jsonBase64 = Base64.encode(bytes(_contractJson));
        return string(abi.encodePacked('data:application/json;base64,', jsonBase64));
    }
    function contractJson() public view returns (string memory) {
        return _contractJson;
    }

    // Token Metadata:
    // https://docs.opensea.io/docs/metadata-standards
    function tokenURI(uint256 tokenId) public view override(IERC721Metadata) returns (string memory) {
        string memory jsonBase64 = Base64.encode(bytes(tokenJson(tokenId)));
        return string(abi.encodePacked('data:application/json;base64,', jsonBase64));
    }
    function tokenJson(uint256 tokenId) public view returns (string memory) {
        return string(abi.encodePacked(
            _tokenJson_beforeName, 
            _tokenName[tokenId], 
            _tokenJson_afterNameBeforeImage,
            _tokenImageData[tokenId], 
            _tokenJson_afterImage
        ));
    }

    // Token Ownership ---
    uint256 private _totalSupply;
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    // uint256 private _projectIdLast;

    /** tokenId => owner */ 
    mapping (uint256 => address) private _owners;
    function ownerOf(uint256 tokenId) public view override(IERC721) returns (address) {
        return _owners[tokenId];
    }

    /** Owner balances */
    mapping(address => uint256) private _balances;
    function balanceOf(address user) public view override(IERC721) returns (uint256) {
        return _balances[user];
    }

    // Token Data --- 

    /** The token name */
    mapping (uint256 => string) private _tokenName;
    /** The token image base 64 */
    mapping (uint256 => string) private _tokenImageData;

    function getTokenData(uint256 tokenId) public view returns (uint256, string memory, string memory) {
        return (
            tokenId, 
            _tokenName[tokenId],
            _tokenImageData[tokenId]
        );
    }

    /** Create a new nft
     *
     * tokenId should be totalSupply (nextTokenId = length, like a standard array index)
     */
    function createToken(uint256 tokenId, string memory tokenName, string memory tokenImageData) public onlyArtist returns (uint256) {

        // nextTokenId = _totalSupply
        require(_totalSupply == tokenId, 'n' );
        _totalSupply++;

        _tokenName[tokenId] = tokenName;
        _tokenImageData[tokenId] = tokenImageData;

        _balances[msg.sender] += 1;
        _owners[tokenId] = msg.sender;
    
        emit Transfer(address(0), msg.sender, tokenId);

        return tokenId;
    }

    // Transfers ---

    function _transfer(address from, address to, uint256 tokenId) internal  {
        // Is the from the real owner
        require(ownerOf(tokenId) == from, 'o');
        // Does msg.sender have authority over this token
        require(_isApprovedOrOwner(tokenId), 'A');
        // Prevent sending to 0
        require(to != address(0), 't');

        // Clear approvals from the previous owner
        if(_tokenApprovals[tokenId] != address(0)){
            _approve(address(0), tokenId);
        }

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public override(IERC721) {
        _transfer(from, to, tokenId);
        _checkReceiver(from, to, tokenId, '');
    }
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data_) public override(IERC721) {
        _transfer(from, to, tokenId);
        _checkReceiver(from, to, tokenId, data_);
    }
    function transferFrom(address from, address to, uint256 tokenId) public virtual override(IERC721) {
        _transfer(from, to, tokenId);
    }

    function _checkReceiver(address from, address to, uint256 tokenId, bytes memory data_) internal  {
        
        // If contract, confirm is receiver
        uint256 size; 
        assembly { size := extcodesize(to) }
        if (size > 0)
        {
            bytes4 retval = IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data_);
            require(retval == IERC721Receiver(to).onERC721Received.selector, 'z');
        }
    }

    // Approvals ---

    /** Temporary approval during token transfer */ 
    mapping (uint256 => address) private _tokenApprovals;

    function approve(address to, uint256 tokenId) public override(IERC721) {
        address owner = ownerOf(tokenId);
        require(owner == msg.sender || isApprovedForAll(owner, msg.sender), 'o');

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
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    function isApprovedForAll(address owner, address operator) public view override(IERC721) returns (bool) {
        return _operatorApprovals[owner][operator];
    }
    function _isApprovedOrOwner(uint256 tokenId) internal view  returns (bool) {
        address owner = ownerOf(tokenId);
        return (owner == msg.sender 
            || getApproved(tokenId) == msg.sender 
            || isApprovedForAll(owner, msg.sender));
    }

}