  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ExperimentsContract {
    
    function toUint8(bytes memory _bytes, uint256 _start) internal pure returns (uint8) {
        require(_bytes.length >= _start + 1 , "toUint8_outOfBounds");
        uint8 tempUint;

        assembly {
            // p = _bytes + _start + 0x1
            // because the first 0x20 is the length of the array
            // mload will load memory address p
            // So loading at 0x1 would actually load
            // memory address p + 0x1
            // ? Maybe since int types are stored in little-endian
            // When a int points to memory p + 0x1, that is actually the least significant bit
            // And the big-endian bits would go "left" in bytes or actually towards the start of the bytes array
            // [p+1+32,...,p+2, p+1]
            tempUint := mload(add(add(_bytes, 0x1), _start))
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
    function toUint256_unsafe(bytes memory _bytes, uint256 _start) internal pure returns (uint256) {
        // require(_bytes.length >= _start + 32, "toUint256_outOfBounds");
        uint256 tempUint;

        assembly {
            tempUint := mload(add(add(_bytes, 0x20), _start))
        }

        return tempUint;
    }

    function get8Bit(uint256 offset) public view returns (uint256) {
        // hex'' are left to right bytes - like strings (but each hex pair is a single byte in normal hex endian 10=16)
        // [...new Array(32)].map((_,i)=> i.toString(16).padStart(2,'0')).join('')
        bytes memory data8 = hex'000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f';
        return toUint8(data8, offset);
    }
    function get16Bit(uint256 offset) public view returns (uint256) {
        bytes memory data16 = hex'0000000100020003000400050006000700080009000a000b000c000d000e000f0010001100120013001400150016001700180019001a001b001c001d001e001f';
        return toUint16(data16,offset);
    }

    function get256Bit(uint256 offset) public view returns (uint256) {
        bytes memory data = hex'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000f0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000013000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000150000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001d000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000001f';
        return toUint256(data,offset);
    }

    function create256BitString() public view returns (string memory) {
        bytes memory data = hex'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000f0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000013000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000150000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001d000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000001f';
        
        uint MAX = 20000;
        bytes memory buffer = new bytes(MAX);

        uint256 vTemp = 0;
        for(uint i = 0; i < MAX; i++){
            vTemp = toUint256_unsafe(data, (i % 30) * 32);
            buffer[i] = bytes1(uint8(48 + vTemp % 10));
        }

        return string(buffer);
    }


    function get256Bit10k_loopOnly() public view returns (uint256) {
        bytes memory data = hex'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000f0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000013000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000150000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001d000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000001f';

        uint256 v = 0;
        for(uint i = 0; i<1000;i++){
            v += 0;
            v += 1;
            v += 2;
            v += 3;
            v += 4;
            v += 5;
            v += 6;
            v += 7;
            v += 8;
            v += 9;
        }

        return v;
    }
    function get256Bit10k() public view returns (uint256) {
        bytes memory data = hex'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000f0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000013000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000150000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001d000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000001f';

        uint256 v = 0;
        for(uint i = 0; i<1000;i++){
            v += toUint256(data, 0);
            v += toUint256(data, 1);
            v += toUint256(data, 2);
            v += toUint256(data, 3);
            v += toUint256(data, 4);
            v += toUint256(data, 5);
            v += toUint256(data, 6);
            v += toUint256(data, 7);
            v += toUint256(data, 8);
            v += toUint256(data, 9);
        }

        return v;
    }
    function get256Bit10k_unsafe() public view returns (uint256) {
        bytes memory data = hex'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000f0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000013000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000150000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001d000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000001f';

        uint256 v = 0;
        for(uint i = 0; i<1000;i++){
            v += toUint256_unsafe(data, 0);
            v += toUint256_unsafe(data, 1);
            v += toUint256_unsafe(data, 2);
            v += toUint256_unsafe(data, 3);
            v += toUint256_unsafe(data, 4);
            v += toUint256_unsafe(data, 5);
            v += toUint256_unsafe(data, 6);
            v += toUint256_unsafe(data, 7);
            v += toUint256_unsafe(data, 8);
            v += toUint256_unsafe(data, 9);
        }

        return v;
    }
    function get256Bit10k_inline() public view returns (uint256) {
        bytes memory data = hex'0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000b000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000d000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000f0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001100000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000013000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000150000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001700000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000019000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000001b000000000000000000000000000000000000000000000000000000000000001c000000000000000000000000000000000000000000000000000000000000001d000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000001f';

        uint256 v = 0;
        uint256 vTemp = 0;
        for(uint i = 0; i<1000;i++){
            assembly { vTemp := mload(add(add(data, 0x20), 0)) } v += vTemp;
            assembly { vTemp := mload(add(add(data, 0x20), 1)) } v += vTemp;
            assembly { vTemp := mload(add(add(data, 0x20), 2)) } v += vTemp;
            assembly { vTemp := mload(add(add(data, 0x20), 3)) } v += vTemp;
            assembly { vTemp := mload(add(add(data, 0x20), 4)) } v += vTemp;
            assembly { vTemp := mload(add(add(data, 0x20), 5)) } v += vTemp;
            assembly { vTemp := mload(add(add(data, 0x20), 6)) } v += vTemp;
            assembly { vTemp := mload(add(add(data, 0x20), 7)) } v += vTemp;
            assembly { vTemp := mload(add(add(data, 0x20), 8)) } v += vTemp;
            assembly { vTemp := mload(add(add(data, 0x20), 9)) } v += vTemp;
        }

        return v;
    }

    function getData_01(uint _dataByteIndex) public pure returns (string memory) {
        string memory output;
        
        // Test: 0 bytes (Baseline)
        // string memory _data = "";

        // Test: 320 bytes => 335 bytes (15 + exact byte size)
        string memory _data = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f F-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-";

        // Test: 3200 bytes => 3215 bytes (15 + exact byte size)
        // string memory _data = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f F-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f F-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f F-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f F-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f F-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f F-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f F-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f F-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f F-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f F-8' standalone='no'?><svg width='100%' height='100%' viewBox='0 0 300 300' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg'><defs><linearGradient id='x1'><stop style='stop-";
        assembly {
            
            function getData(pData, dataByteIndex) -> value {
                value := mload(add(pData, dataByteIndex))
                
                // // 42.6 bytes per 32 byte value
                // switch dataIndex
                // case 0 { value := "<?xml version='1.0' encoding='UT" }
                // case 1 { value := "F-8' standalone='no'?><svg width" }
                // case 2 { value := "='100%' height='100%' viewBox='0" }
                // case 3 { value := " 0 300 300' version='1.1' xmlns:" }
                // case 4 { value := "xlink='http://www.w3.org/1999/xl" }
                // case 5 { value := "ink' xmlns='http://www.w3.org/20" }
                // case 6 { value := "00/svg' xmlns:svg='http://www.w3" }
                // case 7 { value := ".org/2000/svg'><defs><linearGrad" }
                // case 8 { value := "ient id='x1'><stop style='stop-c" }
                // case 9 { value := "'/></linearGradient><linearGradi" }
                // case 10{ value := "B'><feGaussianBlur stdDeviation=" }
            }
            output := mload(0x40)

            let pData := add(_data,32)
            let d := getData(pData, _dataByteIndex)
            let len := 32
            mstore(add(output, 32), d)
            mstore(output, len)
            mstore(0x40, add(output, add(32,len)))
        }

        return output;
    }
}