# Deployments

## Accounts

- Test Rinkerby: 0x604D995eD90C2A8CD2d1baD491c198b56f12E0eB
- Main Rinkerby: 0xc9b981461552989700b2d52eac6d2733192c79c2

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

## Open Zeppelin Testing

- Test 05 - OpenZeppelin Base 721
  - gas used: 2039423
- Test 06 - OpenZeppelin 721 Contract Builder
  - gas used: 2923007
- Test 06b - OpenZeppelin 1155 Contract Builder
  - gas used: 2891451
