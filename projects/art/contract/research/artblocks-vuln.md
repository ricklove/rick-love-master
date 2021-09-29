It's easier if you have access to a bunch of wallet addresses with some eth to spend, but basically it would work like this:

- Artblocks hash is calculated with:
  - `bytes32 hash = keccak256(abi.encodePacked(projects[_projectId].invocations, block.number, blockhash(block.number - 1), msg.sender, randomizerContract.returnValue()));`
  - `block.number` is known ahead of time
  - `blockhash(block.number - 1)` is known as soon as the last block is done (~15 secs)
  - `randomizerContract.returnValue()` is based on state and blockhash(-1), so maybe predicatable
  -
