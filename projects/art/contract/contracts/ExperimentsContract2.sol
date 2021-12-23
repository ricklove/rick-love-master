  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ExperimentsContract2 {
    
    function sequentialAccessA(bool isTrue) public pure returns (uint) {
        require(isTrue, "req_sequentialAccessA");
        uint output;

        assembly {
            let mem := mload(0x40)
            
            // Load mem var to stack
            let a := mload(add(mem,0xA0))
            let b := mload(add(mem,0xA1))
            let c := mload(add(mem,0xA2))
            let d := mload(add(mem,0xA3))
            let e := mload(add(mem,0xA4))
            let f := mload(add(mem,0xA5))
            let g := mload(add(mem,0xA6))
            let h := mload(add(mem,0xA7))
            let i := mload(add(mem,0xA8))
            let j := mload(add(mem,0xA9))

            // Add memory var to stack var
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

            // Add Constant to stack var
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

            // Add Constant to memory var and save to memory
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
}