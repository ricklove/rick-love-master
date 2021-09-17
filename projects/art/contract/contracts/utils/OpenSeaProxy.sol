// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract OwnableDelegateProxy {}
contract OpenSeaProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}