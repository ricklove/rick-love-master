  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ExperimentsContract2 {
    
    function sequentialAccessA(bool isTrue) public pure returns (uint) {
        require(isTrue, "req_sequentialAccessA");
        uint output;

        assembly {
            function getNextData() -> data { 
                data := 0xA3
            }

            function getNextData2() -> data { 
                let p := mload(0xB3)
                data := mload(p)
                mstore(0xB5, add(p, 1))
            }

            function getNextData3() -> data { 
                let p := mload(0xC3)
                data := add(mload(p), getNextData())
                mstore(0xC5, add(p, 1))
            }

            let a := add(0xA6,getNextData())
            let b := getNextData2()
            let c := getNextData3()
            let d := add(a,add(b,add(c,getNextData())))

            let x := d
            for { let i := 0 } lt(i, 0x100) { i := add(i, 0x20) } {
                x := add(x, getNextData3())
                x := add(x, 0xD3)
            }

            output := x
        }

        return output;
    }
}