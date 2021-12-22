  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './IERC165.sol';
import './IERC721.sol';
import './IERC721Metadata.sol';
import './IERC721Receiver.sol';
import './Base64.sol';

/**
 * @dev Minimal Purely On-chain ERC721
 */
contract KittenBlocksOnchainSvgNftContract is IERC165 
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
    string private constant _name = 'TestContract';
    string private constant _symbol = 'TEST';
    string private constant _contractJson = "{\"name\":\"TestContract\",\"description\":\"Test Description\"}";

    function name() public pure override(IERC721Metadata) returns (string memory) {
        return _name;
    }

    function symbol() public pure override(IERC721Metadata) returns (string memory) {
        return _symbol;
    }

    // On-chain json must be wrapped in base64 dataUri also: 
    // Reference: https://andyhartnett.medium.com/solidity-tutorial-how-to-store-nft-metadata-and-svgs-on-the-blockchain-6df44314406b

    // Open sea contractURI to get open sea metadata
    // https://docs.opensea.io/docs/contract-level-metadata
    function contractURI() public pure returns (string memory) {
        string memory jsonBase64 = Base64.encode(bytes(_contractJson));
        return string(abi.encodePacked('data:application/json;base64,', jsonBase64));
    }
    function contractJson() public pure returns (string memory) {
        return _contractJson;
    }

    // Token Metadata:
    /**
    {
        "name": "{tokenName}",
        "image": "<svg width='100%' height='100%' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><image width='100%' height='100%' style='image-rendering:pixelated; image-rendering:crisp-edges' xlink:href='{tokenImage}'/></svg>", 
    }
     */
    string private constant _tokenJson_a = '{"name":"';
    string private constant _tokenJson_b = "\",\"image\":\"";
    string private constant _tokenJson_c = "\",\"animation_url\":\"";
    string private constant _tokenJson_d = "\"}";

    // https://docs.opensea.io/docs/metadata-standards
    function tokenURI(uint256 tokenId) public view override(IERC721Metadata) returns (string memory) {
        string memory jsonBase64 = Base64.encode(bytes(tokenJson(tokenId)));
        return string(abi.encodePacked('data:application/json;base64,', jsonBase64));
    }
    function tokenJson(uint256 tokenId) public view returns (string memory) {
        return string(abi.encodePacked(
            _tokenJson_a, 
            _tokenName[tokenId], 
            _tokenJson_b,
            _tokenImageSvg[tokenId],
            _tokenJson_c,
            tokenIframeBase64(tokenId),
            _tokenJson_d
        ));
    }
    function tokenImage(uint256 tokenId) public view returns (string memory) {
        return _tokenImageSvg[tokenId];
    }
    function tokenIframeBase64(uint256 tokenId) public view returns (string memory) {
        string memory jsonBase64 = Base64.encode(bytes(tokenIframe(tokenId)));
        return string(abi.encodePacked('data:text/html;base64,', jsonBase64));
    }
    function tokenIframe(uint256 tokenId) public view returns (string memory) {
        return string(abi.encodePacked(
            '<!DOCTYPE html><html><head><title>',
            _tokenName[tokenId],
            '</title></head><body>',
            _tokenImageSvg[tokenId],
            '</body></html>'
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
    /** The token image bytes */
    mapping (uint256 => string) private _tokenImageSvg;
    

    function tokenData(uint256 tokenId) public view returns (uint256, string memory, string memory) {
        return (
            tokenId, 
            _tokenName[tokenId],
            _tokenImageSvg[tokenId]
        );
    }

    /** Create a new nft
     *
     * tokenId = totalSupply (i.e. new tokenId = length, like a standard array index, first tokenId=0)
     */
    function createToken(uint256 tokenId, string memory tokenName, string memory tokenImageSvg) public onlyArtist returns (uint256) {

        // nextTokenId = _totalSupply
        require(_totalSupply == tokenId, 'n' );
        _totalSupply++;

        _tokenName[tokenId] = tokenName;
        _tokenImageSvg[tokenId] = tokenImageSvg;

        _balances[msg.sender] += 1;
        _owners[tokenId] = msg.sender;
    
        emit Transfer(address(0), msg.sender, tokenId);

        return tokenId;
    }

    // Transfers ---

    function _transfer(address from, address to, uint256 tokenId) internal  {
        // Is from actually the token owner
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



    // --------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    // ----------------------------------------- START --------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------

    // Helper functions
    function average(int256 a, int256 b) private pure returns (int256) {
        return (a + b) / 2;
    }
    function lerp(int256 a, int256 b, int256 t100) private pure returns (int256) {
        return (a * (100 - t100) + b * t100) / 100;
    }
    function ceil_100(int256 a) private pure returns (int256) {
        int256 r = a % 100;
        if(r == 0){
            return a;
        }
        return a - r + 100;
    }
    function constrain(int256 a, int256 min, int256 max) private pure returns (int256) {
        return a < min ? min 
            : a > max ? max 
            : a;
    }
    function bezierPoint(int256 a, int256 b, int256 c, int256 d, int256 t100) private pure returns (int256) {
        int256 tInv = 100 - t100;
        return ((a *     tInv * tInv * tInv)
            +   (b * 3 * tInv * tInv * t100)
            +   (c * 3 * tInv * t100 * t100)
            +   (d *     t100 * t100 * t100)
            ) / 1000000;
    }
    function vertex(int256 a, int256 b) private pure returns (string memory) {
        return string(abi.encodePacked(
            'M', intToString(a), ',', intToString(b)
        ));
    }
    function bezierVertex(int256 a, int256 b, int256 c, int256 d, int256 e, int256 f) private pure returns (string memory) {
        return string(abi.encodePacked(
            'C', intToString(a), ',', (b),
            ' ', intToString(c), ',', (d),
            ' ', intToString(e), ',', (f)
        ));
    }
    function bezier(int256 a, int256 b, int256 c, int256 d, int256 e, int256 f, int256 g, int256 h) private pure returns (string memory) {
        return string(abi.encodePacked(
            'M', intToString(a), ',', intToString(b),
            'C', intToString(c), ',', intToString(d),
            ' ', intToString(e), ',', intToString(f),
            ' ', intToString(g), ',', intToString(h)
        ));
    }
    function line(int256 a, int256 b, int256 c, int256 d) private pure returns (string memory) {
        return string(abi.encodePacked(
            'M', intToString(a), ',', intToString(b),
            'L', intToString(c), ',', intToString(d),
            'l0.0001,0.0001'
        ));
    }
    function colorToString(int256 a) private pure returns (string memory) {
        uint256 digits = a > 0xFFFFFF ? 8 : 6;
        bytes memory buffer = new bytes(digits);

        // Writing backwards (from right, smallest digit)
        while (a != 0) {
            digits -= 1;
            uint256 v = uint256(a % 16);
            buffer[digits] = v < 10 
                // 0-9
                ? bytes1(uint8(48 + v))
                // A-F
                : bytes1(uint8(65 + v));
            a /= 16;
        }
        return string(buffer);
    }
    function intToString(int256 aRaw) private pure returns (string memory) {
        if (aRaw == 0) {
            return '0';
        }
        bool isNegative = aRaw < 0;
        uint256 a = uint256(isNegative ? -aRaw : aRaw);

        uint256 temp = a;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);

        if (isNegative) {
            digits++;
            buffer[0] = bytes1(uint8(45));
        }

        // Writing backwards (from right, smallest digit)
        while (a != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(a % 10)));
            a /= 10;
        }
        return string(buffer);
    }


    /** Move forward and read bits based on the current dataBitSize */
    function nextData(bytes memory data, State memory s) private pure returns (int256) {
        // TODO: Read bits and move pointer forward
        return 0;
    }
    /** Move forward and read bits based on the provided bitSize */
    function nextDataWithBitSize(bytes memory data, State memory s, uint bitSize) private pure returns (int256) {
        // TODO: Read bits and move pointer forward
        return 0;
    }
    /** Move forward and read bits based on the current dataBitSize */
    function nextDataArraySelection(bytes memory data, State memory s, int256 index) private pure returns (int256) {
        // TODO: Read length, bits of item, and move pointer forward past array
        return 0;
    }
    

    // Bit Pointer Locations
    int256 constant P_breeds_black             = 0x00000000;
    int256 constant P_breeds_white             = 0x00000080;
    int256 constant P_breeds_tabby             = 0x000000d8;
    int256 constant P_breeds_shorthair         = 0x00000160;
    int256 constant P_breeds_calico            = 0x000001c0;
    int256 constant P_breeds_siamese           = 0x00000210;
    int256 constant P_breeds_sphynx            = 0x00000260;
    int256 constant P_breeds_sandcat           = 0x000002a8;
    int256 constant P_breeds_toyger            = 0x000002f0;
    int256 constant P_breeds_alien             = 0x00000340;
    int256 constant P_breeds_zombie            = 0x000003b8;
    int256 constant P_heads_round              = 0x00000428;
    int256 constant P_heads_oval               = 0x00000430;
    int256 constant P_heads_diamond            = 0x00000438;
    int256 constant P_heads_squarish           = 0x00000440;
    int256 constant P_heads_fluffy             = 0x00000448;
    int256 constant P_heads_scruffy            = 0x00000450;
    int256 constant P_heads_plain              = 0x00000458;
    int256 constant P_heads_chonker            = 0x00000460;
    int256 constant P_heads_slick              = 0x00000468;
    int256 constant P_heads_rectangular        = 0x00000470;
    int256 constant P_heads_teeny              = 0x00000478;
    int256 constant P_heads_cheeky             = 0x00000480;
    int256 constant P_heads_lemon              = 0x00000488;
    int256 constant P_heads_silky              = 0x00000490;
    int256 constant P_heads_chubby             = 0x00000498;
    int256 constant P_heads_skinny             = 0x000004a0;
    int256 constant P_heads_wide               = 0x000004a8;
    int256 constant P_heads_blocky             = 0x000004b0;
    int256 constant P_ears_plain               = 0x000004b8;
    int256 constant P_ears_upright             = 0x000004c0;
    int256 constant P_ears_alert               = 0x000004c8;
    int256 constant P_ears_pointy              = 0x000004d0;
    int256 constant P_ears_teeny               = 0x000004d8;
    int256 constant P_ears_curved              = 0x000004e0;
    int256 constant P_ears_slanted             = 0x000004e8;
    int256 constant P_ears_folded              = 0x000004f0;
    int256 constant P_ears_floppy              = 0x000004f8;
    int256 constant P_ears_sideways            = 0x00000500;
    int256 constant P_ears_perky               = 0x00000508;
    int256 constant P_ears_sphynx              = 0x00000510;
    int256 constant P_ears_wide                = 0x00000518;
    int256 constant P_ears_round               = 0x00000520;
    int256 constant P_eyes_round               = 0x00000528;
    int256 constant P_eyes_fierce              = 0x00000530;
    int256 constant P_eyes_squinting           = 0x00000530;
    int256 constant P_eyes_sullen              = 0x00000538;
    int256 constant P_eyes_meek                = 0x00000540;
    int256 constant P_eyes_stern               = 0x00000540;
    int256 constant P_eyes_mean                = 0x00000548;
    int256 constant P_eyes_droopy              = 0x00000550;
    int256 constant P_eyes_cross               = 0x00000558;
    int256 constant P_eyes_almond              = 0x00000560;
    int256 constant P_eyes_doe                 = 0x00000568;
    int256 constant P_eyes_glaring             = 0x00000568;
    int256 constant P_eyes_sleepy              = 0x00000570;
    int256 constant P_eyes_pleading            = 0x00000578;
    int256 constant P_pupils_thin              = 0x00000580;
    int256 constant P_pupils_big               = 0x00000580;
    int256 constant P_pupils_huge              = 0x00000580;
    int256 constant P_pupils_normal            = 0x00000580;
    int256 constant P_pupils_small             = 0x00000580;
    int256 constant P_pupils_thinnest          = 0x00000588;
    int256 constant P_mouths_neutral           = 0x00000590;
    int256 constant P_mouths_pursed            = 0x00000598;
    int256 constant P_mouths_pleased           = 0x000005a0;
    int256 constant P_mouths_pouting           = 0x000005a8;
    int256 constant P_mouths_drooping          = 0x000005b0;
    int256 constant P_mouths_displeased        = 0x000005b8;
    int256 constant P_mouths_impartial         = 0x000005c0;
    int256 constant P_mouths_dull              = 0x000005c8;
    int256 constant P_mouths_smiling           = 0x000005d0;
    int256 constant P_whiskers_downward        = 0x000005d8;
    int256 constant P_whiskers_downwardShort   = 0x000005e0;
    int256 constant P_whiskers_upward          = 0x000005e8;
    int256 constant P_whiskers_upwardShort     = 0x000005f0;
    int256 constant P_palettes_black           = 0x000005f8;
    int256 constant P_palettes_white           = 0x00000730;
    int256 constant P_palettes_ginger          = 0x00000868;
    int256 constant P_palettes_gray            = 0x000009a0;
    int256 constant P_palettes_brown           = 0x00000ad8;
    int256 constant P_palettes_british_blue    = 0x00000c10;
    int256 constant P_palettes_calico          = 0x00000d48;
    int256 constant P_palettes_creamy          = 0x00000e80;
    int256 constant P_palettes_pink            = 0x00000fb8;
    int256 constant P_palettes_cyan            = 0x000010f0;
    int256 constant P_palettes_green           = 0x00001228;
    int256 constant P_palettes_fleshy          = 0x00001360;
    int256 constant P_palettes_sand            = 0x00001498;
    int256 constant P_palettes_toyger          = 0x000015d0;
    int256 constant P_eyeColors_blue           = 0x00001708;
    int256 constant P_eyeColors_yellow         = 0x00001720;
    int256 constant P_eyeColors_green          = 0x00001738;
    int256 constant P_eyeColors_orange         = 0x00001750;
    int256 constant P_eyeColors_black          = 0x00001768;
    int256 constant P_eyeColors_white          = 0x00001780;
    

    // Category Lengths
    int256 constant L_heads                    = 18;
    int256 constant L_ears                     = 14;
    int256 constant L_eyes                     = 14;
    int256 constant L_pupils                   =  6;
    int256 constant L_mouths                   =  9;
    int256 constant L_whiskers                 =  4;
    int256 constant L_palettes                 = 14;
    int256 constant L_eyeColors                =  6;
    
    

    struct State {
        int256 rvs_breed;
        int256 rvs_bodyParts;
        int256 rvs_faceParts;
        int256 rvs_palette;
        int256 rvs_head;
        int256 rvs_ear;
        int256 rvs_eyes;
        int256 rvs_pupils;
        int256 rvs_mouth;
        int256 rvs_whiskers;
        int256 rvs_flipFaceMarks;
        int256 rvs_swapMarkColors;
        int256 rvs_heterochromia;
        int256 rvs_eyeColor;
        int256 rvs_eyeSwap;
        int256 rvs_tabbyFacePartsAndTongue;
        int256 _p;
        int256 _dataBitSize;
        int256 _lastValue;
        int256 _lastLength;
        bool heterochromia;
        int256 b_tabbyFaceOdds;
        int256 i_heads;
        int256 i_ears;
        int256 i_body;
        int256 i_face;
        int256 i_palettes;
        int256 i_eyeColorsMain;
        int256 i_eyeColorsH2;
        int256 i_eyeColorsA;
        int256 i_eyeColorsB;
        bool f_whiskers;
        bool f_tongue;
        bool f_zombieEyes;
        bool f_swapMarkColors;
        bool f_useBodyColorForCorner;
        bool f_calico;
        bool flipFaceMarks;
        bool swapMarkColors;
        bool eyeSwap;
        int256 i_eyes;
        int256 i_pupils;
        int256 i_mouths;
        int256 i_whiskers;
        int256 fhy;
        int256 tplx;
        int256 tply;
        int256 chkx;
        int256 chky;
        int256 chny;
        int256 chkc_100;
        int256 chko_100;
        int256 chnc_100;
        int256 chno_100;
        int256 bw_100;
        int256 eeo_100;
        int256 eso_100;
        int256 etox;
        int256 etoy;
        int256 eb_100;
        int256 ebr_100;
        int256 esc_100;
        int256 etc_100;
        int256 eec_100;
        int256 eitc_100;
        int256 esi_100;
        int256 eti_100;
        int256 eei_100;
        int256 eito_100;
        int256 eyox;
        int256 eyoy;
        int256 eyw;
        int256 eyt;
        int256 eyb;
        int256 eyr_100;
        int256 eypox;
        int256 eypoy;
        int256 no;
        int256 eypw;
        int256 eyph;
        int256 mh;
        int256 mox;
        int256 moy;
        int256 mc_100;
        int256 tngo_100;
        int256 tng;
        int256 whl;
        int256 wha_100;
        int256 whox;
        int256 whoy;
        int256 wheox;
        int256 wheoy;
        int256 whc_100;
        int256 c_bg;
        int256 c_body;
        int256 c_neck;
        int256 c_face;
        int256 c_prim;
        int256 c_sec;
        int256 c_ear;
        int256 c_earIn;
        int256 c_eyeline;
        int256 c_nose;
        int256 c_noseIn;
        int256 c_mouth;
        int256 c_whiskers;
        int256 c_eye;
        int256 bodyParts;
        int256 faceParts;
        bool bodyParts_tabby;
        bool bodyParts_belly;
        bool bodyParts_necktie;
        bool bodyParts_corners;
        bool bodyParts_stripes;
        bool faceParts_mask;
        bool faceParts_round;
        bool faceParts_nose;
        bool faceParts_chin;
        bool faceParts_triangle;
        bool faceParts_whiskers;
        bool faceParts_ear;
        bool faceParts_temple;
        bool hasTabbyFaceParts;
        bool faceParts_tabbyForehead;
        bool faceParts_tabbyCheeks;
        bool hasWhiskers;
        bool hasTongue;
        int256 c_background;
        int256 c_markA;
        int256 c_markB;
        int256 c_neckShadow;
        int256 c_whiskersShadow;
        int256 c_tongue;
        int256 c_tongueLine;
        int256 c_bodyMain;
        int256 c_cornerRight;
        int256 c_cornerLeft;
        int256 c_faceMain;
        int256 c_maskA;
        int256 c_maskB;
        int256 c_temple;
        int256 c_earA;
        int256 c_earB;
        int256 TRANSPARENT;
        int256 c_pupil;
        int256 c_glare;
        int256 c_eyeRight;
        int256 c_eyeLeft;
        int256 c_shadow;
        int256 c_mouthOpenBack;
        int256 nsx;
        int256 nsy;
        int256 fa0x;
        int256 fa0y;
        int256 fa1x;
        int256 fa1y;
        int256 fa2x;
        int256 fa2y;
        int256 fa3x;
        int256 fa3y;
        int256 fm0x;
        int256 fm0y;
        int256 fm1x;
        int256 fm1y;
        int256 fm2x;
        int256 fm2y;
        int256 n0;
        int256 n1;
        int256 n2;
        int256 fn0x;
        int256 fn0y;
        int256 fn1x;
        int256 fn1y;
        int256 fn2x;
        int256 fn2y;
        int256 fn3x;
        int256 fn3y;
        int256 fc0x;
        int256 fc0y;
        int256 fc1x;
        int256 fc1y;
        int256 fc2x;
        int256 fc2y;
        int256 fc3x;
        int256 fc3y;
        int256 fc4x;
        int256 fc4y;
        int256 fc5x;
        int256 fc5y;
        int256 bx;
        int256 by;
        int256 ea0x;
        int256 ea0y;
        int256 ea3x;
        int256 ea3y;
        int256 earTipx;
        int256 earTipy;
        int256 ea1x;
        int256 ea1y;
        int256 ea2x;
        int256 ea2y;
        int256 ei0x;
        int256 ei0y;
        int256 ei3x;
        int256 ei3y;
        int256 earMidx;
        int256 earMidy;
        int256 eitx;
        int256 eity;
        int256 ei1x;
        int256 ei1y;
        int256 ei2x;
        int256 ei2y;
        int256 em0x;
        int256 em0y;
        int256 em1x;
        int256 em1y;
        int256 em2x;
        int256 em2y;
        int256 en0x;
        int256 en0y;
        int256 en1x;
        int256 en1y;
        int256 en2x;
        int256 en2y;
        int256 ec0x;
        int256 ec0y;
        int256 ec1x;
        int256 ec1y;
        int256 ec2x;
        int256 ec2y;
        int256 ec3x;
        int256 ec3y;
        int256 ec4x;
        int256 ec4y;
        int256 ec5x;
        int256 ec5y;
        int256 eim0x;
        int256 eim0y;
        int256 eim1x;
        int256 eim1y;
        int256 eim2x;
        int256 eim2y;
        int256 en0bx;
        int256 en0by;
        int256 en1bx;
        int256 en1by;
        int256 en2bx;
        int256 en2by;
        int256 eic0x;
        int256 eic0y;
        int256 eic1x;
        int256 eic1y;
        int256 eic2x;
        int256 eic2y;
        int256 eic3x;
        int256 eic3y;
        int256 eic4x;
        int256 eic4y;
        int256 eic5x;
        int256 eic5y;
        int256 blinkAmt;
        int256 petAmt;
        int256 eya0x;
        int256 eya0y;
        int256 eya1x;
        int256 eya1y;
        int256 eya2x;
        int256 eya2y;
        int256 eya3x;
        int256 eya3y;
        int256 eyc0x;
        int256 eyc0y;
        int256 eyc1x;
        int256 eyc1y;
        int256 eyc2x;
        int256 eyc2y;
        int256 eyc3x;
        int256 eyc3y;
        int256 eyc4x;
        int256 eyc4y;
        int256 eyc5x;
        int256 eyc5y;
        int256 eyc6x;
        int256 eyc6y;
        int256 eyc7x;
        int256 eyc7y;
        int256 ncrv_100;
        int256 na0x;
        int256 na0y;
        int256 na1x;
        int256 na1y;
        int256 na2x;
        int256 na2y;
        int256 nm0x;
        int256 nm0y;
        int256 nm1x;
        int256 nm1y;
        int256 nm2x;
        int256 nm2y;
        int256 nn0x;
        int256 nn0y;
        int256 nn1x;
        int256 nn1y;
        int256 nn2x;
        int256 nn2y;
        int256 nc0x;
        int256 nc0y;
        int256 nc1x;
        int256 nc1y;
        int256 nc2x;
        int256 nc2y;
        int256 nc3x;
        int256 nc3y;
        int256 nc4x;
        int256 nc4y;
        int256 nc5x;
        int256 nc5y;
        int256 ni0x;
        int256 ni0y;
        int256 ni3x;
        int256 ni3y;
        int256 ni1x;
        int256 ni1y;
        int256 ni2x;
        int256 ni2y;
        int256 m0x;
        int256 m0y;
        int256 m3x;
        int256 m3y;
        int256 mmx;
        int256 mmy;
        int256 mnx;
        int256 mny;
        int256 m1x;
        int256 m1y;
        int256 m2x;
        int256 m2y;
        int256 wa0x;
        int256 wa0y;
        int256 wa1x;
        int256 wa1y;
        int256 wmx;
        int256 wmy;
        int256 wnx;
        int256 wny;
        int256 wc0x;
        int256 wc0y;
        int256 wc1x;
        int256 wc1y;
        int256 tw;
        int256 br;
        int256 nw;
        int256 crx;
        int256 cry;
        int256 sc;
        int256 stripeX;
        int256 stripeY;
        int256 tabbyBodyOffsetX;
        int256 tabbyBodyOffsetY;
        int256 eysl;
        int256 eysr;
        string var_001;
        string var_002;
        string var_003;
        string var_004;
        string var_005;
        string var_006;
        string var_007;
        string var_008;
        string var_009;
        string var_010;
        string var_011;
        string var_012;
        string var_013;
        string var_014;
        string var_015;
        string var_016;
        string var_017;
        string var_018;
        string var_019;
        string var_020;
        string var_021;
        string var_022;
        string var_023;
        string var_024;
        string var_025;
        string var_026;
        string var_027;
        string var_028;
        string var_029;
        string var_030;
        string var_031;
        string var_032;
        string var_033;
        string var_034;
        string var_035;
        string var_036;
        string var_037;
        string var_038;
        string var_039;
        string var_040;
        string var_041;
        string var_042;
        string var_043;
        string var_044;
        string var_045;
        string var_046;
        string var_047;
        string var_048;
        string var_049;
        string var_050;
        string var_051;
        string var_052;
        string var_053;
        string var_054;
        string var_055;
        string var_056;
        string var_057;
        string var_058;
        string var_059;
        string var_060;
        string var_061;
        string var_062;
        string var_063;
        string var_064;
        string var_065;
        string var_066;
        string var_067;
        string var_068;
        string var_069;
        string var_070;
        string var_071;
        string var_072;
        string var_073;
        string var_074;
        string var_075;
        string var_076;
        string var_077;
        string var_078;
        string var_079;
        string var_080;
        string var_081;
        string var_082;
        string var_083;
        string var_084;
        string var_085;
        string var_086;
        string var_087;
        string var_088;
        string var_089;
        string var_090;
        string var_091;
        string var_092;
        string var_093;
        string var_094;
        string var_095;
        string var_096;
        string var_097;
        string var_098;
        string var_099;
        string var_100;
        string var_101;
        string var_102;
        string var_103;
        string var_104;
        string var_105;
        string var_106;
        string var_107;
        string var_108;
        string var_109;
        string var_110;
        string var_111;
        string var_112;
        string var_113;
        string var_114;
        string var_115;
        string var_116;
        string var_117;
        string var_118;
        string var_119;
        string var_120;
        string var_121;
        string var_122;
        string var_123;
        string var_124;
        string var_125;
        string var_126;
        string var_127;
        string var_128;
        string var_129;
        string var_130;
        string var_131;
        string var_132;
        string var_133;
        string var_134;
        string var_135;
        string var_136;
        string var_137;
        string var_138;
        string var_139;
        string var_140;
        string var_141;
        string var_142;
        string var_143;
        string var_144;
        string var_145;
        string var_146;
        string var_147;
        string var_148;
        string var_149;
        string var_150;
        string var_151;
        string var_152;
    }
    


    // Generate svg
    function generateSvg(uint256 hashcode) public pure returns (string memory) {
        State memory s;


         // rvsValues

        s.rvs_breed =                   int(hashcode >> 0x00 & 0xff);
        s.rvs_bodyParts =               int(hashcode >> 0x08 & 0xff);
        s.rvs_faceParts =               int(hashcode >> 0x10 & 0xff);
        s.rvs_palette =                 int(hashcode >> 0x18 & 0xff);
        s.rvs_head =                    int(hashcode >> 0x20 & 0xff);
        s.rvs_ear =                     int(hashcode >> 0x28 & 0xff);
        s.rvs_eyes =                    int(hashcode >> 0x30 & 0xff);
        s.rvs_pupils =                  int(hashcode >> 0x38 & 0xff);
        s.rvs_mouth =                   int(hashcode >> 0x40 & 0xff);
        s.rvs_whiskers =                int(hashcode >> 0x48 & 0xff);
        s.rvs_flipFaceMarks =           int(hashcode >> 0x50 & 0xff);
        s.rvs_swapMarkColors =          int(hashcode >> 0x58 & 0xff);
        s.rvs_heterochromia =           int(hashcode >> 0x60 & 0xff);
        s.rvs_eyeColor =                int(hashcode >> 0x68 & 0xff);
        s.rvs_eyeSwap =                 int(hashcode >> 0x70 & 0xff);
        s.rvs_tabbyFacePartsAndTongue = int(hashcode >> 0x78 & 0xff);
    

//         // Temp vars
//         s._p = 0;
//         s._dataBitSize = 0;
//         s._lastValue = 0;
//         s._lastLength = 0;

//         // Shared data
//         bytes memory data = hex'000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000001000100010201000100000100010000010301000003020201010100000000000101000000000000000001000002000000030006000202000301020051a19654326876543218007a050419829876543219865432170079010112103d161832d5f80311102c161832c4f703112103b10101b3060211210371802602000513011210361c126100043b003151876410665404000303112103432398765432197654321700f20311210311cba0460200011301132104019876543210a65404000003';

//         // Breed Modifiers
//         s.heterochromia =  s.rvs_heterochromia < 13;
        
//         // Breed Data
//         s._p = 
//               s.rvs_breed < 51 ? P_breeds_black
//             : s.rvs_breed < 77 ? P_breeds_white
//             : s.rvs_breed < 177 ? P_breeds_tabby
//             : s.rvs_breed < 197 ? P_breeds_shorthair
//             : s.rvs_breed < 214 ? P_breeds_calico
//             : s.rvs_breed < 224 ? P_breeds_siamese
//             : s.rvs_breed < 229 ? P_breeds_sphynx
//             : s.rvs_breed < 234 ? P_breeds_sandcat
//             : s.rvs_breed < 239 ? P_breeds_toyger
//             : s.rvs_breed < 251 ? P_breeds_alien
//             : P_breeds_zombie
//         ;

//         s._dataBitSize = 4;
//         s.b_tabbyFaceOdds = nextData(data,s) * int(16);
//         s.i_heads = nextData(data,s) > 0 ? s._lastValue + int(12) : s.rvs_head % (L_heads - 3);
//         s.i_ears = nextData(data,s) > 0 ? s._lastValue : s.rvs_ear % (L_ears  - 3);
//         s.i_body = nextDataArraySelection(data,s, s.rvs_bodyParts);
//         s.i_face = nextDataArraySelection(data,s, s.rvs_faceParts);
//         s.i_palettes = nextDataArraySelection(data,s, s.rvs_palette);

//         s.i_eyeColorsMain = nextDataArraySelection(data,s, s.rvs_eyeColor);
//         s.i_eyeColorsH2 = nextDataArraySelection(data,s,s.rvs_eyeColor);
        
//         s.i_eyeColorsA = s._lastLength > 1 && s.heterochromia ? int(0) : s.i_eyeColorsMain;
//         s.i_eyeColorsB = s._lastLength > 1 && s.heterochromia ? s.i_eyeColorsH2 : s.i_eyeColorsMain;

//         s._dataBitSize = 1;
//         s.f_whiskers = nextData(data,s) > 0;
//         s.f_tongue = nextData(data,s) > 0;
//         s.f_zombieEyes = nextData(data,s) > 0;
//         s.f_swapMarkColors = nextData(data,s) > 0;
//         s.f_useBodyColorForCorner = nextData(data,s) > 0;
//         s.f_calico = nextData(data,s) > 0;
        

//         // Swap Flags
//         s.flipFaceMarks =  s.rvs_flipFaceMarks < 128;
//         s.swapMarkColors = s.rvs_swapMarkColors < 128 && s.f_swapMarkColors;
//         s.eyeSwap =       s.rvs_eyeSwap < 128;

//         // Part Selections
//         s.i_eyes = s.rvs_eyes % L_eyes;
//         s.i_pupils = s.rvs_pupils % L_pupils;
//         s.i_mouths = s.rvs_mouth % L_mouths;
//         s.i_whiskers = s.rvs_whiskers % L_whiskers;

        
//         // heads data
//         s._p = P_heads_round; // item[0]
//         s._dataBitSize = 2;
//         s._p = nextDataArraySelection(data,s, s.i_heads);
//         s.fhy = nextDataWithBitSize(data,s,0) + int(-55);
//         s.tplx = nextDataWithBitSize(data,s,0) + int(70);
//         s.tply = nextDataWithBitSize(data,s,0) + int(-30);
//         s.chkx = nextDataWithBitSize(data,s,0) + int(68);
//         s.chky = nextDataWithBitSize(data,s,0) + int(20);
//         s.chny = nextDataWithBitSize(data,s,0) + int(79);
//         s.chkc_100 = nextDataWithBitSize(data,s,0) + int(-60);
//         s.chko_100 = nextDataWithBitSize(data,s,0);
//         s.chnc_100 = nextDataWithBitSize(data,s,0) + int(-100);
//         s.chno_100 = nextDataWithBitSize(data,s,0) + int(6);
//         s.bw_100 = nextDataWithBitSize(data,s,0) + int(45);
//         s.eeo_100 = nextDataWithBitSize(data,s,0);
        

        
//         // ears data
//         s._p = P_ears_plain; // item[0]
//         s._dataBitSize = 2;
//         s._p = nextDataArraySelection(data,s, s.i_heads);
//         s.eso_100 = nextDataWithBitSize(data,s,0) + int(23);
//         s.etox = nextDataWithBitSize(data,s,0) + int(-41);
//         s.etoy = nextDataWithBitSize(data,s,0) + int(39);
//         s.eb_100 = nextDataWithBitSize(data,s,0);
//         s.ebr_100 = nextDataWithBitSize(data,s,0) + int(-50);
//         s.esc_100 = nextDataWithBitSize(data,s,0) + int(-4);
//         s.etc_100 = nextDataWithBitSize(data,s,0) + int(3);
//         s.eec_100 = nextDataWithBitSize(data,s,0) + int(-24);
//         s.eitc_100 = nextDataWithBitSize(data,s,0) + int(-34);
//         s.esi_100 = nextDataWithBitSize(data,s,0) + int(18);
//         s.eti_100 = nextDataWithBitSize(data,s,0) + int(63);
//         s.eei_100 = nextDataWithBitSize(data,s,0) + int(6);
//         s.eito_100 = nextDataWithBitSize(data,s,0) + int(-405);
        

        
//         // eyes data
//         s._p = P_eyes_round; // item[0]
//         s._dataBitSize = 2;
//         s._p = nextDataArraySelection(data,s, s.i_heads);
//         s.eyox = nextDataWithBitSize(data,s,0) + int(37);
//         s.eyoy = nextDataWithBitSize(data,s,0) + int(1);
//         s.eyw = nextDataWithBitSize(data,s,0) + int(19);
//         s.eyt = nextDataWithBitSize(data,s,0) + int(-3);
//         s.eyb = nextDataWithBitSize(data,s,0) + int(2);
//         s.eyr_100 = nextDataWithBitSize(data,s,0) + int(-64);
//         s.eypox = nextDataWithBitSize(data,s,0) + int(-8);
//         s.eypoy = nextDataWithBitSize(data,s,0) + int(-8);
//         s.no = nextDataWithBitSize(data,s,0) + int(-13);
        

        
//         // pupils data
//         s._p = P_pupils_thin; // item[0]
//         s._dataBitSize = 0;
//         s._p = nextDataArraySelection(data,s, s.i_heads);
//         s.eypw = nextDataWithBitSize(data,s,0) + int(7);
//         s.eyph = nextDataWithBitSize(data,s,0) + int(13);
        

        
//         // mouths data
//         s._p = P_mouths_neutral; // item[0]
//         s._dataBitSize = 2;
//         s._p = nextDataArraySelection(data,s, s.i_heads);
//         s.mh = nextDataWithBitSize(data,s,0) + int(8);
//         s.mox = nextDataWithBitSize(data,s,0) + int(5);
//         s.moy = nextDataWithBitSize(data,s,0) + int(-2);
//         s.mc_100 = nextDataWithBitSize(data,s,0) + int(-17);
//         s.tngo_100 = nextDataWithBitSize(data,s,0) + int(-50);
//         s.tng = nextDataWithBitSize(data,s,0);
        

        
//         // whiskers data
//         s._p = P_whiskers_downward; // item[0]
//         s._dataBitSize = 2;
//         s._p = nextDataArraySelection(data,s, s.i_heads);
//         s.whl = nextDataWithBitSize(data,s,0) + int(3);
//         s.wha_100 = nextDataWithBitSize(data,s,0) + int(18);
//         s.whox = nextDataWithBitSize(data,s,0) + int(7);
//         s.whoy = nextDataWithBitSize(data,s,0) + int(4);
//         s.wheox = nextDataWithBitSize(data,s,0) + int(100);
//         s.wheoy = nextDataWithBitSize(data,s,0);
//         s.whc_100 = nextDataWithBitSize(data,s,0) + int(-18);
        

        
//         // palettes data
//         s._p = P_palettes_black; // item[0]
//         s._dataBitSize = 78;
//         s._p = nextDataArraySelection(data,s, s.i_heads);
//         s.c_bg = nextDataWithBitSize(data,s,24);
//         s.c_body = nextDataWithBitSize(data,s,24);
//         s.c_neck = nextDataWithBitSize(data,s,24);
//         s.c_face = nextDataWithBitSize(data,s,24);
//         s.c_prim = nextDataWithBitSize(data,s,24);
//         s.c_sec = nextDataWithBitSize(data,s,24);
//         s.c_ear = nextDataWithBitSize(data,s,24);
//         s.c_earIn = nextDataWithBitSize(data,s,24);
//         s.c_eyeline = nextDataWithBitSize(data,s,24);
//         s.c_nose = nextDataWithBitSize(data,s,24);
//         s.c_noseIn = nextDataWithBitSize(data,s,24);
//         s.c_mouth = nextDataWithBitSize(data,s,24);
//         s.c_whiskers = nextDataWithBitSize(data,s,24);
        

        
//         // eyeColors data
//         s._p = P_eyeColors_blue; // item[0]
//         s._dataBitSize = 6;
//         s._p = nextDataArraySelection(data,s, s.i_heads);
//         s.c_eye = nextDataWithBitSize(data,s,24);
        
// int c_eyeA = 0;
// int c_eyeB = 0;
// int _rMod = 0;

        
    

        
//             _rMod = s.i_body % 9;
//             s.bodyParts = _rMod == 0 ? int(0x0)
//                 : _rMod == 1 ? int(0x1)
//                 : _rMod == 2 ? int(0x3)
//                 : _rMod == 3 ? int(0x5)
//                 : _rMod == 4 ? int(0x2)
//                 : _rMod == 5 ? int(0x4)
//                 : _rMod == 6 ? int(0x8)
//                 : _rMod == 7 ? int(0x10)
//                 : /* _rMod == 8 ? */ int(0x9);
        
//             _rMod = s.i_face % 13;
//             s.faceParts = _rMod == 0 ? int(0x0)
//                 : _rMod == 1 ? int(0x1)
//                 : _rMod == 2 ? int(0x2)
//                 : _rMod == 3 ? int(0x6)
//                 : _rMod == 4 ? int(0xc)
//                 : _rMod == 5 ? int(0x10)
//                 : _rMod == 6 ? int(0x30)
//                 : _rMod == 7 ? int(0x20)
//                 : _rMod == 8 ? int(0x24)
//                 : _rMod == 9 ? int(0x28)
//                 : _rMod == 10 ? int(0x40)
//                 : _rMod == 11 ? int(0x80)
//                 : /* _rMod == 12 ? */ int(0xc0);

//         s.bodyParts_tabby =    0 < s.bodyParts & 0x1;
//         s.bodyParts_belly =    0 < s.bodyParts & 0x2;
//         s.bodyParts_necktie =  0 < s.bodyParts & 0x4;
//         s.bodyParts_corners =  0 < s.bodyParts & 0x8;
//         s.bodyParts_stripes =  0 < s.bodyParts & 0x10;
//         s.faceParts_mask =     0 < s.faceParts & 0x1;
//         s.faceParts_round =    0 < s.faceParts & 0x2;
//         s.faceParts_nose =     0 < s.faceParts & 0x4;
//         s.faceParts_chin =     0 < s.faceParts & 0x8;
//         s.faceParts_triangle = 0 < s.faceParts & 0x10;
//         s.faceParts_whiskers = 0 < s.faceParts & 0x20;
//         s.faceParts_ear =      0 < s.faceParts & 0x40;
//         s.faceParts_temple =   0 < s.faceParts & 0x80;

//         s.hasTabbyFaceParts = s.rvs_tabbyFacePartsAndTongue <= s.b_tabbyFaceOdds;
//         s.faceParts_tabbyForehead = s.hasTabbyFaceParts;
//         s.faceParts_tabbyCheeks =   s.hasTabbyFaceParts;

//         s.hasWhiskers = s.f_whiskers;
//         s.hasTongue = s.f_tongue && s.tng>0 && s.rvs_tabbyFacePartsAndTongue < 18;
    

//         s.c_background = s.c_bg;
//         s.c_markA = s.swapMarkColors ?  s.c_sec : s.c_prim;
//         s.c_markB =  s.swapMarkColors ?  s.c_prim : s.c_sec;
//         s.c_neckShadow = s.c_neck;
//         s.c_whiskersShadow = 0x505050;
//         s.c_tongue =     0xDB7093;
//         s.c_tongueLine = 0xE38FAB;
//         s.c_bodyMain =     s.bodyParts_corners && !s.f_useBodyColorForCorner ? s.c_markA : s.c_body;
//         s.c_cornerRight =  s.bodyParts_corners &&  s.f_useBodyColorForCorner ? s.c_markA : s.c_body;
//         s.c_cornerLeft =   s.bodyParts_corners &&  s.f_calico                ? s.c_markB : s.c_cornerRight;
//         s.c_faceMain =        s.faceParts_mask && !s.f_calico                ? s.c_markA : s.c_face;
//         s.c_maskA =           s.faceParts_mask &&  s.f_calico                ? s.c_markA : s.c_face;
//         s.c_maskB =           s.faceParts_mask &&  s.f_calico                ? s.c_markB : s.c_face;
//         s.c_temple =                             s.f_calico                ? s.c_markB : s.c_markA;
//         s.c_earA =                               s.f_calico                ? s.c_markA : s.faceParts_ear ? s.c_markA : s.c_ear;
//         s.c_earB =                               s.f_calico                ? s.c_markB : s.faceParts_temple ? s.c_temple : s.c_ear;
//         s.TRANSPARENT = 0xFFFFFF00;
//         s.c_pupil = s.f_zombieEyes ? int(0xFFFFFF) : int(0x000000);
//         s.c_glare = s.f_zombieEyes ? s.TRANSPARENT   : int(0xFFFFFF);
//         s.c_eyeRight = s.eyeSwap ? c_eyeB : c_eyeA;
//         s.c_eyeLeft = s.eyeSwap ? c_eyeA : c_eyeB;

//         // In svg
//         s.c_shadow = 0x00000080;
//         s.c_mouthOpenBack = 0x333333;
    

        
        // // Shape Calculations

        // s.nsx = 9;
        // s.nsy = 11;
        // s.fa0x = 0;
        // s.fa0y = s.fhy;
        // s.fa1x = s.tplx;
        // s.fa1y = s.tply;
        // s.fa2x = s.chkx;
        // s.fa2y = s.chky;
        // s.fa3x = 0;
        // s.fa3y = s.chny;
        // s.fm0x = average(s.fa0x,s.fa1x);
        // s.fm0y = average(s.fa0y,s.fa1y);
        // s.fm1x = average(s.fa1x,s.fa2x);
        // s.fm1y = average(s.fa1y,s.fa2y);
        // s.fm2x = average(s.fa2x,s.fa3x);
        // s.fm2y = average(s.fa2y,s.fa3y);
        // s.n0 = 100 * (s.fm0y - s.fa0y) / (s.fa1x - s.fa0x);
        // s.n1 = s.chkc_100;
        // s.n2 = s.chnc_100 * (s.fm2y - s.fa2y) / (s.fa3x - s.fa2x);
        // s.fn0x = s.fm0x + s.n0 / 100 * (s.fa1y - s.fa0y);
        // s.fn0y = s.fm0y - s.n0 / 100 * (s.fa1x - s.fa0x);
        // s.fn1x = s.fm1x + s.n1 / 100 * (s.fa2y - s.fa1y);
        // s.fn1y = s.fm1y - s.n1 / 100 * (s.fa2x - s.fa1x);
        // s.fn2x = s.fm1x - s.n1 / 100 * (s.fa2y - s.fa1y);
        // s.fn2y = s.fm1y + s.n1 / 100 * (s.fa2x - s.fa1x);
        // s.fn3x = s.fm2x + s.n2 / 100 * (s.fa3y - s.fa2y);
        // s.fn3y = s.fm2y - s.n2 / 100 * (s.fa3x - s.fa2x);
        // s.fc0x = s.fa1x * 4 / 10;
        // s.fc0y = s.fa0y;
        // s.fc1x = average(s.fa1x,s.fn0x);
        // s.fc1y = average(s.fa1y,s.fn0y);
        // s.fc2x = average(s.fa1x, lerp(s.fn1x, s.fn2x, s.chko_100));
        // s.fc2y = average(s.fa1y, lerp(s.fn1y, s.fn2y, s.chko_100));
        // s.fc3x = average(s.fa2x, s.fn1x);
        // s.fc3y = average(s.fa2y, s.fn1y);
        // s.fc4x = average(s.fa2x,s.fn3x);
        // s.fc4y = average(s.fa2y,s.fn3y);
        // s.fc5x = s.fa2x * s.chno_100 / 100;
        // s.fc5y = s.fa3y;

        // s.bx = bezierPoint(s.fa2x, s.fc4x, s.fc5x, s.fa3x, s.bw_100);
        // s.by = bezierPoint(s.fa2y, s.fc4y, s.fc5y, s.fa3y, s.bw_100);

        // s.ea0x = bezierPoint(s.fa0x, s.fc0x, s.fc1x, s.fa1x, s.eso_100);
        // s.ea0y = bezierPoint(s.fa0y, s.fc0y, s.fc1y, s.fa1y, s.eso_100);
        // s.ea3x = bezierPoint(s.fa1x, s.fc1x, s.fc0x, s.fa0x, s.eeo_100);
        // s.ea3y = bezierPoint(s.fa1y, s.fc1y, s.fc0y, s.fa0y, s.eeo_100);
        // s.earTipx = s.ea3x + s.etox;
        // s.earTipy = s.ea3y - s.etoy;
        // s.ea1x = lerp(s.earTipx,s.ea0x,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 * -constrain(s.ebr_100, -100, 0) / 100);
        // s.ea1y = lerp(s.earTipy,s.ea0y,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 * -constrain(s.ebr_100, -100, 0) / 100);
        // s.ea2x = lerp(s.earTipx,s.ea3x,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 *  constrain(s.ebr_100,  0, 100) / 100);
        // s.ea2y = lerp(s.earTipy,s.ea3y,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 *  constrain(s.ebr_100,  0, 100) / 100);
        // s.ei0x = lerp(s.ea0x, s.ea3x, s.esi_100);
        // s.ei0y = lerp(s.ea0y, s.ea3y, s.esi_100);
        // s.ei3x = lerp(s.ea0x, s.ea3x, 100 - s.eei_100);
        // s.ei3y = lerp(s.ea0y, s.ea3y, 100 - s.eei_100);
        // s.earMidx = average(s.ei0x,s.ei3x);
        // s.earMidy = average(s.ei0y,s.ei3y);
        // s.eitx = lerp(s.earMidx,s.earTipx,s.eti_100) + s.eito_100 / 100;
        // s.eity = lerp(s.earMidy,s.earTipy,s.eti_100);
        // s.ei1x = lerp(s.eitx,s.ei0x,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 * -constrain(s.ebr_100, -100, 0) / 100);
        // s.ei1y = lerp(s.eity,s.ei0y,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 * -constrain(s.ebr_100, -100, 0) / 100);
        // s.ei2x = lerp(s.eitx,s.ei3x,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 *  constrain(s.ebr_100, 0, 100) / 100);
        // s.ei2y = lerp(s.eity,s.ei3y,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 *  constrain(s.ebr_100, 0, 100) / 100);
        // s.em0x = average(s.ea0x,s.ea1x);
        // s.em0y = average(s.ea0y,s.ea1y);
        // s.em1x = average(s.ea1x,s.ea2x);
        // s.em1y = average(s.ea1y,s.ea2y);
        // s.em2x = average(s.ea2x,s.ea3x);
        // s.em2y = average(s.ea2y,s.ea3y);
        // s.en0x = s.em0x + s.esc_100 / 100 * (s.ea1y - s.ea0y);
        // s.en0y = s.em0y - s.esc_100 / 100 * (s.ea1x - s.ea0x);
        // s.en1x = s.em1x + s.etc_100 / 100 * (s.ea2y - s.ea1y);
        // s.en1y = s.em1y - s.etc_100 / 100 * (s.ea2x - s.ea1x);
        // s.en2x = s.em2x + s.eec_100 / 100 * (s.ea3y - s.ea2y);
        // s.en2y = s.em2y - s.eec_100 / 100 * (s.ea3x - s.ea2x);
        // s.ec0x = average(s.ea0x,s.en0x);
        // s.ec0y = average(s.ea0y,s.en0y);
        // s.ec1x = average(s.ea1x,s.en0x);
        // s.ec1y = average(s.ea1y,s.en0y);
        // s.ec2x = average(s.ea1x,s.en1x);
        // s.ec2y = average(s.ea1y,s.en1y);
        // s.ec3x = average(s.ea2x,s.en1x);
        // s.ec3y = average(s.ea2y,s.en1y);
        // s.ec4x = average(s.ea2x,s.en2x);
        // s.ec4y = average(s.ea2y,s.en2y);
        // s.ec5x = average(s.ea3x,s.en2x);
        // s.ec5y = average(s.ea3y,s.en2y);
        // s.eim0x = average(s.ei0x,s.ei1x);
        // s.eim0y = average(s.ei0y,s.ei1y);
        // s.eim1x = average(s.ei1x,s.ei2x);
        // s.eim1y = average(s.ei1y,s.ei2y);
        // s.eim2x = average(s.ei2x,s.ei3x);
        // s.eim2y = average(s.ei2y,s.ei3y);
        // s.en0bx = s.eim0x + s.esc_100 / 100 * (s.ei1y - s.ei0y);
        // s.en0by = s.eim0y - s.esc_100 / 100 * (s.ei1x - s.ei0x);
        // s.en1bx = s.eim1x + s.eitc_100 / 100 * (s.ei2y - s.ei1y);
        // s.en1by = s.eim1y - s.eitc_100 / 100 * (s.ei2x - s.ei1x);
        // s.en2bx = s.eim2x + s.eec_100 / 100 * (s.ei3y - s.ei2y);
        // s.en2by = s.eim2y - s.eec_100 / 100 * (s.ei3x - s.ei2x);
        // s.eic0x = average(s.ei0x,s.en0bx);
        // s.eic0y = average(s.ei0y,s.en0by);
        // s.eic1x = average(s.ei1x,s.en0bx);
        // s.eic1y = average(s.ei1y,s.en0by);
        // s.eic2x = average(s.ei1x,s.en1bx);
        // s.eic2y = average(s.ei1y,s.en1by);
        // s.eic3x = average(s.ei2x,s.en1bx);
        // s.eic3y = average(s.ei2y,s.en1by);
        // s.eic4x = average(s.ei2x,s.en2bx);
        // s.eic4y = average(s.ei2y,s.en2by);
        // s.eic5x = average(s.ei3x,s.en2bx);
        // s.eic5y = average(s.ei3y,s.en2by);

        // s.blinkAmt = 0;
        // s.petAmt = 0;

        // s.eya0x = -s.eyw;
        // s.eya0y = 0;
        // s.eya1x = 0;
        // s.eya1y = lerp(-s.eyt, s.eyb, s.blinkAmt);
        // s.eya2x = s.eyw;
        // s.eya2y = 0;
        // s.eya3x = 0;
        // s.eya3y = lerp(s.eyb, -s.eyt, s.petAmt);
        // s.eyc0x = s.eya0x;
        // s.eyc0y = s.eya1y / 2;
        // s.eyc1x = s.eya0x / 2;
        // s.eyc1y = s.eya1y;
        // s.eyc2x = s.eya2x / 2;
        // s.eyc2y = s.eya1y;
        // s.eyc3x = s.eya2x;
        // s.eyc3y = s.eya1y / 2;
        // s.eyc4x = s.eya2x;
        // s.eyc4y = s.eya3y / 2;
        // s.eyc5x = s.eya2x / 2;
        // s.eyc5y = s.eya3y;
        // s.eyc6x = s.eya0x / 2;
        // s.eyc6y = s.eya3y;
        // s.eyc7x = s.eya0x;
        // s.eyc7y = s.eya3y / 2;


        // s.ncrv_100 = 20;
        // s.na0x = 0;
        // s.na0y = 37 + s.no;
        // s.na1x = -s.nsx;
        // s.na1y = s.na0y - s.nsy;
        // s.na2x = s.nsx;
        // s.na2y = s.na0y - s.nsy;
        // s.nm0x = average(s.na0x,s.na1x);
        // s.nm0y = average(s.na0y,s.na1y);
        // s.nm1x = average(s.na1x,s.na2x);
        // s.nm1y = average(s.na1y,s.na2y);
        // s.nm2x = average(s.na2x,s.na0x);
        // s.nm2y = average(s.na2y,s.na0y);
        // s.nn0x = s.nm0x + s.ncrv_100 / 100 * (s.na1y - s.na0y);
        // s.nn0y = s.nm0y - s.ncrv_100 / 100 * (s.na1x - s.na0x);
        // s.nn1x = s.nm1x + s.ncrv_100 / 100 * (s.na2y - s.na1y);
        // s.nn1y = s.nm1y - s.ncrv_100 / 100 * (s.na2x - s.na1x);
        // s.nn2x = s.nm2x + s.ncrv_100 / 100 * (s.na0y - s.na2y);
        // s.nn2y = s.nm2y - s.ncrv_100 / 100 * (s.na0x - s.na2x);
        // s.nc0x = average(s.na0x,s.nn0x);
        // s.nc0y = average(s.na0y,s.nn0y);
        // s.nc1x = average(s.na1x,s.nn0x);
        // s.nc1y = average(s.na1y,s.nn0y);
        // s.nc2x = average(s.na1x,s.nn1x);
        // s.nc2y = average(s.na1y,s.nn1y);
        // s.nc3x = average(s.na2x,s.nn1x);
        // s.nc3y = average(s.na2y,s.nn1y);
        // s.nc4x = average(s.na2x,s.nn2x);
        // s.nc4y = average(s.na2y,s.nn2y);
        // s.nc5x = average(s.na0x,s.nn2x);
        // s.nc5y = average(s.na0y,s.nn2y);
        // s.ni0x = bezierPoint(s.na0x, s.nc0x, s.nc1x, s.na1x, 20);
        // s.ni0y = bezierPoint(s.na0y, s.nc0y, s.nc1y, s.na1y, 20);
        // s.ni3x = bezierPoint(s.na0x, s.nc0x, s.nc1x, s.na1x, 80);
        // s.ni3y = bezierPoint(s.na0y, s.nc0y, s.nc1y, s.na1y, 80);
        // s.ni1x = s.ni0x + 1;
        // s.ni1y = s.ni0y - s.nsx * 4 / 10;
        // s.ni2x = s.ni0x + s.nsx * 4 / 10;
        // s.ni2y = s.ni0y - s.nsy * 6 / 10;
        // s.m0x = 0;

        // s.m0y = constrain(s.na0y + s.mh, s.na0y, s.fa3y);
        // s.m3x = s.mox;
        // s.m3y = constrain(s.m0y + s.moy, s.na0y, s.fa3y);
        // s.mmx = average(s.m0x,s.m3x);
        // s.mmy = average(s.m0y,s.m3y);
        // s.mnx = s.mmx - s.mc_100 / 100 * (s.m3y - s.m0y);
        // s.mny = s.mmy + s.mc_100 / 100 * (s.m3x - s.m0x);
        // s.m1x = average(s.m0x,s.mnx);
        // s.m1y = average(s.m0y,s.mny);
        // s.m2x = average(s.m3x,s.mnx);
        // s.m2y = average(s.m3y,s.mny);

        // s.wa0x = s.whox * 15 / 10;

        // s.wa0y = 0;
        // s.wa1x = s.wheox;
        // s.wa1y = s.wheoy;
        // s.wmx = average(s.wa0x,s.wa1x);
        // s.wmy = average(s.wa0y,s.wa1y);
        // s.wnx = s.wmx + s.whc_100 / 100 * (s.wa1y - s.wa0y);
        // s.wny = s.wmy - s.whc_100 / 100 * (s.wa1x - s.wa0x);
        // s.wc0x = average(s.wa0x,s.wnx);
        // s.wc0y = average(s.wa0y,s.wny);
        // s.wc1x = average(s.wa1x,s.wnx);
        // s.wc1y = average(s.wa1y,s.wny);

        // s.tw = lerp(40, 10, s.bw_100);
        // s.br = lerp(100, 50, s.bw_100);
        // s.nw = lerp(70, 0, s.bw_100);
        // s.crx = lerp(s.bx, s.bx + 30,  lerp(40, 10,  s.bw_100));
        // s.cry = lerp(s.by, s.by + 150, lerp(40, 10, s.bw_100));
        // s.sc = lerp(50, 0, s.bw_100);

    



        // // Expressions
        // s.stripeX = (s.bx+30);
        // s.stripeY = (s.by+7);
        // s.tabbyBodyOffsetX = 30*(1-s.bw_100/100)*42/100;
        // s.tabbyBodyOffsetY = 150*(1-s.bw_100/100)*42/100;
        // s.eysl = 0;
        // s.eysr = 4;


        // // Inline Expressions
        // s.var_001 = colorToString(s.c_background);
        // s.var_002 = colorToString(s.c_bodyMain);
        // s.var_003 = colorToString(s.c_faceMain);
        // s.var_004 = colorToString(s.c_markA);
        // s.var_005 = colorToString(s.c_markB);
        // s.var_006 = colorToString(s.c_temple);
        // s.var_007 = colorToString(s.c_cornerLeft);
        // s.var_008 = colorToString(s.c_cornerRight);
        // s.var_009 = colorToString(s.c_maskA);
        // s.var_010 = colorToString(s.c_maskB);
        // s.var_011 = colorToString(s.c_shadow);
        // s.var_012 = colorToString(s.c_earB);
        // s.var_013 = colorToString(s.c_earA);
        // s.var_014 = colorToString(s.c_earIn);
        // s.var_015 = colorToString(s.c_eyeLeft);
        // s.var_016 = colorToString(s.c_eyeRight);
        // s.var_017 = colorToString(s.c_eyeline);
        // s.var_018 = colorToString(s.c_pupil);
        // s.var_019 = colorToString(s.c_glare);
        // s.var_020 = colorToString(s.c_mouthOpenBack);
        // s.var_021 = colorToString(s.c_mouth);
        // s.var_022 = colorToString(s.c_tongue);
        // s.var_023 = colorToString(s.c_tongueLine);
        // s.var_024 = colorToString(s.c_nose);
        // s.var_025 = colorToString(s.c_noseIn);
        // s.var_026 = colorToString(s.c_whiskers);
        // s.var_027 = colorToString(s.c_whiskersShadow);
        // s.var_028 = intToString((-s.bx+10));
        // s.var_029 = intToString((s.bx-10));
        // s.var_030 = intToString((s.bx+30));
        // s.var_031 = intToString((-s.bx-30));
        // s.var_032 = intToString((s.by-50));
        // s.var_033 = intToString((s.by+150));
        // s.var_034 = intToString(s.bodyParts_stripes ? int(1) : int(0));
        // s.var_035 = intToString((s.bx+30));
        // s.var_036 = intToString((s.by+7));
        // s.var_037 = (bezier(s.stripeX, s.stripeY, s.stripeX * 4/10, s.stripeY + s.sc * 2, -s.stripeX * 4/10, s.stripeY + s.sc * 2, -s.stripeX, s.stripeY));
        // s.var_038 = intToString(s.bodyParts_corners ? int(1) : int(0));
        // s.var_039 = intToString((-s.crx));
        // s.var_040 = intToString((-s.crx + 110));
        // s.var_041 = intToString((-s.crx - 30));
        // s.var_042 = intToString((s.crx));
        // s.var_043 = intToString((s.crx - 110));
        // s.var_044 = intToString((s.crx + 30));
        // s.var_045 = intToString((s.cry));
        // s.var_046 = intToString((s.cry + 150));
        // s.var_047 = intToString((s.cry + 150));
        // s.var_048 = intToString(s.bodyParts_tabby ? int(1) : int(0));
        // s.var_049 = intToString(30*(1-s.bw_100/100)*42/100);
        // s.var_050 = intToString(150*(1-s.bw_100/100)*42/100);
        // s.var_051 = intToString(-(s.bx+s.tabbyBodyOffsetX)-26);
        // s.var_052 = intToString((s.by+s.tabbyBodyOffsetY)-20);
        // s.var_053 = intToString(s.bodyParts_necktie ? int(1) : int(0));
        // s.var_054 = intToString((-s.bx+s.nw));
        // s.var_055 = intToString((s.bx-s.nw));
        // s.var_056 = intToString((s.bx));
        // s.var_057 = intToString((-s.bx));
        // s.var_058 = intToString((s.by));
        // s.var_059 = intToString((s.by+s.nw*5));
        // s.var_060 = intToString(s.bodyParts_belly ? int(1) : int(0));
        // s.var_061 = intToString((s.br/2));
        // s.var_062 = intToString(s.flipFaceMarks ? int(-1) : int(1));
        // s.var_063 = (vertex(s.ea0x, s.ea0y));
        // s.var_064 = (bezierVertex(s.ec0x, s.ec0y, s.ec1x, s.ec1y, s.ea1x, s.ea1y));
        // s.var_065 = (bezierVertex(s.ec2x, s.ec2y, s.ec3x, s.ec3y, s.ea2x, s.ea2y));
        // s.var_066 = (bezierVertex(s.ec4x, s.ec4y, s.ec5x, s.ec5y, s.ea3x, s.ea3y));
        // s.var_067 = (vertex(s.ei0x, s.ei0y));
        // s.var_068 = (bezierVertex(s.eic0x, s.eic0y, s.eic1x, s.eic1y, s.ei1x, s.ei1y));
        // s.var_069 = (bezierVertex(s.eic2x, s.eic2y, s.eic3x, s.eic3y, s.ei2x, s.ei2y));
        // s.var_070 = (bezierVertex(s.eic4x, s.eic4y, s.eic5x, s.eic5y, s.ei3x, s.ei3y));
        // s.var_071 = (vertex(s.fa0x, s.fa0y));
        // s.var_072 = (bezierVertex(s.fc0x, s.fc0y, s.fc1x, s.fc1y, s.fa1x, s.fa1y));
        // s.var_073 = (bezierVertex(s.fc2x, s.fc2y, s.fc3x, s.fc3y, s.fa2x, s.fa2y));
        // s.var_074 = (bezierVertex(s.fc4x, s.fc4y, s.fc5x, s.fc5y, s.fa3x, s.fa3y));
        // s.var_075 = (bezierVertex(-s.fc5x, s.fc5y, -s.fc4x, s.fc4y, -s.fa2x, s.fa2y));
        // s.var_076 = (bezierVertex(-s.fc3x, s.fc3y, -s.fc2x, s.fc2y, -s.fa1x, s.fa1y));
        // s.var_077 = (bezierVertex(-s.fc1x, s.fc1y, -s.fc0x, s.fc0y, -s.fa0x, s.fa0y));
        // s.var_078 = intToString(s.faceParts_round ? int(1) : int(0));
        // s.var_079 = intToString((s.na0y+60));
        // s.var_080 = intToString(s.faceParts_triangle ? int(1) : int(0));
        // s.var_081 = intToString((s.na0y));
        // s.var_082 = intToString((s.na0y + 100));
        // s.var_083 = intToString(s.faceParts_whiskers ? int(1) : int(0));
        // s.var_084 = intToString((s.na0y + 6));
        // s.var_085 = intToString(s.faceParts_ear ? int(1) : int(0));
        // s.var_086 = (vertex(s.ea0x, s.ea0y));
        // s.var_087 = (bezierVertex(s.earMidx - 20, s.earMidy + 15, s.earMidx + 15, s.earMidy + 15, s.ea3x, s.ea3y));
        // s.var_088 = intToString(s.faceParts_temple ? int(1) : int(0));
        // s.var_089 = intToString((s.eyoy - 72));
        // s.var_090 = intToString(s.faceParts_chin ? int(1) : int(0));
        // s.var_091 = intToString((s.tw));
        // s.var_092 = intToString((-s.tw));
        // s.var_093 = intToString((s.na0y + 5));
        // s.var_094 = intToString((s.na0y + 80));
        // s.var_095 = intToString(s.faceParts_nose ? int(1) : int(0));
        // s.var_096 = intToString((s.na0y + 5));
        // s.var_097 = intToString(s.faceParts_mask ? int(1) : int(0));
        // s.var_098 = intToString((s.fhy));
        // s.var_099 = intToString((s.eyoy - 50));
        // s.var_100 = intToString(s.faceParts_tabbyCheeks ? int(1) : int(0));
        // s.var_101 = intToString(-(s.chkx+30));
        // s.var_102 = intToString((s.chky-5));
        // s.var_103 = intToString(s.faceParts_tabbyForehead ? int(1) : int(0));
        // s.var_104 = intToString((s.fhy-30));
        // s.var_105 = intToString((s.eyr_100*180*100/100/314));
        // s.var_106 = intToString((s.eyox));
        // s.var_107 = intToString((s.eyoy));
        // s.var_108 = intToString(0);
        // s.var_109 = intToString(4);
        // s.var_110 = (vertex((s.eya0x - s.eysl), s.eya0y));
        // s.var_111 = (bezierVertex(s.eyc0x, s.eyc0y, s.eyc1x, s.eyc1y, s.eya1x, s.eya1y));
        // s.var_112 = (bezierVertex(s.eyc2x, s.eyc2y, s.eyc3x, s.eyc3y, (s.eya2x + s.eysr), s.eya2y));
        // s.var_113 = (bezierVertex(s.eyc4x, s.eyc4y, s.eyc5x, s.eyc5y, s.eya3x, s.eya3y));
        // s.var_114 = (bezierVertex(s.eyc6x, s.eyc6y, s.eyc7x, s.eyc7y, (s.eya0x - s.eysl), s.eya0y));
        // s.var_115 = (vertex((s.eya0x - s.eysl), s.eya0y));
        // s.var_116 = (bezierVertex(s.eyc0x, s.eyb/2, s.eyc1x, s.eyb/1, s.eya1x, s.eyb/1));
        // s.var_117 = (bezierVertex(s.eyc2x, s.eyb/1, s.eyc3x, s.eyb/2, (s.eya2x + s.eysr), s.eya2y));
        // s.var_118 = (bezierVertex(s.eyc4x, s.eyc4y, s.eyc5x, s.eyc5y, s.eya3x, s.eya3y));
        // s.var_119 = (bezierVertex(s.eyc6x, s.eyc6y, s.eyc7x, s.eyc7y, (s.eya0x - s.eysl), s.eya0y));
        // s.var_120 = intToString((s.eyox));
        // s.var_121 = intToString((s.eyoy));
        // s.var_122 = intToString((s.eypox));
        // s.var_123 = intToString((s.eypoy));
        // s.var_124 = intToString((s.eypw/2));
        // s.var_125 = intToString((s.eyph/2));
        // s.var_126 = intToString((s.eya1x+s.eya2x+s.eypox)/3);
        // s.var_127 = intToString((s.eya1y+s.eya2y+s.eypoy)/3);
        // s.var_128 = intToString((s.eya0x+s.eya3x+s.eypox)/3);
        // s.var_129 = intToString((s.eya0y+s.eya3y+s.eypoy)/3);
        // s.var_130 = intToString((s.eyox));
        // s.var_131 = intToString((s.eyoy));
        // s.var_132 = intToString((s.na0y));
        // s.var_133 = (line(s.na0x, s.na0y-s.na0y, s.m0x, s.m0y-s.na0y));
        // s.var_134 = (bezier(s.m0x, s.m0y-s.na0y, s.m1x, s.m1y-s.na0y, s.m2x, s.m2y-s.na0y, s.m3x, s.m3y-s.na0y));
        // s.var_135 = intToString(s.hasWhiskers ? int(1) : int(0));
        // s.var_136 = intToString((-s.whox * 5/10));
        // s.var_137 = intToString((s.whoy));
        // s.var_138 = intToString(-17);
        // s.var_139 = (bezier(s.wa0x, s.wa0y, s.wc0x, s.wc0y, s.wc1x, s.wc1y, s.wa1x, s.wa1y));
        // s.var_140 = intToString(-17 + (s.wha_100 * 2 *57/100));
        // s.var_141 = (bezier(s.wa0x, s.wa0y, s.wc0x, s.wc0y, s.wc1x * 9/10, s.wc1y, s.wa1x * 9/10, s.wa1y));
        // s.var_142 = intToString((s.whl > 2 ? int(1) : int(0)));
        // s.var_143 = intToString(-17 + (s.wha_100 * 1 *57/100));
        // s.var_144 = (bezier(s.wa0x, s.wa0y, s.wc0x, s.wc0y, s.wc1x, s.wc1y, s.wa1x, s.wa1y));
        // s.var_145 = intToString((s.whl > 3 ? int(1) : int(0)));
        // s.var_146 = intToString(-17 + (s.wha_100 * 3 *57/100));
        // s.var_147 = (bezier(s.wa0x, s.wa0y, s.wc0x, s.wc0y, s.wc1x * 75/100, s.wc1y, s.wa1x * 75/100, s.wa1y));
        // s.var_148 = (vertex(s.na0x, s.na0y));
        // s.var_149 = (bezierVertex(s.nc0x, s.nc0y, s.nc1x, s.nc1y, s.na1x, s.na1y));
        // s.var_150 = (bezierVertex(s.nc2x, s.nc2y, s.nc3x, s.nc3y, s.na2x, s.na2y));
        // s.var_151 = (bezierVertex(s.nc4x, s.nc4y, s.nc5x, s.nc5y, s.na0x, s.na0y));
        // s.var_152 = (bezier(s.ni0x, s.ni0y, s.ni1x, s.ni1y, s.ni2x, s.ni2y, s.ni3x, s.ni3y));
        

        string memory output = '';
        // output = string(abi.encodePacked(output, "<?xml version='1.0' encoding='UTF-8' standalone='s.no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_001));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x2'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_002));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x3'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_003));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x4'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_004));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x5'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_005));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x6'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_006));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x7'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_007));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x8'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_008));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x9'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_009));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x10'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_010));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x11'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_011));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x12'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_012));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x13'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_013));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x14'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_014));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x15'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_015));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x16'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_016));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x17'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_017));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x18'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_018));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x19'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_019));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_020));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x20'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_021));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_022));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_023));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x21'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_024));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x22'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_025));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x23'><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_026));
        // output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient><stop style='stop-color:#"));
        // // output = string\(abi\.encodePacked\(output, s\.var_027));
        // output = string(abi.encodePacked(output, "'/></linearGradient><filter id='x24' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='0 0' result='blur'/></filter><filter id='x25' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='0.5 0.5' result='blur'/></filter><filter id='x26' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='5 5' result='blur'/></filter><filter id='x27' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='3 3' result='blur'/></filter></defs><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x1)'/><g transform='translate(150.0,150.0) scale(1)'><g style='filter:url(#x24)'><animateMotion dur='17s' repeatCount='indefinite' path='M2,5c0,-5,3,5,3,0c0,-5-3,5-3,0Z'/><clipPath id='x28' clipPathUnits='userSpaceOnUse'><path d='M"));
        // // output = string\(abi\.encodePacked\(output, s\.var_028));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_032));
        // output = string(abi.encodePacked(output, "L"));
        // // output = string\(abi\.encodePacked\(output, s\.var_029));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_032));
        // output = string(abi.encodePacked(output, "L"));
        // // output = string\(abi\.encodePacked\(output, s\.var_030));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_033));
        // output = string(abi.encodePacked(output, "L"));
        // // output = string\(abi\.encodePacked\(output, s\.var_031));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_033));
        // output = string(abi.encodePacked(output, "Z'/></clipPath><g clip-path='url(#x28)'><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x2)'/><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_034));
        // output = string(abi.encodePacked(output, "'><path id='x29' style='fill:none;stroke:url(#x5);stroke-width:14' d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_037));
        // output = string(abi.encodePacked(output, "'/><use xlink:href='#x29' transform='translate(0, 27)'/><use xlink:href='#x29' transform='translate(0, 54)'/><use xlink:href='#x29' transform='translate(0, 81)'/><use xlink:href='#x29' transform='translate(0, 108)'/></g><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_038));
        // output = string(abi.encodePacked(output, "'><path style='fill:url(#x7)' d='M"));
        // // output = string\(abi\.encodePacked\(output, s\.var_039));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_045));
        // output = string(abi.encodePacked(output, "L"));
        // // output = string\(abi\.encodePacked\(output, s\.var_040));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_046));
        // output = string(abi.encodePacked(output, "L"));
        // // output = string\(abi\.encodePacked\(output, s\.var_041));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_047));
        // output = string(abi.encodePacked(output, "Z'/><path style='fill:url(#x8)' d='M"));
        // // output = string\(abi\.encodePacked\(output, s\.var_042));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_045));
        // output = string(abi.encodePacked(output, "L"));
        // // output = string\(abi\.encodePacked\(output, s\.var_043));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_046));
        // output = string(abi.encodePacked(output, "L"));
        // // output = string\(abi\.encodePacked\(output, s\.var_044));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_047));
        // output = string(abi.encodePacked(output, "Z'/></g><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_048));
        // output = string(abi.encodePacked(output, "'><g id='x30'><path id='x31' style='fill:url(#x5);filter:url(#x25)' d='M"));
        // // output = string\(abi\.encodePacked\(output, s\.var_051));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_052));
        // output = string(abi.encodePacked(output, "c60,15,60,20,60,20c0,5-60,-10-60,-10z'/><use xlink:href='#x31' transform='translate( -4, 18)'/><use xlink:href='#x31' transform='translate( -8,36)'/><use xlink:href='#x31' transform='translate(-12,54)'/></g><use xlink:href='#x30' transform='scale(-1,1)'/></g><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_053));
        // output = string(abi.encodePacked(output, "'><path style='fill:url(#x4)' d='M"));
        // // output = string\(abi\.encodePacked\(output, s\.var_054));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_058));
        // output = string(abi.encodePacked(output, "H"));
        // // output = string\(abi\.encodePacked\(output, s\.var_055));
        // output = string(abi.encodePacked(output, "L"));
        // // output = string\(abi\.encodePacked\(output, s\.var_056));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_059));
        // output = string(abi.encodePacked(output, "H"));
        // // output = string\(abi\.encodePacked\(output, s\.var_057));
        // output = string(abi.encodePacked(output, "Z'/></g><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_060));
        // output = string(abi.encodePacked(output, "'><ellipse style='fill:url(#x4)' cx='0' cy='165' rx='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_061));
        // output = string(abi.encodePacked(output, "' ry='50'/></g></g><g><path style='fill:url(#x11);filter:url(#x26)' clip-path='url(#x28)' d='M-90,-5c0,0,40,-40,90,-40c50,0,90,40,90,40c0,0,10,50,10,70c-20,0,-70,30,-100,30c-30,0,-80,-30,-100,-30c0,-20,10,-70,10,-70z'/></g></g><g><g transform='scale("));
        // // output = string\(abi\.encodePacked\(output, s\.var_062));
        // output = string(abi.encodePacked(output, ",1)'><g><g><clipPath id='x32' clipPathUnits='userSpaceOnUse'><path d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_063));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_064));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_065));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_066));
        // output = string(abi.encodePacked(output, "S50,0,0,0Z'/></clipPath><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x13)' clip-path='url(#x32)'/><g id='x33'><animateMotion dur='31s' repeatCount='indefinite' path='M0,3c0,-3,2,3,2,0c0,-3-2,3-2,0Z'/><clipPath id='x34' clipPathUnits='userSpaceOnUse'><path d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_067));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_068));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_069));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_070));
        // output = string(abi.encodePacked(output, "Z'/></clipPath><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x14)' clip-path='url(#x34)'/></g></g><g><g transform='scale(-1,1)'><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x12)' clip-path='url(#x32)'/><use xlink:href='#x33'/></g></g></g><g style='filter:url(#x24)'><clipPath id='x35' clipPathUnits='userSpaceOnUse'><path d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_071));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_072));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_073));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_074));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_075));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_076));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_077));
        // output = string(abi.encodePacked(output, "z'/></clipPath><g clip-path='url(#x35)'><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x3)'/><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_078));
        // output = string(abi.encodePacked(output, "'><ellipse style='fill:url(#x4)' cx='0' cy='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_079));
        // output = string(abi.encodePacked(output, "' rx='60' ry='60'/></g><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_080));
        // output = string(abi.encodePacked(output, "'><path style='fill:url(#x4);stroke:url(#x4);stroke-linejoin:round;stroke-linecap:round;stroke-width:6' d='M0,"));
        // // output = string\(abi\.encodePacked\(output, s\.var_081));
        // output = string(abi.encodePacked(output, "L-124,"));
        // // output = string\(abi\.encodePacked\(output, s\.var_082));
        // output = string(abi.encodePacked(output, "L124,"));
        // // output = string\(abi\.encodePacked\(output, s\.var_082));
        // output = string(abi.encodePacked(output, "Z'/></g><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_083));
        // output = string(abi.encodePacked(output, "'><ellipse style='fill:url(#x4)' cx='10' cy='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_084));
        // output = string(abi.encodePacked(output, "' rx='11' ry='11'/><ellipse style='fill:url(#x4)' cx='-10' cy='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_084));
        // output = string(abi.encodePacked(output, "' rx='11' ry='11'/></g><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_085));
        // output = string(abi.encodePacked(output, "'><path style='fill:url(#x4)' d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_086));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_087));
        // output = string(abi.encodePacked(output, "L150,-150Z'/></g><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_088));
        // output = string(abi.encodePacked(output, "'><ellipse style='fill:url(#x6)' cx='-68' cy='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_089));
        // output = string(abi.encodePacked(output, "' rx='75' ry='100'/></g><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_090));
        // output = string(abi.encodePacked(output, "'><path style='fill:url(#x4);stroke:url(#x4);stroke-linejoin:round;stroke-linecap:round;stroke-width:12' d='M-16,"));
        // // output = string\(abi\.encodePacked\(output, s\.var_093));
        // output = string(abi.encodePacked(output, "L16,"));
        // // output = string\(abi\.encodePacked\(output, s\.var_093));
        // output = string(abi.encodePacked(output, "L"));
        // // output = string\(abi\.encodePacked\(output, s\.var_091));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_094));
        // output = string(abi.encodePacked(output, "L"));
        // // output = string\(abi\.encodePacked\(output, s\.var_092));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_094));
        // output = string(abi.encodePacked(output, "Z'/></g><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_095));
        // output = string(abi.encodePacked(output, "'><path style='fill:url(#x4);stroke:url(#x4);stroke-linejoin:round;stroke-linecap:round;stroke-width:12' d='M0,5L-16,"));
        // // output = string\(abi\.encodePacked\(output, s\.var_096));
        // output = string(abi.encodePacked(output, "L16,"));
        // // output = string\(abi\.encodePacked\(output, s\.var_096));
        // output = string(abi.encodePacked(output, "Z'/></g><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_097));
        // output = string(abi.encodePacked(output, "'><ellipse style='fill:url(#x9)' cx='0' cy='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_098));
        // output = string(abi.encodePacked(output, "' rx='16' ry='35'/><ellipse style='fill:url(#x10)' cx='-76' cy='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_099));
        // output = string(abi.encodePacked(output, "' rx='70' ry='100'/><ellipse style='fill:url(#x9)' cx='76' cy='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_099));
        // output = string(abi.encodePacked(output, "' rx='70' ry='100'/></g><g><path opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_100));
        // output = string(abi.encodePacked(output, "' id='x36' style='fill:url(#x5);filter:url(#x25)' d='M"));
        // // output = string\(abi\.encodePacked\(output, s\.var_101));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_102));
        // output = string(abi.encodePacked(output, "c60,0,60,5,60,5c0,5,-60,5,-60,5z'/><use xlink:href='#x36' transform='translate(0,14)'/><use xlink:href='#x36' transform='translate(0,-14)'/><use xlink:href='#x36' transform='translate(0,0) scale(-1,1)'/><use xlink:href='#x36' transform='translate(0,14) scale(-1,1)'/><use xlink:href='#x36' transform='translate(0,-14) scale(-1,1)'/><path opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_103));
        // output = string(abi.encodePacked(output, "' id='x37' style='fill:url(#x5);filter:url(#x25)' d='M-20,"));
        // // output = string\(abi\.encodePacked\(output, s\.var_104));
        // output = string(abi.encodePacked(output, "c0,60,5,60,5,60c5,0,5,-60,5,-60z'/><use xlink:href='#x37' transform='translate(15,4)'/><use xlink:href='#x37' transform='translate(30,0)'/></g></g></g></g><g><g transform='translate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_106));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_107));
        // output = string(abi.encodePacked(output, ") translate(-"));
        // // output = string\(abi\.encodePacked\(output, s\.var_106));
        // output = string(abi.encodePacked(output, ",-"));
        // // output = string\(abi\.encodePacked\(output, s\.var_107));
        // output = string(abi.encodePacked(output, ")'><clipPath id='x38' clipPathUnits='userSpaceOnUse'><path id='x39' transform='translate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_106));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_107));
        // output = string(abi.encodePacked(output, ") scale(1,1) rotate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_105));
        // output = string(abi.encodePacked(output, ")' d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_110));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_111));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_112));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_113));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_114));
        // output = string(abi.encodePacked(output, "z'><animate attributeName='d' type='xml' repeatCount='indefinite' dur='4s' keyTimes='0;0.4;0.5;0.6;1' values=' "));
        // // output = string\(abi\.encodePacked\(output, s\.var_110));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_111));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_112));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_113));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_114));
        // output = string(abi.encodePacked(output, " z; "));
        // // output = string\(abi\.encodePacked\(output, s\.var_110));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_111));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_112));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_113));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_114));
        // output = string(abi.encodePacked(output, " z; "));
        // // output = string\(abi\.encodePacked\(output, s\.var_115));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_116));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_117));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_118));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_119));
        // output = string(abi.encodePacked(output, " z; "));
        // // output = string\(abi\.encodePacked\(output, s\.var_110));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_111));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_112));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_113));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_114));
        // output = string(abi.encodePacked(output, " z; "));
        // // output = string\(abi\.encodePacked\(output, s\.var_110));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_111));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_112));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_113));
        // output = string(abi.encodePacked(output, " "));
        // // output = string\(abi\.encodePacked\(output, s\.var_114));
        // output = string(abi.encodePacked(output, " z '/></path></clipPath><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x16)' clip-path='url(#x38)'/><g clip-path='url(#x38)'><g transform='translate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_120));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_121));
        // output = string(abi.encodePacked(output, ")'><g id='x40'><ellipse style='fill:url(#x18)' cx='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_122));
        // output = string(abi.encodePacked(output, "' cy='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_123));
        // output = string(abi.encodePacked(output, "' rx='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_124));
        // output = string(abi.encodePacked(output, "' ry='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_125));
        // output = string(abi.encodePacked(output, "'><animateMotion dur='20s' repeatCount='indefinite' path='M0,0c0,-5,3,5,3,0c0,-10-6,10-6,0Z'/></ellipse><g><g transform='translate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_126));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_127));
        // output = string(abi.encodePacked(output, ")'><circle r='25' transform='scale(0.15)' style='fill:url(#x19);filter:url(#x27)'/></g><g transform='translate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_128));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_129));
        // output = string(abi.encodePacked(output, ")'><circle r='15' transform='scale(0.15)' style='fill:url(#x19);filter:url(#x27)'/></g></g></g></g></g><use id='x41' xlink:href='#x39' style='stroke-width:2;stroke:url(#x17);fill:transparent'/></g><g transform='translate(-"));
        // // output = string\(abi\.encodePacked\(output, s\.var_106));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_107));
        // output = string(abi.encodePacked(output, ") translate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_106));
        // output = string(abi.encodePacked(output, ",-"));
        // // output = string\(abi\.encodePacked\(output, s\.var_107));
        // output = string(abi.encodePacked(output, ")'><rect x='-300' y='-300' width='600' height='600' transform='scale(-1,1)' style='fill:url(#x15)' clip-path='url(#x38)'/><g clip-path='url(#x38)' transform='scale(-1,1)'><g transform='translate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_130));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_131));
        // output = string(abi.encodePacked(output, ") scale(-1,1)'><use xlink:href='#x40'/></g></g><use xlink:href='#x41' transform='scale(-1,1)'/></g></g><g transform='translate(0,"));
        // // output = string\(abi\.encodePacked\(output, s\.var_132));
        // output = string(abi.encodePacked(output, ")'><g transform='translate(0,0)'><g transform='translate(0,0)'><path style='fill:none;stroke:url(#x20);stroke-width:1.5' d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_133));
        // output = string(abi.encodePacked(output, "'/><path id='x42' style='fill:none;stroke:url(#x20);stroke-width:1.5' d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_134));
        // output = string(abi.encodePacked(output, "'/><use xlink:href='#x42' transform='scale(-1,1)'/><g opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_135));
        // output = string(abi.encodePacked(output, "' transform='translate(0,0)'><g id='x43' transform='translate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_136));
        // output = string(abi.encodePacked(output, ","));
        // // output = string\(abi\.encodePacked\(output, s\.var_137));
        // output = string(abi.encodePacked(output, ")'><path style='fill:none;stroke:url(#x23);stroke-width:0.8' transform='rotate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_138));
        // output = string(abi.encodePacked(output, ")' d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_139));
        // output = string(abi.encodePacked(output, "'/><path style='fill:none;stroke:url(#x23);stroke-width:0.8' transform='rotate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_140));
        // output = string(abi.encodePacked(output, ")' d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_141));
        // output = string(abi.encodePacked(output, "'/><path style='fill:none;stroke:url(#x23);stroke-width:0.8' opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_142));
        // output = string(abi.encodePacked(output, "' transform='rotate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_143));
        // output = string(abi.encodePacked(output, ")' d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_144));
        // output = string(abi.encodePacked(output, "'/><path style='fill:none;stroke:url(#x23);stroke-width:0.8' opacity='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_145));
        // output = string(abi.encodePacked(output, "' transform='rotate("));
        // // output = string\(abi\.encodePacked\(output, s\.var_146));
        // output = string(abi.encodePacked(output, ")' d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_147));
        // output = string(abi.encodePacked(output, "'/></g><use xlink:href='#x43' transform='scale(-1,1)'/></g></g></g></g><g transform='translate(0,0)'><path style='fill:url(#x21);stroke:url(#x21);stroke-linejoin:round;stroke-width:1' d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_148));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_149));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_150));
        // output = string(abi.encodePacked(output, ""));
        // // output = string\(abi\.encodePacked\(output, s\.var_151));
        // output = string(abi.encodePacked(output, "Z'/><path id='x44' style='fill:url(#x22);stroke:url(#x21);stroke-linejoin:round;stroke-width:1' d='"));
        // // output = string\(abi\.encodePacked\(output, s\.var_152));
        // output = string(abi.encodePacked(output, "'/><use xlink:href='#x44' transform='scale(-1,1)'/></g></g></g></svg>"));
        return output;
    

    }



}