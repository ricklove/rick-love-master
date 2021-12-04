  
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


    int256 constant length_heads = 18;
    int256 constant data_heads_round_0               =  0x002a60000f70348230;
    int256 constant data_heads_oval_0                =  0x0019d0000fe4830285;
    int256 constant data_heads_diamond_0             =  0x000801a7f1dc570c91;
    int256 constant data_heads_squarish_0            =  0x001da0000eddb6ca73;
    int256 constant data_heads_fluffy_0              =  0x0014e00be02c580805;
    int256 constant data_heads_scruffy_0             =  0x0026a72b38c125ca75;
    int256 constant data_heads_plain_0               =  0x001e54000da5154690;
    int256 constant data_heads_chonker_0             =  0x002eb007e8b417cc08;
    int256 constant data_heads_slick_0               =  0x0379f003401408b234;
    int256 constant data_heads_rectangular_0         =  0x0015bb99920635e303;
    int256 constant data_heads_teeny_0               =  0x002ea4001000d54057;
    int256 constant data_heads_cheeky_0              =  0x0021f2e3c7d5560405;
    int256 constant data_heads_lemon_0               =  0x03edf0000e54477aa6;
    int256 constant data_heads_silky_0               =  0x0369e72c801957e805;
    int256 constant data_heads_chubby_0              =  0x03ea20001e11353042;
    int256 constant data_heads_skinny_0              =  0x0016cb057e10b0167b;
    int256 constant data_heads_wide_0                =  0x000186400ec944d7c1;
    int256 constant data_heads_blocky_0              =  0x0015a00010221788a3;


    int256 constant length_ears = 14;
    int256 constant data_ears_plain_0                =  0x0cac88f5e5bae6439b44;
    int256 constant data_ears_upright_0              =  0x0cac898cae34064a3ea6;
    int256 constant data_ears_alert_0                =  0x0caf718e6c382648bc00;
    int256 constant data_ears_pointy_0               =  0x0fa4698b221dc6401d06;
    int256 constant data_ears_teeny_0                =  0x1064518df221a68516b7;
    int256 constant data_ears_curved_0               =  0x0cac8991dc6ba648972d;
    int256 constant data_ears_slanted_0              =  0x0ca8944b221dc640019a;
    int256 constant data_ears_folded_0               =  0x000000403602cf9f3f9a;
    int256 constant data_ears_floppy_0               =  0x0186034e8056e7d919ca;
    int256 constant data_ears_sideways_0             =  0x0be86dcb221da0001942;
    int256 constant data_ears_perky_0                =  0x0cac8a35e55ca642a744;
    int256 constant data_ears_sphynx_0               =  0x08f78810f68652275b52;
    int256 constant data_ears_wide_0                 =  0x0cac8994e0b1068552ca;
    int256 constant data_ears_round_0                =  0x1120a91376adc5b2a12a;


    int256 constant length_eyes = 14;
    int256 constant data_eyes_round_0                =  0x0a88f2154f;
    int256 constant data_eyes_fierce_0               =  0x0c88520f93;
    int256 constant data_eyes_squinting_0            =  0x068aa0b253;
    int256 constant data_eyes_sullen_0               =  0x08db91e581;
    int256 constant data_eyes_meek_0                 =  0x09896a1093;
    int256 constant data_eyes_stern_0                =  0x118c020a5c;
    int256 constant data_eyes_mean_0                 =  0x0bacc9e24c;
    int256 constant data_eyes_droopy_0               =  0x0cd96a8047;
    int256 constant data_eyes_cross_0                =  0x0980a1d10b;
    int256 constant data_eyes_almond_0               =  0x0988f19013;
    int256 constant data_eyes_doe_0                  =  0x0c88ca0f8f;
    int256 constant data_eyes_glaring_0              =  0x0098c81687;
    int256 constant data_eyes_sleepy_0               =  0x0659182f5f;
    int256 constant data_eyes_pleading_0             =  0x0c0391b1eb;


    int256 constant length_pupils = 6;
    int256 constant data_pupils_thin_0               =  0x0225;
    int256 constant data_pupils_big_0                =  0x01ee;
    int256 constant data_pupils_huge_0               =  0x0236;
    int256 constant data_pupils_normal_0             =  0x0128;
    int256 constant data_pupils_small_0              =  0x0006;
    int256 constant data_pupils_thinnest_0           =  0x0220;


    int256 constant length_mouths = 9;
    int256 constant data_mouths_neutral_0            =  0x189a1c2b;
    int256 constant data_mouths_pursed_0             =  0x0d4a1d00;
    int256 constant data_mouths_pleased_0            =  0x161a1b54;
    int256 constant data_mouths_pouting_0            =  0x0d48b703;
    int256 constant data_mouths_drooping_0           =  0x0780072c;
    int256 constant data_mouths_displeased_0         =  0x12a81c35;
    int256 constant data_mouths_impartial_0          =  0x0d4937aa;
    int256 constant data_mouths_dull_0               =  0x1000999d;
    int256 constant data_mouths_smiling_0            =  0x1322c04d;


    int256 constant length_whiskers = 4;
    int256 constant data_whiskers_downward_0         =  0x0087c1;
    int256 constant data_whiskers_downwardShort_0    =  0x0087c0;
    int256 constant data_whiskers_upward_0           =  0x000015;
    int256 constant data_whiskers_upwardShort_0      =  0x000014;


    int256 constant length_palettes = 14;
    int256 constant data_palettes_black_0            =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_black_1            =  0x000000000000000000;
    int256 constant data_palettes_white_0            =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_white_1            =  0x000000000000000000;
    int256 constant data_palettes_ginger_0           =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_ginger_1           =  0x000000000000000000;
    int256 constant data_palettes_gray_0             =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_gray_1             =  0x000000000000000000;
    int256 constant data_palettes_brown_0            =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_brown_1            =  0x000000000000000000;
    int256 constant data_palettes_british_blue_0     =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_british_blue_1     =  0x000000000000000000;
    int256 constant data_palettes_calico_0           =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_calico_1           =  0x000000000000000000;
    int256 constant data_palettes_creamy_0           =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_creamy_1           =  0x000000000000000000;
    int256 constant data_palettes_pink_0             =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_pink_1             =  0x000000000000000000;
    int256 constant data_palettes_cyan_0             =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_cyan_1             =  0x000000000000000000;
    int256 constant data_palettes_green_0            =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_green_1            =  0x000000000000000000;
    int256 constant data_palettes_fleshy_0           =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_fleshy_1           =  0x000000000000000000;
    int256 constant data_palettes_sand_0             =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_sand_1             =  0x000000000000000000;
    int256 constant data_palettes_toyger_0           =  0x0000000000000000000000000000000000000000000000000000000000000000;
    int256 constant data_palettes_toyger_1           =  0x000000000000000000;


    int256 constant length_eyeColors = 6;
    int256 constant data_eyeColors_blue_0            =  0x000000;
    int256 constant data_eyeColors_yellow_0          =  0x000000;
    int256 constant data_eyeColors_green_0           =  0x000000;
    int256 constant data_eyeColors_orange_0          =  0x000000;
    int256 constant data_eyeColors_black_0           =  0x000000;
    int256 constant data_eyeColors_white_0           =  0x000000;


    int256 constant length_breedFlags = 11;
    int256 constant data_breedFlags_black_0          =  0x03;
    int256 constant data_breedFlags_white_0          =  0x13;
    int256 constant data_breedFlags_tabby_0          =  0x03;
    int256 constant data_breedFlags_shorthair_0      =  0x03;
    int256 constant data_breedFlags_calico_0         =  0x3b;
    int256 constant data_breedFlags_siamese_0        =  0x13;
    int256 constant data_breedFlags_sphynx_0         =  0x02;
    int256 constant data_breedFlags_sandcat_0        =  0x03;
    int256 constant data_breedFlags_toyger_0         =  0x03;
    int256 constant data_breedFlags_alien_0          =  0x01;
    int256 constant data_breedFlags_zombie_0         =  0x05;

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
        bool heterochromia;
        int256 i_breedFlags;
        int256 i_body;
        int256 i_face;
        int256 i_palettes;
        int256 i_eyeColorsMain;
        int256 i_eyeColorsA;
        int256 i_eyeColorsB;
        int256 i_heads;
        int256 i_ears;
        int256 b_tabbyFaceOdds;
        int256 rMod;
        int256 bits_breedFlags_0;
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
        int256 bits_heads_0;
        int256 bits_ears_0;
        int256 bits_eyes_0;
        int256 bits_pupils_0;
        int256 bits_mouths_0;
        int256 bits_whiskers_0;
        int256 bits_palettes_0;
        int256 bits_palettes_1;
        int256 bits_eyeColorsA_0;
        int256 bits_eyeColorsB_0;
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
        int256 c_eyeA;
        int256 c_eyeB;
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
    }
    


    // Generate svg
    function generateSvg(uint256 hashcode) public pure returns (string memory) {
        State memory s;


        // rvsValues

        s.rvs_breed =                   int(hashcode >> (2 * 0) & 0xf);
        s.rvs_bodyParts =               int(hashcode >> (2 * 1) & 0xf);
        s.rvs_faceParts =               int(hashcode >> (2 * 2) & 0xf);
        s.rvs_palette =                 int(hashcode >> (2 * 3) & 0xf);
        s.rvs_head =                    int(hashcode >> (2 * 4) & 0xf);
        s.rvs_ear =                     int(hashcode >> (2 * 5) & 0xf);
        s.rvs_eyes =                    int(hashcode >> (2 * 6) & 0xf);
        s.rvs_pupils =                  int(hashcode >> (2 * 7) & 0xf);
        s.rvs_mouth =                   int(hashcode >> (2 * 8) & 0xf);
        s.rvs_whiskers =                int(hashcode >> (2 * 9) & 0xf);
        s.rvs_flipFaceMarks =           int(hashcode >> (2 * 10) & 0xf);
        s.rvs_swapMarkColors =          int(hashcode >> (2 * 11) & 0xf);
        s.rvs_heterochromia =           int(hashcode >> (2 * 12) & 0xf);
        s.rvs_eyeColor =                int(hashcode >> (2 * 13) & 0xf);
        s.rvs_eyeSwap =                 int(hashcode >> (2 * 14) & 0xf);
        s.rvs_tabbyFacePartsAndTongue = int(hashcode >> (2 * 15) & 0xf);
    

        // breed required flags
        s.heterochromia =  s.rvs_heterochromia < 13;

        // breedValues

        // const {
        //     b_body,
        //     b_face,
        //     b_palettes,
        //     b_eyes,
        //     b_head,
        //     b_ear,
        //     b_tabbyFaceOdds,
        // } = breed;
        // s.i_breedFlags = i_breed;
        // s.i_body = b_body[s.rvs_bodyParts % b_body.length];
        // s.i_face = b_face[s.rvs_faceParts % b_face.length];
        // s.i_palettes = b_palettes[s.rvs_palette % b_palettes.length];
        // s.i_eyeColorsMain = b_eyes[s.rvs_eyeColor % b_eyes.length];
        // s.i_eyeColorsA = b_eyes.length > 1 && s.heterochromia ? 0 : s.i_eyeColorsMain;
        // s.i_eyeColorsB = b_eyes.length > 1 && s.heterochromia ? b_eyes[(s.rvs_eyeColor % (b_eyes.length > 2 ? 2 : 1)) + 1] : s.i_eyeColorsMain;
        // s.i_heads = b_head ? b_head : s.rvs_head % (length_heads - 3);
        // s.i_ears = b_ear ? b_ear : s.rvs_ear % (length_ears - 3);

        s.i_breedFlags = 0;
        s.i_body = 0;
        s.i_face = 0;
        s.i_palettes = 0;
        s.i_eyeColorsMain = 0;
        s.i_eyeColorsA = 0;
        s.i_eyeColorsB = 0;

        s.i_heads = s.rvs_head % (length_heads - 3);
        s.i_ears = s.rvs_ear % (length_ears - 3);

        s.b_tabbyFaceOdds = 0;

        s.rMod = 0;
        if (s.rvs_breed < 51) {
            /*black*/
            s.i_breedFlags = 0;
            
            s.rMod = s.rvs_bodyParts % 4;
            s.i_body = s.rMod == 0 ? int(0)
                : s.rMod == 1 ? int(4)
                : s.rMod == 2 ? int(5)
                : /* s.rMod == 3 ? */ int(6);
            
            s.rMod = s.rvs_faceParts % 10;
            s.i_face = s.rMod == 0 ? int(0)
                : s.rMod == 1 ? int(1)
                : s.rMod == 2 ? int(2)
                : s.rMod == 3 ? int(3)
                : s.rMod == 4 ? int(4)
                : s.rMod == 5 ? int(5)
                : s.rMod == 6 ? int(6)
                : s.rMod == 7 ? int(7)
                : s.rMod == 8 ? int(8)
                : /* s.rMod == 9 ? */ int(9);
            s.i_palettes = 0;
            
            s.rMod = s.rvs_eyeColor % 4;
            s.i_eyeColorsMain = s.rMod == 0 ? int(0)
                : s.rMod == 1 ? int(1)
                : s.rMod == 2 ? int(2)
                : /* s.rMod == 3 ? */ int(3);
            s.i_eyeColorsA = s.heterochromia ? int(0) : s.i_eyeColorsMain;
            s.i_eyeColorsB = s.heterochromia ? s.rvs_eyeColor % 2 == 0 ? int(1) : int(2) : s.i_eyeColorsMain;
            
        } else if (s.rvs_breed < 77) {
            /*white*/
            s.i_breedFlags = 1;
            s.i_body = s.rvs_bodyParts % 2 == 0 ? int(0) : int(6);
            
            s.rMod = s.rvs_faceParts % 4;
            s.i_face = s.rMod == 0 ? int(0)
                : s.rMod == 1 ? int(10)
                : s.rMod == 2 ? int(11)
                : /* s.rMod == 3 ? */ int(12);
            s.i_palettes = 1;
            
            s.rMod = s.rvs_eyeColor % 3;
            s.i_eyeColorsMain = s.rMod == 0 ? int(0)
                : s.rMod == 1 ? int(1)
                : /* s.rMod == 2 ? */ int(2);
            s.i_eyeColorsA = s.heterochromia ? int(0) : s.i_eyeColorsMain;
            s.i_eyeColorsB = s.heterochromia ? s.rvs_eyeColor % 2 == 0 ? int(1) : int(2) : s.i_eyeColorsMain;
            
        } else if (s.rvs_breed < 177) {
            /*tabby*/
            s.i_breedFlags = 2;
            
            s.rMod = s.rvs_bodyParts % 7;
            s.i_body = s.rMod == 0 ? int(1)
                : s.rMod == 1 ? int(2)
                : s.rMod == 2 ? int(3)
                : s.rMod == 3 ? int(4)
                : s.rMod == 4 ? int(5)
                : s.rMod == 5 ? int(6)
                : /* s.rMod == 6 ? */ int(7);
            
            s.rMod = s.rvs_faceParts % 9;
            s.i_face = s.rMod == 0 ? int(1)
                : s.rMod == 1 ? int(2)
                : s.rMod == 2 ? int(3)
                : s.rMod == 3 ? int(4)
                : s.rMod == 4 ? int(5)
                : s.rMod == 5 ? int(6)
                : s.rMod == 6 ? int(7)
                : s.rMod == 7 ? int(8)
                : /* s.rMod == 8 ? */ int(9);
            
            s.rMod = s.rvs_palette % 3;
            s.i_palettes = s.rMod == 0 ? int(2)
                : s.rMod == 1 ? int(3)
                : /* s.rMod == 2 ? */ int(4);
            
            s.rMod = s.rvs_eyeColor % 3;
            s.i_eyeColorsMain = s.rMod == 0 ? int(0)
                : s.rMod == 1 ? int(1)
                : /* s.rMod == 2 ? */ int(2);
            s.i_eyeColorsA = s.heterochromia ? int(0) : s.i_eyeColorsMain;
            s.i_eyeColorsB = s.heterochromia ? s.rvs_eyeColor % 2 == 0 ? int(1) : int(2) : s.i_eyeColorsMain;
            
            s.b_tabbyFaceOdds = 255;
        } else if (s.rvs_breed < 197) {
            /*shorthair*/
            s.i_breedFlags = 3;
            
            s.rMod = s.rvs_bodyParts % 4;
            s.i_body = s.rMod == 0 ? int(0)
                : s.rMod == 1 ? int(4)
                : s.rMod == 2 ? int(5)
                : /* s.rMod == 3 ? */ int(6);
            
            s.rMod = s.rvs_faceParts % 6;
            s.i_face = s.rMod == 0 ? int(0)
                : s.rMod == 1 ? int(1)
                : s.rMod == 2 ? int(4)
                : s.rMod == 3 ? int(6)
                : s.rMod == 4 ? int(7)
                : /* s.rMod == 5 ? */ int(8);
            s.i_palettes = 5;
            s.i_eyeColorsMain = 3;
            s.i_eyeColorsA = s.i_eyeColorsMain;
            s.i_eyeColorsB = s.i_eyeColorsMain;
            
        } else if (s.rvs_breed < 214) {
            /*calico*/
            s.i_breedFlags = 4;
            s.i_body = 6;
            s.i_face = s.rvs_faceParts % 2 == 0 ? int(1) : int(12);
            s.i_palettes = 6;
            
            s.rMod = s.rvs_eyeColor % 3;
            s.i_eyeColorsMain = s.rMod == 0 ? int(0)
                : s.rMod == 1 ? int(1)
                : /* s.rMod == 2 ? */ int(2);
            s.i_eyeColorsA = s.heterochromia ? int(0) : s.i_eyeColorsMain;
            s.i_eyeColorsB = s.heterochromia ? s.rvs_eyeColor % 2 == 0 ? int(1) : int(2) : s.i_eyeColorsMain;
            
        } else if (s.rvs_breed < 224) {
            /*siamese*/
            s.i_breedFlags = 5;
            s.i_body = s.rvs_bodyParts % 2 == 0 ? int(0) : int(6);
            s.i_face = s.rvs_faceParts % 2 == 0 ? int(0) : int(8);
            s.i_palettes = 7;
            
            s.rMod = s.rvs_eyeColor % 3;
            s.i_eyeColorsMain = s.rMod == 0 ? int(0)
                : s.rMod == 1 ? int(1)
                : /* s.rMod == 2 ? */ int(2);
            s.i_eyeColorsA = s.heterochromia ? int(0) : s.i_eyeColorsMain;
            s.i_eyeColorsB = s.heterochromia ? s.rvs_eyeColor % 2 == 0 ? int(1) : int(2) : s.i_eyeColorsMain;
            
        } else if (s.rvs_breed < 229) {
            /*sphynx*/
            s.i_breedFlags = 6;
            s.i_body = 0;
            s.i_face = 0;
            s.i_palettes = 11;
            
            s.rMod = s.rvs_eyeColor % 3;
            s.i_eyeColorsMain = s.rMod == 0 ? int(0)
                : s.rMod == 1 ? int(1)
                : /* s.rMod == 2 ? */ int(2);
            s.i_eyeColorsA = s.heterochromia ? int(0) : s.i_eyeColorsMain;
            s.i_eyeColorsB = s.heterochromia ? s.rvs_eyeColor % 2 == 0 ? int(1) : int(2) : s.i_eyeColorsMain;
            
            s.i_heads = 15;
            s.i_ears = 11;
        } else if (s.rvs_breed < 234) {
            /*sandcat*/
            s.i_breedFlags = 7;
            s.i_body = s.rvs_bodyParts % 2 == 0 ? int(3) : int(8);
            s.i_face = 6;
            s.i_palettes = 12;
            s.i_eyeColorsMain = s.rvs_eyeColor % 2 == 0 ? int(0) : int(1);
            s.i_eyeColorsA = s.heterochromia ? int(0) : s.i_eyeColorsMain;
            s.i_eyeColorsB = s.heterochromia ? int(1) : s.i_eyeColorsMain;
            
            s.i_heads = 16;
            s.i_ears = 12;
            s.b_tabbyFaceOdds = 255;
        } else if (s.rvs_breed < 239) {
            /*toyger*/
            s.i_breedFlags = 8;
            s.i_body = s.rvs_bodyParts % 2 == 0 ? int(3) : int(8);
            s.i_face = 6;
            s.i_palettes = 13;
            
            s.rMod = s.rvs_eyeColor % 3;
            s.i_eyeColorsMain = s.rMod == 0 ? int(0)
                : s.rMod == 1 ? int(1)
                : /* s.rMod == 2 ? */ int(2);
            s.i_eyeColorsA = s.heterochromia ? int(0) : s.i_eyeColorsMain;
            s.i_eyeColorsB = s.heterochromia ? s.rvs_eyeColor % 2 == 0 ? int(1) : int(2) : s.i_eyeColorsMain;
            
            s.i_heads = 17;
            s.i_ears = 13;
            s.b_tabbyFaceOdds = 255;
        } else if (s.rvs_breed < 251) {
            /*alien*/
            s.i_breedFlags = 9;
            
            s.rMod = s.rvs_bodyParts % 7;
            s.i_body = s.rMod == 0 ? int(1)
                : s.rMod == 1 ? int(2)
                : s.rMod == 2 ? int(3)
                : s.rMod == 3 ? int(4)
                : s.rMod == 4 ? int(5)
                : s.rMod == 5 ? int(6)
                : /* s.rMod == 6 ? */ int(8);
            
            s.rMod = s.rvs_faceParts % 9;
            s.i_face = s.rMod == 0 ? int(1)
                : s.rMod == 1 ? int(2)
                : s.rMod == 2 ? int(3)
                : s.rMod == 3 ? int(4)
                : s.rMod == 4 ? int(5)
                : s.rMod == 5 ? int(6)
                : s.rMod == 6 ? int(7)
                : s.rMod == 7 ? int(8)
                : /* s.rMod == 8 ? */ int(9);
            s.i_palettes = s.rvs_palette % 2 == 0 ? int(8) : int(9);
            s.i_eyeColorsMain = 4;
            s.i_eyeColorsA = s.i_eyeColorsMain;
            s.i_eyeColorsB = s.i_eyeColorsMain;
            
            s.b_tabbyFaceOdds = 127;
        } else if (s.rvs_breed < 256) {
            /*zombie*/
            s.i_breedFlags = 10;
            
            s.rMod = s.rvs_bodyParts % 8;
            s.i_body = s.rMod == 0 ? int(1)
                : s.rMod == 1 ? int(2)
                : s.rMod == 2 ? int(3)
                : s.rMod == 3 ? int(4)
                : s.rMod == 4 ? int(5)
                : s.rMod == 5 ? int(6)
                : s.rMod == 6 ? int(7)
                : /* s.rMod == 7 ? */ int(8);
            
            s.rMod = s.rvs_faceParts % 6;
            s.i_face = s.rMod == 0 ? int(2)
                : s.rMod == 1 ? int(3)
                : s.rMod == 2 ? int(4)
                : s.rMod == 3 ? int(5)
                : s.rMod == 4 ? int(6)
                : /* s.rMod == 5 ? */ int(9);
            s.i_palettes = 10;
            s.i_eyeColorsMain = 5;
            s.i_eyeColorsA = s.i_eyeColorsMain;
            s.i_eyeColorsB = s.i_eyeColorsMain;
            
            s.b_tabbyFaceOdds = 127;
        }
    

        s.bits_breedFlags_0 = 0;
        if (s.i_breedFlags == 0){ s.bits_breedFlags_0 = data_breedFlags_black_0;  }
        if (s.i_breedFlags == 1){ s.bits_breedFlags_0 = data_breedFlags_white_0;  }
        if (s.i_breedFlags == 2){ s.bits_breedFlags_0 = data_breedFlags_tabby_0;  }
        if (s.i_breedFlags == 3){ s.bits_breedFlags_0 = data_breedFlags_shorthair_0;  }
        if (s.i_breedFlags == 4){ s.bits_breedFlags_0 = data_breedFlags_calico_0;  }
        if (s.i_breedFlags == 5){ s.bits_breedFlags_0 = data_breedFlags_siamese_0;  }
        if (s.i_breedFlags == 6){ s.bits_breedFlags_0 = data_breedFlags_sphynx_0;  }
        if (s.i_breedFlags == 7){ s.bits_breedFlags_0 = data_breedFlags_sandcat_0;  }
        if (s.i_breedFlags == 8){ s.bits_breedFlags_0 = data_breedFlags_toyger_0;  }
        if (s.i_breedFlags == 9){ s.bits_breedFlags_0 = data_breedFlags_alien_0;  }
        if (s.i_breedFlags == 10){ s.bits_breedFlags_0 = data_breedFlags_zombie_0;  }

        s.f_whiskers = 0 <  (s.bits_breedFlags_0 >> 0 & 0x1);
        s.f_tongue = 0 <  (s.bits_breedFlags_0 >> 1 & 0x1);
        s.f_zombieEyes = 0 <  (s.bits_breedFlags_0 >> 2 & 0x1);
        s.f_swapMarkColors = 0 <  (s.bits_breedFlags_0 >> 3 & 0x1);
        s.f_useBodyColorForCorner = 0 <  (s.bits_breedFlags_0 >> 4 & 0x1);
        s.f_calico = 0 <  (s.bits_breedFlags_0 >> 5 & 0x1);

        // other flags
        s.flipFaceMarks =  s.rvs_flipFaceMarks < 128;
        s.swapMarkColors = s.rvs_swapMarkColors < 128 && s.f_swapMarkColors;
        s.eyeSwap =       s.rvs_eyeSwap < 128;

        // indexValues

        // s.i_body = b_body[s.rvs_bodyParts % b_body.length];
        // s.i_face = b_face[s.rvs_faceParts % b_face.length];
        // s.i_palettes = b_palettes[s.rvs_palette % b_palettes.length];
        // s.i_eyeColorsMain = b_eyes[s.rvs_eyeColor % b_eyes.length];
        // s.i_eyeColorsA = b_eyes.length > 1 && s.heterochromia ? 0 : s.i_eyeColorsMain;
        // s.i_eyeColorsB = b_eyes.length > 1 && s.heterochromia ? b_eyes[(s.rvs_eyeColor % (b_eyes.length > 2 ? 2 : 1)) + 1] : s.i_eyeColorsMain;
        // s.i_heads = b_head ? b_head : s.rvs_head % (length_heads - 3);
        // s.i_ears = b_ear ? b_ear : s.rvs_ear % (length_ears - 3);
    
        s.i_eyes = s.rvs_eyes % length_eyes;
        s.i_pupils = s.rvs_pupils % length_pupils;
        s.i_mouths = s.rvs_mouth % length_mouths;
        s.i_whiskers = s.rvs_whiskers % length_whiskers;
    

        s.bits_heads_0 = 0;
        if (s.i_heads == 0){ s.bits_heads_0 = data_heads_round_0;  }
        if (s.i_heads == 1){ s.bits_heads_0 = data_heads_oval_0;  }
        if (s.i_heads == 2){ s.bits_heads_0 = data_heads_diamond_0;  }
        if (s.i_heads == 3){ s.bits_heads_0 = data_heads_squarish_0;  }
        if (s.i_heads == 4){ s.bits_heads_0 = data_heads_fluffy_0;  }
        if (s.i_heads == 5){ s.bits_heads_0 = data_heads_scruffy_0;  }
        if (s.i_heads == 6){ s.bits_heads_0 = data_heads_plain_0;  }
        if (s.i_heads == 7){ s.bits_heads_0 = data_heads_chonker_0;  }
        if (s.i_heads == 8){ s.bits_heads_0 = data_heads_slick_0;  }
        if (s.i_heads == 9){ s.bits_heads_0 = data_heads_rectangular_0;  }
        if (s.i_heads == 10){ s.bits_heads_0 = data_heads_teeny_0;  }
        if (s.i_heads == 11){ s.bits_heads_0 = data_heads_cheeky_0;  }
        if (s.i_heads == 12){ s.bits_heads_0 = data_heads_lemon_0;  }
        if (s.i_heads == 13){ s.bits_heads_0 = data_heads_silky_0;  }
        if (s.i_heads == 14){ s.bits_heads_0 = data_heads_chubby_0;  }
        if (s.i_heads == 15){ s.bits_heads_0 = data_heads_skinny_0;  }
        if (s.i_heads == 16){ s.bits_heads_0 = data_heads_wide_0;  }
        if (s.i_heads == 17){ s.bits_heads_0 = data_heads_blocky_0;  }


        s.bits_ears_0 = 0;
        if (s.i_ears == 0){ s.bits_ears_0 = data_ears_plain_0;  }
        if (s.i_ears == 1){ s.bits_ears_0 = data_ears_upright_0;  }
        if (s.i_ears == 2){ s.bits_ears_0 = data_ears_alert_0;  }
        if (s.i_ears == 3){ s.bits_ears_0 = data_ears_pointy_0;  }
        if (s.i_ears == 4){ s.bits_ears_0 = data_ears_teeny_0;  }
        if (s.i_ears == 5){ s.bits_ears_0 = data_ears_curved_0;  }
        if (s.i_ears == 6){ s.bits_ears_0 = data_ears_slanted_0;  }
        if (s.i_ears == 7){ s.bits_ears_0 = data_ears_folded_0;  }
        if (s.i_ears == 8){ s.bits_ears_0 = data_ears_floppy_0;  }
        if (s.i_ears == 9){ s.bits_ears_0 = data_ears_sideways_0;  }
        if (s.i_ears == 10){ s.bits_ears_0 = data_ears_perky_0;  }
        if (s.i_ears == 11){ s.bits_ears_0 = data_ears_sphynx_0;  }
        if (s.i_ears == 12){ s.bits_ears_0 = data_ears_wide_0;  }
        if (s.i_ears == 13){ s.bits_ears_0 = data_ears_round_0;  }


        s.bits_eyes_0 = 0;
        if (s.i_eyes == 0){ s.bits_eyes_0 = data_eyes_round_0;  }
        if (s.i_eyes == 1){ s.bits_eyes_0 = data_eyes_fierce_0;  }
        if (s.i_eyes == 2){ s.bits_eyes_0 = data_eyes_squinting_0;  }
        if (s.i_eyes == 3){ s.bits_eyes_0 = data_eyes_sullen_0;  }
        if (s.i_eyes == 4){ s.bits_eyes_0 = data_eyes_meek_0;  }
        if (s.i_eyes == 5){ s.bits_eyes_0 = data_eyes_stern_0;  }
        if (s.i_eyes == 6){ s.bits_eyes_0 = data_eyes_mean_0;  }
        if (s.i_eyes == 7){ s.bits_eyes_0 = data_eyes_droopy_0;  }
        if (s.i_eyes == 8){ s.bits_eyes_0 = data_eyes_cross_0;  }
        if (s.i_eyes == 9){ s.bits_eyes_0 = data_eyes_almond_0;  }
        if (s.i_eyes == 10){ s.bits_eyes_0 = data_eyes_doe_0;  }
        if (s.i_eyes == 11){ s.bits_eyes_0 = data_eyes_glaring_0;  }
        if (s.i_eyes == 12){ s.bits_eyes_0 = data_eyes_sleepy_0;  }
        if (s.i_eyes == 13){ s.bits_eyes_0 = data_eyes_pleading_0;  }


        s.bits_pupils_0 = 0;
        if (s.i_pupils == 0){ s.bits_pupils_0 = data_pupils_thin_0;  }
        if (s.i_pupils == 1){ s.bits_pupils_0 = data_pupils_big_0;  }
        if (s.i_pupils == 2){ s.bits_pupils_0 = data_pupils_huge_0;  }
        if (s.i_pupils == 3){ s.bits_pupils_0 = data_pupils_normal_0;  }
        if (s.i_pupils == 4){ s.bits_pupils_0 = data_pupils_small_0;  }
        if (s.i_pupils == 5){ s.bits_pupils_0 = data_pupils_thinnest_0;  }


        s.bits_mouths_0 = 0;
        if (s.i_mouths == 0){ s.bits_mouths_0 = data_mouths_neutral_0;  }
        if (s.i_mouths == 1){ s.bits_mouths_0 = data_mouths_pursed_0;  }
        if (s.i_mouths == 2){ s.bits_mouths_0 = data_mouths_pleased_0;  }
        if (s.i_mouths == 3){ s.bits_mouths_0 = data_mouths_pouting_0;  }
        if (s.i_mouths == 4){ s.bits_mouths_0 = data_mouths_drooping_0;  }
        if (s.i_mouths == 5){ s.bits_mouths_0 = data_mouths_displeased_0;  }
        if (s.i_mouths == 6){ s.bits_mouths_0 = data_mouths_impartial_0;  }
        if (s.i_mouths == 7){ s.bits_mouths_0 = data_mouths_dull_0;  }
        if (s.i_mouths == 8){ s.bits_mouths_0 = data_mouths_smiling_0;  }


        s.bits_whiskers_0 = 0;
        if (s.i_whiskers == 0){ s.bits_whiskers_0 = data_whiskers_downward_0;  }
        if (s.i_whiskers == 1){ s.bits_whiskers_0 = data_whiskers_downwardShort_0;  }
        if (s.i_whiskers == 2){ s.bits_whiskers_0 = data_whiskers_upward_0;  }
        if (s.i_whiskers == 3){ s.bits_whiskers_0 = data_whiskers_upwardShort_0;  }


        s.bits_palettes_0 = 0; s.bits_palettes_1 = 0;
        if (s.i_palettes == 0){ s.bits_palettes_0 = data_palettes_black_0; s.bits_palettes_1 = data_palettes_black_1;  }
        if (s.i_palettes == 1){ s.bits_palettes_0 = data_palettes_white_0; s.bits_palettes_1 = data_palettes_white_1;  }
        if (s.i_palettes == 2){ s.bits_palettes_0 = data_palettes_ginger_0; s.bits_palettes_1 = data_palettes_ginger_1;  }
        if (s.i_palettes == 3){ s.bits_palettes_0 = data_palettes_gray_0; s.bits_palettes_1 = data_palettes_gray_1;  }
        if (s.i_palettes == 4){ s.bits_palettes_0 = data_palettes_brown_0; s.bits_palettes_1 = data_palettes_brown_1;  }
        if (s.i_palettes == 5){ s.bits_palettes_0 = data_palettes_british_blue_0; s.bits_palettes_1 = data_palettes_british_blue_1;  }
        if (s.i_palettes == 6){ s.bits_palettes_0 = data_palettes_calico_0; s.bits_palettes_1 = data_palettes_calico_1;  }
        if (s.i_palettes == 7){ s.bits_palettes_0 = data_palettes_creamy_0; s.bits_palettes_1 = data_palettes_creamy_1;  }
        if (s.i_palettes == 8){ s.bits_palettes_0 = data_palettes_pink_0; s.bits_palettes_1 = data_palettes_pink_1;  }
        if (s.i_palettes == 9){ s.bits_palettes_0 = data_palettes_cyan_0; s.bits_palettes_1 = data_palettes_cyan_1;  }
        if (s.i_palettes == 10){ s.bits_palettes_0 = data_palettes_green_0; s.bits_palettes_1 = data_palettes_green_1;  }
        if (s.i_palettes == 11){ s.bits_palettes_0 = data_palettes_fleshy_0; s.bits_palettes_1 = data_palettes_fleshy_1;  }
        if (s.i_palettes == 12){ s.bits_palettes_0 = data_palettes_sand_0; s.bits_palettes_1 = data_palettes_sand_1;  }
        if (s.i_palettes == 13){ s.bits_palettes_0 = data_palettes_toyger_0; s.bits_palettes_1 = data_palettes_toyger_1;  }


        s.bits_eyeColorsA_0 = 0;
        if (s.i_eyeColorsA == 0){ s.bits_eyeColorsA_0 = data_eyeColors_blue_0;  }
        if (s.i_eyeColorsA == 1){ s.bits_eyeColorsA_0 = data_eyeColors_yellow_0;  }
        if (s.i_eyeColorsA == 2){ s.bits_eyeColorsA_0 = data_eyeColors_green_0;  }
        if (s.i_eyeColorsA == 3){ s.bits_eyeColorsA_0 = data_eyeColors_orange_0;  }
        if (s.i_eyeColorsA == 4){ s.bits_eyeColorsA_0 = data_eyeColors_black_0;  }
        if (s.i_eyeColorsA == 5){ s.bits_eyeColorsA_0 = data_eyeColors_white_0;  }
        s.bits_eyeColorsB_0 = 0;
        if (s.i_eyeColorsB == 0){ s.bits_eyeColorsB_0 = data_eyeColors_blue_0;  }
        if (s.i_eyeColorsB == 1){ s.bits_eyeColorsB_0 = data_eyeColors_yellow_0;  }
        if (s.i_eyeColorsB == 2){ s.bits_eyeColorsB_0 = data_eyeColors_green_0;  }
        if (s.i_eyeColorsB == 3){ s.bits_eyeColorsB_0 = data_eyeColors_orange_0;  }
        if (s.i_eyeColorsB == 4){ s.bits_eyeColorsB_0 = data_eyeColors_black_0;  }
        if (s.i_eyeColorsB == 5){ s.bits_eyeColorsB_0 = data_eyeColors_white_0;  }

        s.fhy = (s.bits_heads_0 >> 0 & 0x0f) + -55;
        s.tplx = (s.bits_heads_0 >> 4 & 0x1f) + 70;
        s.tply = (s.bits_heads_0 >> 9 & 0x1f) + -30;
        s.chkx = (s.bits_heads_0 >> 14 & 0x3f) + 68;
        s.chky = (s.bits_heads_0 >> 20 & 0x3f) + 20;
        s.chny = (s.bits_heads_0 >> 26 & 0x0f) + 79;
        s.chkc_100 = (s.bits_heads_0 >> 30 & 0x7f) + -60;
        s.chko_100 = (s.bits_heads_0 >> 37 & 0x7f);
        s.chnc_100 = (s.bits_heads_0 >> 44 & 0x0ff) + -100;
        s.chno_100 = (s.bits_heads_0 >> 52 & 0x3f) + 6;
        s.bw_100 = (s.bits_heads_0 >> 58 & 0x0f) + 45;
        s.eeo_100 = (s.bits_heads_0 >> 62 & 0x0f);


        s.eso_100 = (s.bits_ears_0 >> 0 & 0x7) + 23;
        s.etox = (s.bits_ears_0 >> 3 & 0x3f) + -41;
        s.etoy = (s.bits_ears_0 >> 9 & 0x3f) + 39;
        s.eb_100 = (s.bits_ears_0 >> 15 & 0x3f);
        s.ebr_100 = (s.bits_ears_0 >> 21 & 0x0ff) + -50;
        s.esc_100 = (s.bits_ears_0 >> 29 & 0x1f) + -4;
        s.etc_100 = (s.bits_ears_0 >> 34 & 0x3f) + 3;
        s.eec_100 = (s.bits_ears_0 >> 40 & 0x3f) + -24;
        s.eitc_100 = (s.bits_ears_0 >> 46 & 0x7f) + -34;
        s.esi_100 = (s.bits_ears_0 >> 53 & 0x3f) + 18;
        s.eti_100 = (s.bits_ears_0 >> 59 & 0x1f) + 63;
        s.eei_100 = (s.bits_ears_0 >> 64 & 0x7) + 6;
        s.eito_100 = (s.bits_ears_0 >> 67 & 0x3ff) + -405;


        s.eyox = (s.bits_eyes_0 >> 0 & 0x3) + 37;
        s.eyoy = (s.bits_eyes_0 >> 2 & 0x0f) + 1;
        s.eyw = (s.bits_eyes_0 >> 6 & 0x3) + 19;
        s.eyt = (s.bits_eyes_0 >> 8 & 0x1f) + -3;
        s.eyb = (s.bits_eyes_0 >> 13 & 0x1f) + 2;
        s.eyr_100 = (s.bits_eyes_0 >> 18 & 0x7f) + -64;
        s.eypox = (s.bits_eyes_0 >> 25 & 0x7) + -8;
        s.eypoy = (s.bits_eyes_0 >> 28 & 0x0f) + -8;
        s.no = (s.bits_eyes_0 >> 32 & 0x1f) + -13;


        s.eypw = (s.bits_pupils_0 >> 0 & 0x1f) + 7;
        s.eyph = (s.bits_pupils_0 >> 5 & 0x1f) + 13;


        s.mh = (s.bits_mouths_0 >> 0 & 0x7) + 8;
        s.mox = (s.bits_mouths_0 >> 3 & 0x0f) + 5;
        s.moy = (s.bits_mouths_0 >> 7 & 0x0f) + -2;
        s.mc_100 = (s.bits_mouths_0 >> 11 & 0x7f) + -17;
        s.tngo_100 = (s.bits_mouths_0 >> 18 & 0x3ff) + -50;
        s.tng = (s.bits_mouths_0 >> 28 & 0x1);


        s.whl = (s.bits_whiskers_0 >> 0 & 0x1) + 3;
        s.wha_100 = (s.bits_whiskers_0 >> 1 & 0x3) + 18;
        s.whox = (s.bits_whiskers_0 >> 3 & 0x0) + 7;
        s.whoy = (s.bits_whiskers_0 >> 3 & 0x0) + 4;
        s.wheox = (s.bits_whiskers_0 >> 3 & 0x3) + 100;
        s.wheoy = (s.bits_whiskers_0 >> 5 & 0x1f);
        s.whc_100 = (s.bits_whiskers_0 >> 10 & 0x3f) + -18;


        s.c_bg = (s.bits_palettes_0 >> 0 & 0x0ffffff);
        s.c_body = (s.bits_palettes_0 >> 24 & 0x0ffffff);
        s.c_neck = (s.bits_palettes_0 >> 48 & 0x0ffffff);
        s.c_face = (s.bits_palettes_0 >> 72 & 0x0ffffff);
        s.c_prim = (s.bits_palettes_0 >> 96 & 0x0ffffff);
        s.c_sec = (s.bits_palettes_0 >> 120 & 0x0ffffff);
        s.c_ear = (s.bits_palettes_0 >> 144 & 0x0ffffff);
        s.c_earIn = (s.bits_palettes_0 >> 168 & 0x0ffffff);
        s.c_eyeline = (s.bits_palettes_0 >> 192 & 0x0ffffff);
        s.c_nose = (s.bits_palettes_0 >> 216 & 0x0ffffff);
        s.c_noseIn = (s.bits_palettes_1 >> 0 & 0x0ffffff);
        s.c_mouth = (s.bits_palettes_1 >> 24 & 0x0ffffff);
        s.c_whiskers = (s.bits_palettes_1 >> 48 & 0x0ffffff);


        s.c_eyeA = (s.bits_eyeColorsA_0 >> 0 & 0x0ffffff);
        s.c_eyeB = (s.bits_eyeColorsB_0 >> 0 & 0x0ffffff);

        
            s.rMod = s.i_body % 9;
            s.bodyParts = s.rMod == 0 ? int(0x0)
                : s.rMod == 1 ? int(0x1)
                : s.rMod == 2 ? int(0x3)
                : s.rMod == 3 ? int(0x5)
                : s.rMod == 4 ? int(0x2)
                : s.rMod == 5 ? int(0x4)
                : s.rMod == 6 ? int(0x8)
                : s.rMod == 7 ? int(0x10)
                : /* s.rMod == 8 ? */ int(0x9);
        
            s.rMod = s.i_face % 13;
            s.faceParts = s.rMod == 0 ? int(0x0)
                : s.rMod == 1 ? int(0x1)
                : s.rMod == 2 ? int(0x2)
                : s.rMod == 3 ? int(0x6)
                : s.rMod == 4 ? int(0xc)
                : s.rMod == 5 ? int(0x10)
                : s.rMod == 6 ? int(0x30)
                : s.rMod == 7 ? int(0x20)
                : s.rMod == 8 ? int(0x24)
                : s.rMod == 9 ? int(0x28)
                : s.rMod == 10 ? int(0x40)
                : s.rMod == 11 ? int(0x80)
                : /* s.rMod == 12 ? */ int(0xc0);

        s.bodyParts_tabby =    0 < s.bodyParts & 0x1;
        s.bodyParts_belly =    0 < s.bodyParts & 0x2;
        s.bodyParts_necktie =  0 < s.bodyParts & 0x4;
        s.bodyParts_corners =  0 < s.bodyParts & 0x8;
        s.bodyParts_stripes =  0 < s.bodyParts & 0x10;
        s.faceParts_mask =     0 < s.faceParts & 0x1;
        s.faceParts_round =    0 < s.faceParts & 0x2;
        s.faceParts_nose =     0 < s.faceParts & 0x4;
        s.faceParts_chin =     0 < s.faceParts & 0x8;
        s.faceParts_triangle = 0 < s.faceParts & 0x10;
        s.faceParts_whiskers = 0 < s.faceParts & 0x20;
        s.faceParts_ear =      0 < s.faceParts & 0x40;
        s.faceParts_temple =   0 < s.faceParts & 0x80;

        s.hasTabbyFaceParts = s.rvs_tabbyFacePartsAndTongue <= s.b_tabbyFaceOdds;
        s.faceParts_tabbyForehead = s.hasTabbyFaceParts;
        s.faceParts_tabbyCheeks =   s.hasTabbyFaceParts;

        s.hasWhiskers = s.f_whiskers;
        s.hasTongue = s.f_tongue && s.tng>0 && s.rvs_tabbyFacePartsAndTongue < 18;
    

        s.c_background = s.c_bg;
        s.c_markA = s.swapMarkColors ?  s.c_sec : s.c_prim;
        s.c_markB =  s.swapMarkColors ?  s.c_prim : s.c_sec;
        s.c_neckShadow = s.c_neck;
        s.c_whiskersShadow = 0x505050;
        s.c_tongue =     0xDB7093;
        s.c_tongueLine = 0xE38FAB;
        s.c_bodyMain =     s.bodyParts_corners && !s.f_useBodyColorForCorner ? s.c_markA : s.c_body;
        s.c_cornerRight =  s.bodyParts_corners &&  s.f_useBodyColorForCorner ? s.c_markA : s.c_body;
        s.c_cornerLeft =   s.bodyParts_corners &&  s.f_calico                ? s.c_markB : s.c_cornerRight;
        s.c_faceMain =        s.faceParts_mask && !s.f_calico                ? s.c_markA : s.c_face;
        s.c_maskA =           s.faceParts_mask &&  s.f_calico                ? s.c_markA : s.c_face;
        s.c_maskB =           s.faceParts_mask &&  s.f_calico                ? s.c_markB : s.c_face;
        s.c_temple =                             s.f_calico                ? s.c_markB : s.c_markA;
        s.c_earA =                               s.f_calico                ? s.c_markA : s.faceParts_ear ? s.c_markA : s.c_ear;
        s.c_earB =                               s.f_calico                ? s.c_markB : s.faceParts_temple ? s.c_temple : s.c_ear;
        s.TRANSPARENT = 0xFFFFFF00;
        s.c_pupil = s.f_zombieEyes ? int(0xFFFFFF) : int(0x000000);
        s.c_glare = s.f_zombieEyes ? s.TRANSPARENT   : int(0xFFFFFF);
        s.c_eyeRight = s.eyeSwap ? s.c_eyeB : s.c_eyeA;
        s.c_eyeLeft = s.eyeSwap ? s.c_eyeA : s.c_eyeB;

        // In svg
        s.c_shadow = 0x00000080;
        s.c_mouthOpenBack = 0x333333;
    

        
        // Shape Calculations

        s.nsx = 9;
        s.nsy = 11;
        s.fa0x = 0;
        s.fa0y = s.fhy;
        s.fa1x = s.tplx;
        s.fa1y = s.tply;
        s.fa2x = s.chkx;
        s.fa2y = s.chky;
        s.fa3x = 0;
        s.fa3y = s.chny;
        s.fm0x = average(s.fa0x,s.fa1x);
        s.fm0y = average(s.fa0y,s.fa1y);
        s.fm1x = average(s.fa1x,s.fa2x);
        s.fm1y = average(s.fa1y,s.fa2y);
        s.fm2x = average(s.fa2x,s.fa3x);
        s.fm2y = average(s.fa2y,s.fa3y);
        s.n0 = 100 * (s.fm0y - s.fa0y) / (s.fa1x - s.fa0x);
        s.n1 = s.chkc_100;
        s.n2 = s.chnc_100 * (s.fm2y - s.fa2y) / (s.fa3x - s.fa2x);
        s.fn0x = s.fm0x + s.n0 / 100 * (s.fa1y - s.fa0y);
        s.fn0y = s.fm0y - s.n0 / 100 * (s.fa1x - s.fa0x);
        s.fn1x = s.fm1x + s.n1 / 100 * (s.fa2y - s.fa1y);
        s.fn1y = s.fm1y - s.n1 / 100 * (s.fa2x - s.fa1x);
        s.fn2x = s.fm1x - s.n1 / 100 * (s.fa2y - s.fa1y);
        s.fn2y = s.fm1y + s.n1 / 100 * (s.fa2x - s.fa1x);
        s.fn3x = s.fm2x + s.n2 / 100 * (s.fa3y - s.fa2y);
        s.fn3y = s.fm2y - s.n2 / 100 * (s.fa3x - s.fa2x);
        s.fc0x = s.fa1x * 4 / 10;
        s.fc0y = s.fa0y;
        s.fc1x = average(s.fa1x,s.fn0x);
        s.fc1y = average(s.fa1y,s.fn0y);
        s.fc2x = average(s.fa1x, lerp(s.fn1x, s.fn2x, s.chko_100));
        s.fc2y = average(s.fa1y, lerp(s.fn1y, s.fn2y, s.chko_100));
        s.fc3x = average(s.fa2x, s.fn1x);
        s.fc3y = average(s.fa2y, s.fn1y);
        s.fc4x = average(s.fa2x,s.fn3x);
        s.fc4y = average(s.fa2y,s.fn3y);
        s.fc5x = s.fa2x * s.chno_100 / 100;
        s.fc5y = s.fa3y;

        s.bx = bezierPoint(s.fa2x, s.fc4x, s.fc5x, s.fa3x, s.bw_100);
        s.by = bezierPoint(s.fa2y, s.fc4y, s.fc5y, s.fa3y, s.bw_100);

        s.ea0x = bezierPoint(s.fa0x, s.fc0x, s.fc1x, s.fa1x, s.eso_100);
        s.ea0y = bezierPoint(s.fa0y, s.fc0y, s.fc1y, s.fa1y, s.eso_100);
        s.ea3x = bezierPoint(s.fa1x, s.fc1x, s.fc0x, s.fa0x, s.eeo_100);
        s.ea3y = bezierPoint(s.fa1y, s.fc1y, s.fc0y, s.fa0y, s.eeo_100);
        s.earTipx = s.ea3x + s.etox;
        s.earTipy = s.ea3y - s.etoy;
        s.ea1x = lerp(s.earTipx,s.ea0x,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 * -constrain(s.ebr_100, -100, 0) / 100);
        s.ea1y = lerp(s.earTipy,s.ea0y,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 * -constrain(s.ebr_100, -100, 0) / 100);
        s.ea2x = lerp(s.earTipx,s.ea3x,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 *  constrain(s.ebr_100,  0, 100) / 100);
        s.ea2y = lerp(s.earTipy,s.ea3y,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 *  constrain(s.ebr_100,  0, 100) / 100);
        s.ei0x = lerp(s.ea0x, s.ea3x, s.esi_100);
        s.ei0y = lerp(s.ea0y, s.ea3y, s.esi_100);
        s.ei3x = lerp(s.ea0x, s.ea3x, 100 - s.eei_100);
        s.ei3y = lerp(s.ea0y, s.ea3y, 100 - s.eei_100);
        s.earMidx = average(s.ei0x,s.ei3x);
        s.earMidy = average(s.ei0y,s.ei3y);
        s.eitx = lerp(s.earMidx,s.earTipx,s.eti_100) + s.eito_100 / 100;
        s.eity = lerp(s.earMidy,s.earTipy,s.eti_100);
        s.ei1x = lerp(s.eitx,s.ei0x,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 * -constrain(s.ebr_100, -100, 0) / 100);
        s.ei1y = lerp(s.eity,s.ei0y,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 * -constrain(s.ebr_100, -100, 0) / 100);
        s.ei2x = lerp(s.eitx,s.ei3x,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 *  constrain(s.ebr_100, 0, 100) / 100);
        s.ei2y = lerp(s.eity,s.ei3y,s.eb_100 + (80 - s.eb_100) * ceil_100(s.eb_100) / 100 *  constrain(s.ebr_100, 0, 100) / 100);
        s.em0x = average(s.ea0x,s.ea1x);
        s.em0y = average(s.ea0y,s.ea1y);
        s.em1x = average(s.ea1x,s.ea2x);
        s.em1y = average(s.ea1y,s.ea2y);
        s.em2x = average(s.ea2x,s.ea3x);
        s.em2y = average(s.ea2y,s.ea3y);
        s.en0x = s.em0x + s.esc_100 / 100 * (s.ea1y - s.ea0y);
        s.en0y = s.em0y - s.esc_100 / 100 * (s.ea1x - s.ea0x);
        s.en1x = s.em1x + s.etc_100 / 100 * (s.ea2y - s.ea1y);
        s.en1y = s.em1y - s.etc_100 / 100 * (s.ea2x - s.ea1x);
        s.en2x = s.em2x + s.eec_100 / 100 * (s.ea3y - s.ea2y);
        s.en2y = s.em2y - s.eec_100 / 100 * (s.ea3x - s.ea2x);
        s.ec0x = average(s.ea0x,s.en0x);
        s.ec0y = average(s.ea0y,s.en0y);
        s.ec1x = average(s.ea1x,s.en0x);
        s.ec1y = average(s.ea1y,s.en0y);
        s.ec2x = average(s.ea1x,s.en1x);
        s.ec2y = average(s.ea1y,s.en1y);
        s.ec3x = average(s.ea2x,s.en1x);
        s.ec3y = average(s.ea2y,s.en1y);
        s.ec4x = average(s.ea2x,s.en2x);
        s.ec4y = average(s.ea2y,s.en2y);
        s.ec5x = average(s.ea3x,s.en2x);
        s.ec5y = average(s.ea3y,s.en2y);
        s.eim0x = average(s.ei0x,s.ei1x);
        s.eim0y = average(s.ei0y,s.ei1y);
        s.eim1x = average(s.ei1x,s.ei2x);
        s.eim1y = average(s.ei1y,s.ei2y);
        s.eim2x = average(s.ei2x,s.ei3x);
        s.eim2y = average(s.ei2y,s.ei3y);
        s.en0bx = s.eim0x + s.esc_100 / 100 * (s.ei1y - s.ei0y);
        s.en0by = s.eim0y - s.esc_100 / 100 * (s.ei1x - s.ei0x);
        s.en1bx = s.eim1x + s.eitc_100 / 100 * (s.ei2y - s.ei1y);
        s.en1by = s.eim1y - s.eitc_100 / 100 * (s.ei2x - s.ei1x);
        s.en2bx = s.eim2x + s.eec_100 / 100 * (s.ei3y - s.ei2y);
        s.en2by = s.eim2y - s.eec_100 / 100 * (s.ei3x - s.ei2x);
        s.eic0x = average(s.ei0x,s.en0bx);
        s.eic0y = average(s.ei0y,s.en0by);
        s.eic1x = average(s.ei1x,s.en0bx);
        s.eic1y = average(s.ei1y,s.en0by);
        s.eic2x = average(s.ei1x,s.en1bx);
        s.eic2y = average(s.ei1y,s.en1by);
        s.eic3x = average(s.ei2x,s.en1bx);
        s.eic3y = average(s.ei2y,s.en1by);
        s.eic4x = average(s.ei2x,s.en2bx);
        s.eic4y = average(s.ei2y,s.en2by);
        s.eic5x = average(s.ei3x,s.en2bx);
        s.eic5y = average(s.ei3y,s.en2by);

        s.blinkAmt = 0;
        s.petAmt = 0;

        s.eya0x = -s.eyw;
        s.eya0y = 0;
        s.eya1x = 0;
        s.eya1y = lerp(-s.eyt, s.eyb, s.blinkAmt);
        s.eya2x = s.eyw;
        s.eya2y = 0;
        s.eya3x = 0;
        s.eya3y = lerp(s.eyb, -s.eyt, s.petAmt);
        s.eyc0x = s.eya0x;
        s.eyc0y = s.eya1y / 2;
        s.eyc1x = s.eya0x / 2;
        s.eyc1y = s.eya1y;
        s.eyc2x = s.eya2x / 2;
        s.eyc2y = s.eya1y;
        s.eyc3x = s.eya2x;
        s.eyc3y = s.eya1y / 2;
        s.eyc4x = s.eya2x;
        s.eyc4y = s.eya3y / 2;
        s.eyc5x = s.eya2x / 2;
        s.eyc5y = s.eya3y;
        s.eyc6x = s.eya0x / 2;
        s.eyc6y = s.eya3y;
        s.eyc7x = s.eya0x;
        s.eyc7y = s.eya3y / 2;


        s.ncrv_100 = 20;
        s.na0x = 0;
        s.na0y = 37 + s.no;
        s.na1x = -s.nsx;
        s.na1y = s.na0y - s.nsy;
        s.na2x = s.nsx;
        s.na2y = s.na0y - s.nsy;
        s.nm0x = average(s.na0x,s.na1x);
        s.nm0y = average(s.na0y,s.na1y);
        s.nm1x = average(s.na1x,s.na2x);
        s.nm1y = average(s.na1y,s.na2y);
        s.nm2x = average(s.na2x,s.na0x);
        s.nm2y = average(s.na2y,s.na0y);
        s.nn0x = s.nm0x + s.ncrv_100 / 100 * (s.na1y - s.na0y);
        s.nn0y = s.nm0y - s.ncrv_100 / 100 * (s.na1x - s.na0x);
        s.nn1x = s.nm1x + s.ncrv_100 / 100 * (s.na2y - s.na1y);
        s.nn1y = s.nm1y - s.ncrv_100 / 100 * (s.na2x - s.na1x);
        s.nn2x = s.nm2x + s.ncrv_100 / 100 * (s.na0y - s.na2y);
        s.nn2y = s.nm2y - s.ncrv_100 / 100 * (s.na0x - s.na2x);
        s.nc0x = average(s.na0x,s.nn0x);
        s.nc0y = average(s.na0y,s.nn0y);
        s.nc1x = average(s.na1x,s.nn0x);
        s.nc1y = average(s.na1y,s.nn0y);
        s.nc2x = average(s.na1x,s.nn1x);
        s.nc2y = average(s.na1y,s.nn1y);
        s.nc3x = average(s.na2x,s.nn1x);
        s.nc3y = average(s.na2y,s.nn1y);
        s.nc4x = average(s.na2x,s.nn2x);
        s.nc4y = average(s.na2y,s.nn2y);
        s.nc5x = average(s.na0x,s.nn2x);
        s.nc5y = average(s.na0y,s.nn2y);
        s.ni0x = bezierPoint(s.na0x, s.nc0x, s.nc1x, s.na1x, 20);
        s.ni0y = bezierPoint(s.na0y, s.nc0y, s.nc1y, s.na1y, 20);
        s.ni3x = bezierPoint(s.na0x, s.nc0x, s.nc1x, s.na1x, 80);
        s.ni3y = bezierPoint(s.na0y, s.nc0y, s.nc1y, s.na1y, 80);
        s.ni1x = s.ni0x + 1;
        s.ni1y = s.ni0y - s.nsx * 4 / 10;
        s.ni2x = s.ni0x + s.nsx * 4 / 10;
        s.ni2y = s.ni0y - s.nsy * 6 / 10;
        s.m0x = 0;

        s.m0y = constrain(s.na0y + s.mh, s.na0y, s.fa3y);
        s.m3x = s.mox;
        s.m3y = constrain(s.m0y + s.moy, s.na0y, s.fa3y);
        s.mmx = average(s.m0x,s.m3x);
        s.mmy = average(s.m0y,s.m3y);
        s.mnx = s.mmx - s.mc_100 / 100 * (s.m3y - s.m0y);
        s.mny = s.mmy + s.mc_100 / 100 * (s.m3x - s.m0x);
        s.m1x = average(s.m0x,s.mnx);
        s.m1y = average(s.m0y,s.mny);
        s.m2x = average(s.m3x,s.mnx);
        s.m2y = average(s.m3y,s.mny);

        s.wa0x = s.whox * 15 / 10;

        s.wa0y = 0;
        s.wa1x = s.wheox;
        s.wa1y = s.wheoy;
        s.wmx = average(s.wa0x,s.wa1x);
        s.wmy = average(s.wa0y,s.wa1y);
        s.wnx = s.wmx + s.whc_100 / 100 * (s.wa1y - s.wa0y);
        s.wny = s.wmy - s.whc_100 / 100 * (s.wa1x - s.wa0x);
        s.wc0x = average(s.wa0x,s.wnx);
        s.wc0y = average(s.wa0y,s.wny);
        s.wc1x = average(s.wa1x,s.wnx);
        s.wc1y = average(s.wa1y,s.wny);

        s.tw = lerp(40, 10, s.bw_100);
        s.br = lerp(100, 50, s.bw_100);
        s.nw = lerp(70, 0, s.bw_100);
        s.crx = lerp(s.bx, s.bx + 30,  lerp(40, 10,  s.bw_100));
        s.cry = lerp(s.by, s.by + 150, lerp(40, 10, s.bw_100));
        s.sc = lerp(50, 0, s.bw_100);

    


        // Expressions
        s.stripeX = (s.bx+30);
        s.stripeY = (s.by+7);
        s.tabbyBodyOffsetX = 30*(1-s.bw_100/100)*42/100;
        s.tabbyBodyOffsetY = 150*(1-s.bw_100/100)*42/100;
        s.eysl = 0;
        s.eysr = 4;

        // Svg
        string memory output = '';
        output = string(abi.encodePacked(output, "<?xml version='1.0' encoding='UTF-8' standalone='s.no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_background)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x2'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_bodyMain)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x3'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_faceMain)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x4'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_markA)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x5'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_markB)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x6'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_temple)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x7'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_cornerLeft)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x8'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_cornerRight)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x9'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_maskA)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x10'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_maskB)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x11'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_shadow)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x12'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_earB)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x13'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_earA)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x14'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_earIn)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x15'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_eyeLeft)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x16'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_eyeRight)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x17'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_eyeline)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x18'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_pupil)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x19'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_glare)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_mouthOpenBack)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x20'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_mouth)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_tongue)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_tongueLine)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x21'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_nose)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x22'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_noseIn)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient id='x23'><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_whiskers)));
        output = string(abi.encodePacked(output, "'/></linearGradient><linearGradient><stop style='stop-color:#"));
        output = string(abi.encodePacked(output, colorToString(s.c_whiskersShadow)));
        output = string(abi.encodePacked(output, "'/></linearGradient><filter id='x24' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='0 0' result='blur'/></filter><filter id='x25' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='0.5 0.5' result='blur'/></filter><filter id='x26' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='5 5' result='blur'/></filter><filter id='x27' style='color-interpolation-filters:sRGB'><feGaussianBlur stdDeviation='3 3' result='blur'/></filter></defs><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x1)'/><g transform='translate(150.0,150.0) scale(1)'><g style='filter:url(#x24)'><animateMotion dur='17s' repeatCount='indefinite' path='M2,5c0,-5,3,5,3,0c0,-5-3,5-3,0Z'/><clipPath id='x28' clipPathUnits='userSpaceOnUse'><path d='M"));
        output = string(abi.encodePacked(output, intToString((-s.bx+10))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.by-50))));
        output = string(abi.encodePacked(output, "L"));
        output = string(abi.encodePacked(output, intToString((s.bx-10))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.by-50))));
        output = string(abi.encodePacked(output, "L"));
        output = string(abi.encodePacked(output, intToString((s.bx+30))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.by+150))));
        output = string(abi.encodePacked(output, "L"));
        output = string(abi.encodePacked(output, intToString((-s.bx-30))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.by+150))));
        output = string(abi.encodePacked(output, "Z'/></clipPath><g clip-path='url(#x28)'><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x2)'/><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.bodyParts_stripes ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><path id='x29' style='fill:none;stroke:url(#x5);stroke-width:14' d='"));
        output = string(abi.encodePacked(output, (bezier(s.stripeX, s.stripeY, s.stripeX * 4/10, s.stripeY + s.sc * 2, -s.stripeX * 4/10, s.stripeY + s.sc * 2, -s.stripeX, s.stripeY))));
        output = string(abi.encodePacked(output, "'/><use xlink:href='#x29' transform='translate(0, 27)'/><use xlink:href='#x29' transform='translate(0, 54)'/><use xlink:href='#x29' transform='translate(0, 81)'/><use xlink:href='#x29' transform='translate(0, 108)'/></g><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.bodyParts_corners ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><path style='fill:url(#x7)' d='M"));
        output = string(abi.encodePacked(output, intToString((-s.crx))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.cry))));
        output = string(abi.encodePacked(output, "L"));
        output = string(abi.encodePacked(output, intToString((-s.crx + 110))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.cry + 150))));
        output = string(abi.encodePacked(output, "L"));
        output = string(abi.encodePacked(output, intToString((-s.crx - 30))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.cry + 150))));
        output = string(abi.encodePacked(output, "Z'/><path style='fill:url(#x8)' d='M"));
        output = string(abi.encodePacked(output, intToString((s.crx))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.cry))));
        output = string(abi.encodePacked(output, "L"));
        output = string(abi.encodePacked(output, intToString((s.crx - 110))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.cry + 150))));
        output = string(abi.encodePacked(output, "L"));
        output = string(abi.encodePacked(output, intToString((s.crx + 30))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.cry + 150))));
        output = string(abi.encodePacked(output, "Z'/></g><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.bodyParts_tabby ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><g id='x30'><path id='x31' style='fill:url(#x5);filter:url(#x25)' d='M"));
        output = string(abi.encodePacked(output, intToString(-(s.bx+s.tabbyBodyOffsetX)-26)));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.by+s.tabbyBodyOffsetY)-20)));
        output = string(abi.encodePacked(output, "c60,15,60,20,60,20c0,5-60,-10-60,-10z'/><use xlink:href='#x31' transform='translate( -4, 18)'/><use xlink:href='#x31' transform='translate( -8,36)'/><use xlink:href='#x31' transform='translate(-12,54)'/></g><use xlink:href='#x30' transform='scale(-1,1)'/></g><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.bodyParts_necktie ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><path style='fill:url(#x4)' d='M"));
        output = string(abi.encodePacked(output, intToString((-s.bx+s.nw))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.by))));
        output = string(abi.encodePacked(output, "H"));
        output = string(abi.encodePacked(output, intToString((s.bx-s.nw))));
        output = string(abi.encodePacked(output, "L"));
        output = string(abi.encodePacked(output, intToString((s.bx))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.by+s.nw*5))));
        output = string(abi.encodePacked(output, "H"));
        output = string(abi.encodePacked(output, intToString((-s.bx))));
        output = string(abi.encodePacked(output, "Z'/></g><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.bodyParts_belly ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><ellipse style='fill:url(#x4)' cx='0' cy='165' rx='"));
        output = string(abi.encodePacked(output, intToString((s.br/2))));
        output = string(abi.encodePacked(output, "' ry='50'/></g></g><g><path style='fill:url(#x11);filter:url(#x26)' clip-path='url(#x28)' d='M-90,-5c0,0,40,-40,90,-40c50,0,90,40,90,40c0,0,10,50,10,70c-20,0,-70,30,-100,30c-30,0,-80,-30,-100,-30c0,-20,10,-70,10,-70z'/></g></g><g><g transform='scale("));
        output = string(abi.encodePacked(output, intToString(s.flipFaceMarks ? int(-1) : int(1))));
        output = string(abi.encodePacked(output, ",1)'><g><g><clipPath id='x32' clipPathUnits='userSpaceOnUse'><path d='"));
        output = string(abi.encodePacked(output, (vertex(s.ea0x, s.ea0y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.ec0x, s.ec0y, s.ec1x, s.ec1y, s.ea1x, s.ea1y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.ec2x, s.ec2y, s.ec3x, s.ec3y, s.ea2x, s.ea2y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.ec4x, s.ec4y, s.ec5x, s.ec5y, s.ea3x, s.ea3y))));
        output = string(abi.encodePacked(output, "S50,0,0,0Z'/></clipPath><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x13)' clip-path='url(#x32)'/><g id='x33'><animateMotion dur='31s' repeatCount='indefinite' path='M0,3c0,-3,2,3,2,0c0,-3-2,3-2,0Z'/><clipPath id='x34' clipPathUnits='userSpaceOnUse'><path d='"));
        output = string(abi.encodePacked(output, (vertex(s.ei0x, s.ei0y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.eic0x, s.eic0y, s.eic1x, s.eic1y, s.ei1x, s.ei1y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.eic2x, s.eic2y, s.eic3x, s.eic3y, s.ei2x, s.ei2y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.eic4x, s.eic4y, s.eic5x, s.eic5y, s.ei3x, s.ei3y))));
        output = string(abi.encodePacked(output, "Z'/></clipPath><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x14)' clip-path='url(#x34)'/></g></g><g><g transform='scale(-1,1)'><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x12)' clip-path='url(#x32)'/><use xlink:href='#x33'/></g></g></g><g style='filter:url(#x24)'><clipPath id='x35' clipPathUnits='userSpaceOnUse'><path d='"));
        output = string(abi.encodePacked(output, (vertex(s.fa0x, s.fa0y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.fc0x, s.fc0y, s.fc1x, s.fc1y, s.fa1x, s.fa1y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.fc2x, s.fc2y, s.fc3x, s.fc3y, s.fa2x, s.fa2y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.fc4x, s.fc4y, s.fc5x, s.fc5y, s.fa3x, s.fa3y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(-s.fc5x, s.fc5y, -s.fc4x, s.fc4y, -s.fa2x, s.fa2y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(-s.fc3x, s.fc3y, -s.fc2x, s.fc2y, -s.fa1x, s.fa1y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(-s.fc1x, s.fc1y, -s.fc0x, s.fc0y, -s.fa0x, s.fa0y))));
        output = string(abi.encodePacked(output, "z'/></clipPath><g clip-path='url(#x35)'><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x3)'/><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.faceParts_round ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><ellipse style='fill:url(#x4)' cx='0' cy='"));
        output = string(abi.encodePacked(output, intToString((s.na0y+60))));
        output = string(abi.encodePacked(output, "' rx='60' ry='60'/></g><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.faceParts_triangle ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><path style='fill:url(#x4);stroke:url(#x4);stroke-linejoin:round;stroke-linecap:round;stroke-width:6' d='M0,"));
        output = string(abi.encodePacked(output, intToString((s.na0y))));
        output = string(abi.encodePacked(output, "L-124,"));
        output = string(abi.encodePacked(output, intToString((s.na0y + 100))));
        output = string(abi.encodePacked(output, "L124,"));
        output = string(abi.encodePacked(output, intToString((s.na0y + 100))));
        output = string(abi.encodePacked(output, "Z'/></g><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.faceParts_whiskers ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><ellipse style='fill:url(#x4)' cx='10' cy='"));
        output = string(abi.encodePacked(output, intToString((s.na0y + 6))));
        output = string(abi.encodePacked(output, "' rx='11' ry='11'/><ellipse style='fill:url(#x4)' cx='-10' cy='"));
        output = string(abi.encodePacked(output, intToString((s.na0y + 6))));
        output = string(abi.encodePacked(output, "' rx='11' ry='11'/></g><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.faceParts_ear ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><path style='fill:url(#x4)' d='"));
        output = string(abi.encodePacked(output, (vertex(s.ea0x, s.ea0y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.earMidx - 20, s.earMidy + 15, s.earMidx + 15, s.earMidy + 15, s.ea3x, s.ea3y))));
        output = string(abi.encodePacked(output, "L150,-150Z'/></g><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.faceParts_temple ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><ellipse style='fill:url(#x6)' cx='-68' cy='"));
        output = string(abi.encodePacked(output, intToString((s.eyoy - 72))));
        output = string(abi.encodePacked(output, "' rx='75' ry='100'/></g><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.faceParts_chin ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><path style='fill:url(#x4);stroke:url(#x4);stroke-linejoin:round;stroke-linecap:round;stroke-width:12' d='M-16,"));
        output = string(abi.encodePacked(output, intToString((s.na0y + 5))));
        output = string(abi.encodePacked(output, "L16,"));
        output = string(abi.encodePacked(output, intToString((s.na0y + 5))));
        output = string(abi.encodePacked(output, "L"));
        output = string(abi.encodePacked(output, intToString((s.tw))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.na0y + 80))));
        output = string(abi.encodePacked(output, "L"));
        output = string(abi.encodePacked(output, intToString((-s.tw))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.na0y + 80))));
        output = string(abi.encodePacked(output, "Z'/></g><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.faceParts_nose ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><path style='fill:url(#x4);stroke:url(#x4);stroke-linejoin:round;stroke-linecap:round;stroke-width:12' d='M0,5L-16,"));
        output = string(abi.encodePacked(output, intToString((s.na0y + 5))));
        output = string(abi.encodePacked(output, "L16,"));
        output = string(abi.encodePacked(output, intToString((s.na0y + 5))));
        output = string(abi.encodePacked(output, "Z'/></g><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.faceParts_mask ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "'><ellipse style='fill:url(#x9)' cx='0' cy='"));
        output = string(abi.encodePacked(output, intToString((s.fhy))));
        output = string(abi.encodePacked(output, "' rx='16' ry='35'/><ellipse style='fill:url(#x10)' cx='-76' cy='"));
        output = string(abi.encodePacked(output, intToString((s.eyoy - 50))));
        output = string(abi.encodePacked(output, "' rx='70' ry='100'/><ellipse style='fill:url(#x9)' cx='76' cy='"));
        output = string(abi.encodePacked(output, intToString((s.eyoy - 50))));
        output = string(abi.encodePacked(output, "' rx='70' ry='100'/></g><g><path opacity='"));
        output = string(abi.encodePacked(output, intToString(s.faceParts_tabbyCheeks ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "' id='x36' style='fill:url(#x5);filter:url(#x25)' d='M"));
        output = string(abi.encodePacked(output, intToString(-(s.chkx+30))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.chky-5))));
        output = string(abi.encodePacked(output, "c60,0,60,5,60,5c0,5,-60,5,-60,5z'/><use xlink:href='#x36' transform='translate(0,14)'/><use xlink:href='#x36' transform='translate(0,-14)'/><use xlink:href='#x36' transform='translate(0,0) scale(-1,1)'/><use xlink:href='#x36' transform='translate(0,14) scale(-1,1)'/><use xlink:href='#x36' transform='translate(0,-14) scale(-1,1)'/><path opacity='"));
        output = string(abi.encodePacked(output, intToString(s.faceParts_tabbyForehead ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "' id='x37' style='fill:url(#x5);filter:url(#x25)' d='M-20,"));
        output = string(abi.encodePacked(output, intToString((s.fhy-30))));
        output = string(abi.encodePacked(output, "c0,60,5,60,5,60c5,0,5,-60,5,-60z'/><use xlink:href='#x37' transform='translate(15,4)'/><use xlink:href='#x37' transform='translate(30,0)'/></g></g></g></g><g><g transform='translate("));
        output = string(abi.encodePacked(output, intToString((s.eyox))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.eyoy))));
        output = string(abi.encodePacked(output, ") translate(-"));
        output = string(abi.encodePacked(output, intToString((s.eyox))));
        output = string(abi.encodePacked(output, ",-"));
        output = string(abi.encodePacked(output, intToString((s.eyoy))));
        output = string(abi.encodePacked(output, ")'><clipPath id='x38' clipPathUnits='userSpaceOnUse'><path id='x39' transform='translate("));
        output = string(abi.encodePacked(output, intToString((s.eyox))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.eyoy))));
        output = string(abi.encodePacked(output, ") scale(1,1) rotate("));
        output = string(abi.encodePacked(output, intToString((s.eyr_100*180*100/100/314))));
        output = string(abi.encodePacked(output, ")' d='"));
        output = string(abi.encodePacked(output, (vertex((s.eya0x - s.eysl), s.eya0y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc0x, s.eyc0y, s.eyc1x, s.eyc1y, s.eya1x, s.eya1y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc2x, s.eyc2y, s.eyc3x, s.eyc3y, (s.eya2x + s.eysr), s.eya2y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc4x, s.eyc4y, s.eyc5x, s.eyc5y, s.eya3x, s.eya3y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc6x, s.eyc6y, s.eyc7x, s.eyc7y, (s.eya0x - s.eysl), s.eya0y))));
        output = string(abi.encodePacked(output, "z'><animate attributeName='d' type='xml' repeatCount='indefinite' dur='4s' keyTimes='0;0.4;0.5;0.6;1' values=' "));
        output = string(abi.encodePacked(output, (vertex((s.eya0x - s.eysl), s.eya0y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc0x, s.eyc0y, s.eyc1x, s.eyc1y, s.eya1x, s.eya1y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc2x, s.eyc2y, s.eyc3x, s.eyc3y, (s.eya2x + s.eysr), s.eya2y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc4x, s.eyc4y, s.eyc5x, s.eyc5y, s.eya3x, s.eya3y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc6x, s.eyc6y, s.eyc7x, s.eyc7y, (s.eya0x - s.eysl), s.eya0y))));
        output = string(abi.encodePacked(output, " z; "));
        output = string(abi.encodePacked(output, (vertex((s.eya0x - s.eysl), s.eya0y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc0x, s.eyc0y, s.eyc1x, s.eyc1y, s.eya1x, s.eya1y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc2x, s.eyc2y, s.eyc3x, s.eyc3y, (s.eya2x + s.eysr), s.eya2y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc4x, s.eyc4y, s.eyc5x, s.eyc5y, s.eya3x, s.eya3y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc6x, s.eyc6y, s.eyc7x, s.eyc7y, (s.eya0x - s.eysl), s.eya0y))));
        output = string(abi.encodePacked(output, " z; "));
        output = string(abi.encodePacked(output, (vertex((s.eya0x - s.eysl), s.eya0y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc0x, s.eyb/2, s.eyc1x, s.eyb/1, s.eya1x, s.eyb/1))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc2x, s.eyb/1, s.eyc3x, s.eyb/2, (s.eya2x + s.eysr), s.eya2y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc4x, s.eyc4y, s.eyc5x, s.eyc5y, s.eya3x, s.eya3y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc6x, s.eyc6y, s.eyc7x, s.eyc7y, (s.eya0x - s.eysl), s.eya0y))));
        output = string(abi.encodePacked(output, " z; "));
        output = string(abi.encodePacked(output, (vertex((s.eya0x - s.eysl), s.eya0y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc0x, s.eyc0y, s.eyc1x, s.eyc1y, s.eya1x, s.eya1y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc2x, s.eyc2y, s.eyc3x, s.eyc3y, (s.eya2x + s.eysr), s.eya2y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc4x, s.eyc4y, s.eyc5x, s.eyc5y, s.eya3x, s.eya3y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc6x, s.eyc6y, s.eyc7x, s.eyc7y, (s.eya0x - s.eysl), s.eya0y))));
        output = string(abi.encodePacked(output, " z; "));
        output = string(abi.encodePacked(output, (vertex((s.eya0x - s.eysl), s.eya0y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc0x, s.eyc0y, s.eyc1x, s.eyc1y, s.eya1x, s.eya1y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc2x, s.eyc2y, s.eyc3x, s.eyc3y, (s.eya2x + s.eysr), s.eya2y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc4x, s.eyc4y, s.eyc5x, s.eyc5y, s.eya3x, s.eya3y))));
        output = string(abi.encodePacked(output, " "));
        output = string(abi.encodePacked(output, (bezierVertex(s.eyc6x, s.eyc6y, s.eyc7x, s.eyc7y, (s.eya0x - s.eysl), s.eya0y))));
        output = string(abi.encodePacked(output, " z '/></path></clipPath><rect x='-300' y='-300' width='600' height='600' style='fill:url(#x16)' clip-path='url(#x38)'/><g clip-path='url(#x38)'><g transform='translate("));
        output = string(abi.encodePacked(output, intToString((s.eyox))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.eyoy))));
        output = string(abi.encodePacked(output, ")'><g id='x40'><ellipse style='fill:url(#x18)' cx='"));
        output = string(abi.encodePacked(output, intToString((s.eypox))));
        output = string(abi.encodePacked(output, "' cy='"));
        output = string(abi.encodePacked(output, intToString((s.eypoy))));
        output = string(abi.encodePacked(output, "' rx='"));
        output = string(abi.encodePacked(output, intToString((s.eypw/2))));
        output = string(abi.encodePacked(output, "' ry='"));
        output = string(abi.encodePacked(output, intToString((s.eyph/2))));
        output = string(abi.encodePacked(output, "'><animateMotion dur='20s' repeatCount='indefinite' path='M0,0c0,-5,3,5,3,0c0,-10-6,10-6,0Z'/></ellipse><g><g transform='translate("));
        output = string(abi.encodePacked(output, intToString((s.eya1x+s.eya2x+s.eypox)/3)));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.eya1y+s.eya2y+s.eypoy)/3)));
        output = string(abi.encodePacked(output, ")'><circle r='25' transform='scale(0.15)' style='fill:url(#x19);filter:url(#x27)'/></g><g transform='translate("));
        output = string(abi.encodePacked(output, intToString((s.eya0x+s.eya3x+s.eypox)/3)));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.eya0y+s.eya3y+s.eypoy)/3)));
        output = string(abi.encodePacked(output, ")'><circle r='15' transform='scale(0.15)' style='fill:url(#x19);filter:url(#x27)'/></g></g></g></g></g><use id='x41' xlink:href='#x39' style='stroke-width:2;stroke:url(#x17);fill:transparent'/></g><g transform='translate(-"));
        output = string(abi.encodePacked(output, intToString((s.eyox))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.eyoy))));
        output = string(abi.encodePacked(output, ") translate("));
        output = string(abi.encodePacked(output, intToString((s.eyox))));
        output = string(abi.encodePacked(output, ",-"));
        output = string(abi.encodePacked(output, intToString((s.eyoy))));
        output = string(abi.encodePacked(output, ")'><rect x='-300' y='-300' width='600' height='600' transform='scale(-1,1)' style='fill:url(#x15)' clip-path='url(#x38)'/><g clip-path='url(#x38)' transform='scale(-1,1)'><g transform='translate("));
        output = string(abi.encodePacked(output, intToString((s.eyox))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.eyoy))));
        output = string(abi.encodePacked(output, ") scale(-1,1)'><use xlink:href='#x40'/></g></g><use xlink:href='#x41' transform='scale(-1,1)'/></g></g><g transform='translate(0,"));
        output = string(abi.encodePacked(output, intToString((s.na0y))));
        output = string(abi.encodePacked(output, ")'><g transform='translate(0,0)'><g transform='translate(0,0)'><path style='fill:none;stroke:url(#x20);stroke-width:1.5' d='"));
        output = string(abi.encodePacked(output, (line(s.na0x, s.na0y-s.na0y, s.m0x, s.m0y-s.na0y))));
        output = string(abi.encodePacked(output, "'/><path id='x42' style='fill:none;stroke:url(#x20);stroke-width:1.5' d='"));
        output = string(abi.encodePacked(output, (bezier(s.m0x, s.m0y-s.na0y, s.m1x, s.m1y-s.na0y, s.m2x, s.m2y-s.na0y, s.m3x, s.m3y-s.na0y))));
        output = string(abi.encodePacked(output, "'/><use xlink:href='#x42' transform='scale(-1,1)'/><g opacity='"));
        output = string(abi.encodePacked(output, intToString(s.hasWhiskers ? int(1) : int(0))));
        output = string(abi.encodePacked(output, "' transform='translate(0,0)'><g id='x43' transform='translate("));
        output = string(abi.encodePacked(output, intToString((-s.whox * 5/10))));
        output = string(abi.encodePacked(output, ","));
        output = string(abi.encodePacked(output, intToString((s.whoy))));
        output = string(abi.encodePacked(output, ")'><path style='fill:none;stroke:url(#x23);stroke-width:0.8' transform='rotate("));
        output = string(abi.encodePacked(output, intToString(-17)));
        output = string(abi.encodePacked(output, ")' d='"));
        output = string(abi.encodePacked(output, (bezier(s.wa0x, s.wa0y, s.wc0x, s.wc0y, s.wc1x, s.wc1y, s.wa1x, s.wa1y))));
        output = string(abi.encodePacked(output, "'/><path style='fill:none;stroke:url(#x23);stroke-width:0.8' transform='rotate("));
        output = string(abi.encodePacked(output, intToString(-17 + (s.wha_100 * 2 *57/100))));
        output = string(abi.encodePacked(output, ")' d='"));
        output = string(abi.encodePacked(output, (bezier(s.wa0x, s.wa0y, s.wc0x, s.wc0y, s.wc1x * 9/10, s.wc1y, s.wa1x * 9/10, s.wa1y))));
        output = string(abi.encodePacked(output, "'/><path style='fill:none;stroke:url(#x23);stroke-width:0.8' opacity='"));
        output = string(abi.encodePacked(output, intToString((s.whl > 2 ? int(1) : int(0)))));
        output = string(abi.encodePacked(output, "' transform='rotate("));
        output = string(abi.encodePacked(output, intToString(-17 + (s.wha_100 * 1 *57/100))));
        output = string(abi.encodePacked(output, ")' d='"));
        output = string(abi.encodePacked(output, (bezier(s.wa0x, s.wa0y, s.wc0x, s.wc0y, s.wc1x, s.wc1y, s.wa1x, s.wa1y))));
        output = string(abi.encodePacked(output, "'/><path style='fill:none;stroke:url(#x23);stroke-width:0.8' opacity='"));
        output = string(abi.encodePacked(output, intToString((s.whl > 3 ? int(1) : int(0)))));
        output = string(abi.encodePacked(output, "' transform='rotate("));
        output = string(abi.encodePacked(output, intToString(-17 + (s.wha_100 * 3 *57/100))));
        output = string(abi.encodePacked(output, ")' d='"));
        output = string(abi.encodePacked(output, (bezier(s.wa0x, s.wa0y, s.wc0x, s.wc0y, s.wc1x * 75/100, s.wc1y, s.wa1x * 75/100, s.wa1y))));
        output = string(abi.encodePacked(output, "'/></g><use xlink:href='#x43' transform='scale(-1,1)'/></g></g></g></g><g transform='translate(0,0)'><path style='fill:url(#x21);stroke:url(#x21);stroke-linejoin:round;stroke-width:1' d='"));
        output = string(abi.encodePacked(output, (vertex(s.na0x, s.na0y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.nc0x, s.nc0y, s.nc1x, s.nc1y, s.na1x, s.na1y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.nc2x, s.nc2y, s.nc3x, s.nc3y, s.na2x, s.na2y))));
        output = string(abi.encodePacked(output, ""));
        output = string(abi.encodePacked(output, (bezierVertex(s.nc4x, s.nc4y, s.nc5x, s.nc5y, s.na0x, s.na0y))));
        output = string(abi.encodePacked(output, "Z'/><path id='x44' style='fill:url(#x22);stroke:url(#x21);stroke-linejoin:round;stroke-width:1' d='"));
        output = string(abi.encodePacked(output, (bezier(s.ni0x, s.ni0y, s.ni1x, s.ni1y, s.ni2x, s.ni2y, s.ni3x, s.ni3y))));
        output = string(abi.encodePacked(output, "'/><use xlink:href='#x44' transform='scale(-1,1)'/></g></g></g></svg>"));
        return output;
    

    }



}