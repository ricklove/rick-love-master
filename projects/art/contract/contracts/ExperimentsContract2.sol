  
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ExperimentsContract2 {
    
    function sequentialAccessA(bool isTrue) public pure returns (uint) {
        require(isTrue, "req_sequentialAccessA");
        uint output;

        assembly {
            let a := mload(add(mload(0xA3),1))
            let b := mload(add(mload(0xA3),2))
            let c := mload(add(mload(0xA3),3))
            let d := mload(add(mload(0xA3),4))
            let e := mload(add(mload(0xA3),5))

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