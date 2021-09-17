# Deployments

## Accounts

- Test (Chrome) Rinkerby: 0x604D995eD90C2A8CD2d1baD491c198b56f12E0eB
- Main (Edge ) Rinkerby: 0xc9b981461552989700b2d52eac6d2733192c79c2
- Test Account(Edge ) Rinkerby: 0xD402f87A6F27f7ed5e85B23E57c3bEe48B374C93

## Testing

- Test 01
  - Constant strings passed in constructor
  - Rinkerby: 0x474b6Fc733f2ECAe12C08863EcC160d5fe315BEC
  - gas used: 2090190
- Test 02
  - Constant strings hardcoded in constructor
  - gas used: 1995305
- Test 03
  - Constrant strings hardcoded at usage
  - gas used: 1933348
- Test 04
  - Simplify safe transfer
  - gas used: 1896857
- Test 05
  - Move function
  - gas used: 1896857
- Test 06
  - Enumerable with 10k artist owned
  - Rinkerby: 0x3ed0bC6379B8c03148d1CEE7Cfc04671c2323406
- Test 07
  - FIX Missing supportsInterface for Enumerable
  - Rinkerby: 0x5Ff9cC66b6762aCc9c9999aABa02752946CcA5D4
- Test 08
  - Test 1Billion `_totalSupply` with for loop in `tokenOfOwnerByIndex`
  - Rinkerby: 0x725f2612531848AaE639bAdED92f1d312Ac5Ea1B
  - `tokenOfOwnerByIndex` Runs out of user-node gas on etherscan at around 100,000
- Test 09
  - Add Minting
  - gas used: 2362170
  - Rinkerby: 0x893b51A1139B4e4636decE7aB6D1C421e30BB4F3
- Test 10
  - FIX Minting
  - gas used: 2447110
  - Rinkerby: 0x41fa31B6c64Cd74af0B1c4761004eaE79Ff9BcD2
- Test 11
  - Mint as transfer from null
  - gas used: 2488770
  - Rinkerby: 0x1860B49936f99e4Bc5fFE551b70E61F500570941
  - mint gas used: 112,773
- Test 12
  - TransferForMint
  - gas used: 2523102
  - Rinkerby: 0x922b56Bf702351C1ff87B9559355e8b1475b195A
  - mint gas used: 109,652
  - trans gas used: 60,755
- Test 13
  - Minimal Mintable ERC721
  - estimate gas used: 2089031
- Test 14
  - Remove open sea
  - estimate gas used: 2017572
- Test 15
  - Add Projects
  - Add Reentracy guarded minting and better fee transfer
  - estimate gas used: 2510565
- Test 16
  - Add createProject
  - estimate gas used: 2812079
- Test 17
  - Add gas price limit
  - estimate gas used: 2907122

## Open Zeppelin Testing

- Test 05 - OpenZeppelin Base 721
  - gas used: 2039423
- Test 06 - OpenZeppelin 721 Contract Builder
  - gas used: 2923007
- Test 06b - OpenZeppelin 1155 Contract Builder
  - gas used: 2891451
