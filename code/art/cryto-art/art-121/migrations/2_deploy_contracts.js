const Artwork = artifacts.require("./Artwork.sol");
const ArtworkFactory = artifacts.require("./ArtworkFactory.sol");

module.exports = async (deployer, network, addresses) => {
    // OpenSea proxy registry addresses for rinkeby and mainnet.
    let proxyRegistryAddress = "";
    if (network === 'rinkeby') {
        proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
    } else {
        proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
    }

    // Deploy Artwork
    await deployer.deploy(Artwork, proxyRegistryAddress, { gas: 5000000 });

    // Deploy Artwork Factory
    await deployer.deploy(ArtworkFactory, proxyRegistryAddress, Artwork.address, { gas: 7000000 });
    const creature = await Artwork.deployed();
    await creature.transferOwnership(ArtworkFactory.address);
};