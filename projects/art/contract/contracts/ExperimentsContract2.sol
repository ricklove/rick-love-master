  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ExperimentsContract2 {
    
    function sequentialAccessA(bool isTrue) public pure returns (uint) {
        require(isTrue, "req_sequentialAccessA");
        uint output;

        assembly {

            let mem := mload(0x40)
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