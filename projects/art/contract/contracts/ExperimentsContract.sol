  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ExperimentsContract {
    
    function toUint8(bytes memory _bytes, uint256 _start) internal pure returns (uint8) {
        require(_bytes.length >= _start + 1 , "toUint8_outOfBounds");
        uint8 tempUint;

        assembly {
            // p = _bytes + _start + 0x1
            // because the first 0x20 is the length of the array
            // mload will load from _bytes.slice(p-0x20, p);
            // So loading at 0x1 would actually load
            // _bytes.slice(p-0x20 + 0x1, p + 0x1)
            // [p+1,p,p-1,p-2,...,p-31]
            // ??? - How does that make sense?
            tempUint := mload(add(add(_bytes, 0x1), _start))
            // tempUint := mload(add(add(_bytes, 0x20), _start))
        }

        return tempUint;
    }
    function toUint16(bytes memory _bytes, uint256 _start) internal pure returns (uint16) {
        require(_bytes.length >= _start + 2, "toUint16_outOfBounds");
        uint16 tempUint;

        assembly {
            tempUint := mload(add(add(_bytes, 0x2), _start))
        }

        return tempUint;
    }
    function toUint256(bytes memory _bytes, uint256 _start) internal pure returns (uint256) {
        require(_bytes.length >= _start + 32, "toUint256_outOfBounds");
        uint256 tempUint;

        assembly {
            tempUint := mload(add(add(_bytes, 0x20), _start))
        }

        return tempUint;
    }

    function get8Bit(uint256 offset) public view returns (uint256) {
        // hex'' are left to right - like strings
        // [...new Array(32)].map((_,i)=> i.toString(16).padStart(2,'0')).join('')
        bytes memory data = hex'000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f';
        return toUint8(data, offset);
    }
    function get16Bit(uint256 offset) public view returns (uint256) {
        bytes memory data = hex'0000000100020003000400050006000700080009000a000b000c000d000e000f0010001100120013001400150016001700180019001a001b001c001d001e001f';
        return toUint16(data,offset);
    }
    function get256Bit(uint256 offset) public view returns (uint256) {
        bytes memory data = hex'000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000002000000000000000000000000000000030000000000000000000000000000000400000000000000000000000000000005000000000000000000000000000000060000000000000000000000000000000700000000000000000000000000000008000000000000000000000000000000090000000000000000000000000000000a0000000000000000000000000000000b0000000000000000000000000000000c0000000000000000000000000000000d0000000000000000000000000000000e0000000000000000000000000000000f000000000000000000000000000000100000000000000000000000000000001100000000000000000000000000000012000000000000000000000000000000130000000000000000000000000000001400000000000000000000000000000015000000000000000000000000000000160000000000000000000000000000001700000000000000000000000000000018000000000000000000000000000000190000000000000000000000000000001a0000000000000000000000000000001b0000000000000000000000000000001c0000000000000000000000000000001d0000000000000000000000000000001e0000000000000000000000000000001f';
        return toUint256(data,offset);
    }

}