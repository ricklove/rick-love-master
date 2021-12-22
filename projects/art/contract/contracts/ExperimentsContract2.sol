  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ExperimentsContract2 {
    
    function sequentialAccessA(bool isTrue) public pure returns (uint) {
        require(isTrue, "req_sequentialAccessA");
        uint output;

        assembly {
            function getNextData() -> data { 
                let p := mload(0xA3)
                data := mload(p)
                mstore(0xA3, add(p, 1))
            }

            let mem := mload(0x40)
            let a := getNextData()
            let b := getNextData()
            let c := getNextData()
            let d := getNextData()
            let e := getNextData()
            let f := getNextData()
            let g := getNextData()
            let h := getNextData()
            let i := getNextData()
            let j := getNextData()

            a := add(a, getNextData())
            b := add(b, getNextData())
            c := add(c, getNextData())
            d := add(d, getNextData())
            e := add(e, getNextData())
            f := add(f, getNextData())
            g := add(g, getNextData())
            h := add(h, getNextData())
            i := add(i, getNextData())
            j := add(j, getNextData())

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