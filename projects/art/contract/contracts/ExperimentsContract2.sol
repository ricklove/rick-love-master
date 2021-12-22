  
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

            let a := getNextData()
            let b := getNextData()
            let c := getNextData()
            let d := getNextData()
            let e := getNextData()

            let x := d
            x := add(x,a)
            x := add(x,b)
            x := add(x,c)
            x := add(x,d)
            x := add(x,e)

            output := x
        }

        return output;
    }
}