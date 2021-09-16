const contract = artifacts.require('MinimalERC721');

module.exports = async (deployer, network, addresses) => {
  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let openSeaProxyRegistryAddress = '';
  if (network === 'rinkeby') {
    openSeaProxyRegistryAddress = '0xf57b2c51ded3a29e6891aba85459d600256cf317';
  } else {
    openSeaProxyRegistryAddress = '0xa5409ec958c83c3f309868babaca7c86dcb077c1';
  }

  // // Deploy Artwork
  // // string memory name_, string memory symbol_, string memory baseURI, address openSeaProxyRegistryAddress
  // const name = 'TestArt';
  // const symbol = 'TA';
  // const baseURI = 'https://ricklove.me/art/test/';

  // await deployer.deploy(ERC721, name, symbol, baseURI, openSeaProxyRegistryAddress, {
  //   gas: 5000000,
  // });

  await deployer.deploy(contract, {
    gas: 5000000,
  });
};
