const contract = artifacts.require('OZErc721');

module.exports = async (deployer, network, addresses) => {
  await deployer.deploy(contract, {
    gas: 5000000,
  });
};
