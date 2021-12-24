  
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
                let length := mod(bitArray, 0xf)
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
        }

        return output;
    }
}