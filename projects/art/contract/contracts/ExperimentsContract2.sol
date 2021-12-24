  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ExperimentsContract2 {
    
    function sequentialAccessA(bool isTrue) public pure returns (uint) {
        require(isTrue, "req_sequentialAccessA");
        uint output;

        assembly {
            let mem := mload(0x40)

            // Load stack
            let a := mload(add(mem,0x10))
            let b := mload(add(mem,0x11))
            let c := mload(add(mem,0x12))
            let d := mload(add(mem,0x13))
            let e := mload(add(mem,0x14))
            let f := mload(add(mem,0x15))
            let g := mload(add(mem,0x16))
            let h := mload(add(mem,0x17))
            let i := mload(add(mem,0x18))
            let j := mload(add(mem,0x19))
            
            // Load mem var to stack (7 bytes per line)
            a := mload(add(mem,0xA0))
            b := mload(add(mem,0xA1))
            c := mload(add(mem,0xA2))
            d := mload(add(mem,0xA3))
            e := mload(add(mem,0xA4))
            f := mload(add(mem,0xA5))
            g := mload(add(mem,0xA6))
            h := mload(add(mem,0xA7))
            i := mload(add(mem,0xA8))
            j := mload(add(mem,0xA9))

            // Add memory var to stack var (~20 bytes per line)
            a := add(a, mload(add(mem,0xB0)))
            b := add(b, mload(add(mem,0xB1)))
            c := add(c, mload(add(mem,0xB2)))
            d := add(d, mload(add(mem,0xB3)))
            e := add(e, mload(add(mem,0xB4)))
            f := add(f, mload(add(mem,0xB5)))
            g := add(g, mload(add(mem,0xB6)))
            h := add(h, mload(add(mem,0xB7)))
            i := add(i, mload(add(mem,0xB8)))
            j := add(j, mload(add(mem,0xB9)))

            // Add Constant to stack var (6 bytes per line)
            a := add(a, 0xC0)
            b := add(b, 0xC1)
            c := add(c, 0xC2)
            d := add(d, 0xC3)
            e := add(e, 0xC4)
            f := add(f, 0xC5)
            g := add(g, 0xC6)
            h := add(h, 0xC7)
            i := add(i, 0xC8)
            j := add(j, 0xC9)

            // Add Constant to memory var and save to memory (13 bytes per line, 14 for 2byte constant or address)
            mstore(add(mem,0xD0), add(mload(add(mem,0xE0)), 0xF0))
            mstore(add(mem,0xD1), add(mload(add(mem,0xE1)), 0xF1))
            mstore(add(mem,0xD2), add(mload(add(mem,0xE2)), 0xF2))
            mstore(add(mem,0xD3), add(mload(add(mem,0xE3)), 0xF3))
            mstore(add(mem,0xD4), add(mload(add(mem,0xE4)), 0xF4))
            mstore(add(mem,0xD5), add(mload(add(mem,0xE5)), 0xF5))
            mstore(add(mem,0xD6), add(mload(add(mem,0xE6)), 0xF6))
            mstore(add(mem,0xD7), add(mload(add(mem,0xE7)), 0xF7))
            mstore(add(mem,0xD8), add(mload(add(mem,0xE8)), 0xF8))
            mstore(add(mem,0xD9), add(mload(add(mem,0xE9)), 0xF9))

            // Add 2 memory var and save to memory (~22 bytes per line)
            let mem2 := add(mem,0xFF00)
            let mem3 := add(mem2,0xFF00)
            mstore(add(mem3,0xD0), add(mload(add(mem2,0xE0)), mload(add(mem,0xF0))))
            mstore(add(mem3,0xD1), add(mload(add(mem2,0xE1)), mload(add(mem,0xF1))))
            mstore(add(mem3,0xD2), add(mload(add(mem2,0xE2)), mload(add(mem,0xF2))))
            mstore(add(mem3,0xD3), add(mload(add(mem2,0xE3)), mload(add(mem,0xF3))))
            mstore(add(mem3,0xD4), add(mload(add(mem2,0xE4)), mload(add(mem,0xF4))))
            mstore(add(mem3,0xD5), add(mload(add(mem2,0xE5)), mload(add(mem,0xF5))))
            mstore(add(mem3,0xD6), add(mload(add(mem2,0xE6)), mload(add(mem,0xF6))))
            mstore(add(mem3,0xD7), add(mload(add(mem2,0xE7)), mload(add(mem,0xF7))))
            mstore(add(mem3,0xD8), add(mload(add(mem2,0xE8)), mload(add(mem,0xF8))))
            mstore(add(mem3,0xD9), add(mload(add(mem2,0xE9)), mload(add(mem,0xF9))))

            let x := d
            x := add(x,a)
            x := add(x,b)
            x := add(x,c)
            x := add(x,d)
            x := add(x,e)
            x := add(x,f)
            x := add(x,g)
            x := add(x,h)
            x := add(x,i)
            x := add(x,j)

            output := x
        }

        return output;
    }

    function selectBit(bool isTrue) public pure returns (uint) {
        require(isTrue, "selectBit");
        uint output;

        assembly {
            let mem := mload(0x40)
            output := add(output, mem)

            // ~140 bytes 
            function selectBitWithEmbeddedLength(bitArray, selector) -> iBit { 
                // Max bitArray length = 13, so requires 4bits for length + 13 bits => at least 17 bits => 3 bytes
                let length := and(bitArray, 0xf)
                let nBit1 := add(1,mod(selector, length))

                bitArray := shr(4, bitArray)

                for { let i := 0 } lt(i, 13) { i := add(i, 1) } {
                    if mod(shr(i,bitArray), 2) {
                        nBit1 := sub(nBit1,1)
                    }
                    if iszero(nBit1) {
                        iBit := i
                        leave
                    }
                }
            }
            output := add(output, selectBitWithEmbeddedLength(mem, 5))
            output := add(output, selectBitWithEmbeddedLength(mem, 7))
            output := add(output, selectBitWithEmbeddedLength(mem, 11))
            output := add(output, selectBitWithEmbeddedLength(mem, 13))

            // ~140 bytes 
            function selectBitNoEmbeddedLength(bitArray, selector) -> iBit { 
                // Max bitArray length = 13, so requires 2 bytes
                let nBit1 := add(1,selector)

                for {} true {} {
                    for { let i := 0 } lt(i, 13) { i := add(i, 1) } {
                        if mod(shr(i,bitArray), 2) {
                            nBit1 := sub(nBit1,1)
                        }
                        if iszero(nBit1) {
                            iBit := i
                            leave
                        }
                    }
                }
            }
            output := add(output, selectBitNoEmbeddedLength(mem, 5))
            output := add(output, selectBitNoEmbeddedLength(mem, 7))
            output := add(output, selectBitNoEmbeddedLength(mem, 11))
            output := add(output, selectBitNoEmbeddedLength(mem, 13))


            // ~80 bytes 
            function selectByteArrayValue(byteArray, selector) -> bValue { 
                // Max bitArray length = 13, so requires 14 bytes (length + 13 values)
                let len := and(0xff, byteArray)
                let nByte := add(1,mod(selector, len))
                bValue := and(0xff, shr(mul(8,nByte), byteArray))
            }
            output := add(output, selectByteArrayValue(mem, 5))
            output := add(output, selectByteArrayValue(mem, 7))
            output := add(output, selectByteArrayValue(mem, 11))
            output := add(output, selectByteArrayValue(mem, 13))


            // ~270 bytes 
            function selectiPallete(rvs_breed, rvs_palette) -> iOutput { 
                // s.breed_data = 
                //       s.rvs_breed < 51 ? int(0x32104019876543210a654040000) /* black */
                //     : s.rvs_breed < 77 ? int(0x210311cba046020001) /* white */
                //     : s.rvs_breed < 177 ? int(0x2103432398765432197654321700f2) /* tabby */
                //     : s.rvs_breed < 197 ? int(0x31518764106654040003) /* shorthair */
                //     : s.rvs_breed < 214 ? int(0x210361c12610004) /* calico */
                //     : s.rvs_breed < 224 ? int(0x2103718026020005) /* siamese */
                //     : s.rvs_breed < 229 ? int(0x2103b10101bf06) /* sphynx */
                //     : s.rvs_breed < 234 ? int(0x102c161832c01f7) /* sandcat */
                //     : s.rvs_breed < 239 ? int(0x2103d161832d11f8) /* toyger */
                //     : s.rvs_breed < 251 ? int(0x419829876543219865432170079) /* alien */
                //     : int(0x51a19654326876543218007a) /* zombie */
                //     ;

                // b_palettes:[0],     
                // b_palettes:[1],     
                // b_palettes:[2,3,4], 
                // b_palettes:[5],     
                // b_palettes:[6],     
                // b_palettes:[7],     
                // b_palettes:[11],    
                // b_palettes:[12],    
                // b_palettes:[13],    
                // b_palettes:[8,9],   
                // b_palettes:[10],    

                if lt(rvs_breed,  51) { iOutput := 0  leave }
                if lt(rvs_breed,  77) { iOutput := 1  leave }
                if lt(rvs_breed, 177) { 
                    switch mod(rvs_palette, 3)
                    case 0            { iOutput := 2  leave }  
                    case 1            { iOutput := 3  leave }  
                    default           { iOutput := 4  leave }  
                }
                if lt(rvs_breed, 197) { iOutput := 5  leave }
                if lt(rvs_breed, 214) { iOutput := 6  leave }
                if lt(rvs_breed, 224) { iOutput := 7  leave }
                if lt(rvs_breed, 229) { iOutput := 11 leave }
                if lt(rvs_breed, 234) { iOutput := 12 leave }
                if lt(rvs_breed, 239) { iOutput := 13 leave }
                if lt(rvs_breed, 251) { 
                    switch mod(rvs_palette, 2)
                    case 0            { iOutput := 8  leave }  
                    default           { iOutput := 9  leave }  
                }
             /*if lt(rvs_breed, 251){*/ iOutput := 10 /*leave}*/
            }
            output := add(output, selectiPallete(mem, mem))

            // ~300 bytes 
            function selectBreedData(rvs_breed) -> iOutput { 
                if lt(rvs_breed,  51) { iOutput := 0x32104019876543210a654040000     leave }
                if lt(rvs_breed,  77) { iOutput := 0x210311cba046020001              leave }
                if lt(rvs_breed, 177) { iOutput := 0x2103432398765432197654321700f2  leave }
                if lt(rvs_breed, 197) { iOutput := 0x31518764106654040003            leave }
                if lt(rvs_breed, 214) { iOutput := 0x210361c12610004                 leave }
                if lt(rvs_breed, 224) { iOutput := 0x2103718026020005                leave }
                if lt(rvs_breed, 229) { iOutput := 0x2103b10101bf06                  leave }
                if lt(rvs_breed, 234) { iOutput := 0x102c161832c01f7                 leave }
                if lt(rvs_breed, 239) { iOutput := 0x2103d161832d11f8                leave }
                if lt(rvs_breed, 251) { iOutput := 0x419829876543219865432170079     leave }
             /*if lt(rvs_breed, 251){*/ iOutput := 0x51a19654326876543218007a        /*leave}*/
            }
            output := add(output, selectBreedData(mem))
        }

        return output;
    }
}