  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC165.sol";
import "./IERC721.sol";
import "./IERC721Metadata.sol";
import "./IERC721Receiver.sol";
import "./Utils.sol";

/**
 * @dev Minimal ERC721
 */
contract ERC721 is IERC165 
, IERC721
, IERC721Metadata
{
    using Utils for uint256;

    constructor (string memory name_, string memory symbol_, string memory baseURI) {
        _artist = msg.sender;
        _name = name_;
        _symbol = symbol_;
        _baseURI = baseURI;
    }

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
    function supportsInterface(bytes4 interfaceId) public view override(IERC165) returns (bool) {
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
    function safeTransferFrom(address from, address to, uint256 tokenId) public  override(IERC721) {
        safeTransferFrom(from, to, tokenId, "");
    }
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public  override(IERC721) {
        require(_isApprovedOrOwner(tokenId), "!owner");
        _safeTransfer(from, to, tokenId, _data);
    }
    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory _data) internal  {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, _data), "!ERC721Receiver");
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
    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory _data)
        private returns (bool)
    {
        if (_isContract(to)) {
            try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, _data) returns (bytes4 retval) {
                return retval == IERC721Receiver(to).onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("!ERC721Receiver");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }
    function _isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(account) }
        return size > 0;
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
        emit Approval(ERC721.ownerOf(tokenId), to, tokenId);
    }

    function getApproved(uint256 tokenId) public view override(IERC721) returns (address) {
        return _tokenApprovals[tokenId];
    }

    /** Approval for all (operators approved to transfer tokens on behalf of an owner) */
    mapping (address => mapping (address => bool)) private _operatorApprovals;

    function setApprovalForAll(address operator, bool approved) public virtual override {
        require(operator != msg.sender, "!operator");

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    function isApprovedForAll(address owner, address operator) public view override(IERC721) returns (bool) {
        return _operatorApprovals[owner][operator];
    }
    function _isApprovedOrOwner(uint256 tokenId) internal view  returns (bool) {
        address owner = ownerOf(tokenId);
        return (owner == msg.sender || getApproved(tokenId) == msg.sender || isApprovedForAll(owner, msg.sender));
    }
     


    // Metadata ---
    string private _name;
    function name() public view override(IERC721Metadata) returns (string memory) {
        return _name;
    }

    string private _symbol;
    function symbol() public view override(IERC721Metadata) returns (string memory) {
        return _symbol;
    }

    string private _baseURI;
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