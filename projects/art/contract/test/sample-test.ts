import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { fail } from 'assert';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { NftContract } from '../typechain/NftContract'

describe(`NftContract`, async () => {

  let contract = null as unknown as NftContract;
  let accounts = null as unknown as {artist:SignerWithAddress, other1:SignerWithAddress};
  
  before(async ()=>{
    const NftProjects = await ethers.getContractFactory('NftContract');
    contract = await NftProjects.deploy() as NftContract;
    await contract.deployed();
    const [artist, other1] = await ethers.getSigners();
    accounts = {artist, other1};

  });

  
  let PROJ_ID = 3;
  let RES_COUNT = 7;
  let MINT_PRICE = 42;
  let GAS_PRICE_MAX = ethers.utils.parseUnits('100', 9);

  let lastTotalSupply = 0;
  let lastBalance_artist = 0;
  let lastBalance_other1 = 0;

  beforeEach(async () => {
    PROJ_ID++;
    RES_COUNT++;
    lastTotalSupply = (await contract.connect(accounts.artist).totalSupply()).toNumber();
    lastBalance_artist = (await contract.connect(accounts.artist).balanceOf(accounts.artist.address)).toNumber();
    lastBalance_other1 = (await contract.connect(accounts.artist).balanceOf(accounts.other1.address)).toNumber();
  });


  describe(`metadata`, ()=>{

    it(`Should return contractURI`, async ()=>{
      const contractURI = await contract.connect(accounts.artist).contractURI();
      expect(contractURI).contain('/contract.json');
    });

    it(`Should return tokenURI`, async ()=>{
      const tokenURI = await contract.connect(accounts.artist).tokenURI(42)
      expect(tokenURI).contain('/42.json');
    });

    it(`Should change baseURI`, async ()=>{
      await contract.connect(accounts.artist).setBaseURI('https://test.com/');
      const contractURI = await contract.connect(accounts.artist).contractURI();
      expect(contractURI).equal('https://test.com/contract.json');
    });

    it(`!onlyArtist: Should FAIL to change baseURI`, async () => {
      await expect(
        contract.connect(accounts.other1).setBaseURI('https://test.com/')
      ).reverted;
    });

  });

  describe(`project admin`, () => {

    it(`Should create project with reserves`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      const projectIdLast = await contract.connect(accounts.artist).projectIdLast();
      const {projectTokenCount, projectTokenSupply, projectMintPrice} = await contract.connect(accounts.artist).projectDetails(PROJ_ID);
      const totalSupply = await contract.connect(accounts.artist).totalSupply();
      const balance = await contract.connect(accounts.artist).balanceOf(accounts.artist.address);

      expect(projectIdLast,'projectIdLast').equal(PROJ_ID);
      expect(totalSupply,'totalSupply').equal(lastTotalSupply + RES_COUNT);
      expect(balance,'balance').equal(lastBalance_artist + RES_COUNT);
      expect(projectTokenSupply,'projectTokenSupply').equal(RES_COUNT);
      expect(projectTokenCount,'projectTokenCount').equal(RES_COUNT);
      expect(projectMintPrice,'projectMintPrice').equal(MINT_PRICE);
    });

    it(`Should FAIL to create project twice`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);

      await expect(
        contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE)
      ).reverted;
    });

    it(`Should set project supply`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID, RES_COUNT + 100);

      const projectIdLast = await contract.connect(accounts.artist).projectIdLast();
      const {projectTokenCount, projectTokenSupply, projectMintPrice} = await contract.connect(accounts.artist).projectDetails(PROJ_ID);
      const totalSupply = await contract.connect(accounts.artist).totalSupply();
      const balance = await contract.connect(accounts.artist).balanceOf(accounts.artist.address);

      // Unchanged
      expect(projectIdLast,'projectIdLast').equal(PROJ_ID);
      expect(balance,'balance').equal(lastBalance_artist + RES_COUNT);
      expect(projectTokenCount,'projectTokenCount').equal(RES_COUNT);
      expect(projectMintPrice,'projectMintPrice').equal(MINT_PRICE);

      // Changed
      expect(totalSupply,'totalSupply').equal(lastTotalSupply + RES_COUNT + 100);
      expect(projectTokenSupply,'projectTokenSupply').equal(RES_COUNT + 100);
    });

    it(`Should FAIL to set project supply below minted`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await expect(
        contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID,RES_COUNT)
      ).reverted;
    });

    it(`Should set project mint price`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist).setProjectMintPrice(PROJ_ID, MINT_PRICE + 100);
      const {projectMintPrice} = await contract.connect(accounts.artist).projectDetails(PROJ_ID);

      expect(projectMintPrice,'projectMintPrice').equal(MINT_PRICE + 100);
    });


  });


  describe('minting', () => {
    it(`Should mint by other`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID, RES_COUNT + 100);
      await contract.connect(accounts.artist).setGasPriceMax(GAS_PRICE_MAX);
      
      const tokenID = PROJ_ID * 1000000 + RES_COUNT + 10;
      await contract.connect(accounts.other1).mint(tokenID, { gasPrice: GAS_PRICE_MAX, value: MINT_PRICE });

      const projectIdLast = await contract.connect(accounts.other1).projectIdLast();
      const {projectTokenCount, projectTokenSupply, projectMintPrice} = await contract.connect(accounts.other1).projectDetails(PROJ_ID);
      const totalSupply = await contract.connect(accounts.other1).totalSupply();
      const balance = await contract.connect(accounts.other1).balanceOf(accounts.other1.address);

      expect(projectIdLast,'projectIdLast').equal(PROJ_ID);
      expect(totalSupply,'totalSupply').equal(lastTotalSupply + RES_COUNT + 100);
      expect(balance,'balance').equal(lastBalance_other1 + 1);
      expect(projectTokenSupply,'projectTokenSupply').equal(RES_COUNT + 100);
      expect(projectTokenCount,'projectTokenCount').equal(RES_COUNT + 1);
      expect(projectMintPrice,'projectMintPrice').equal(MINT_PRICE);
    });

  });

//   describe(`transfers`, () => {

//     it(`Should FAIL to transfer unknown token`, async ()=>{
//       await expect(
//         contract.connect(accounts.artist).transferFrom(accounts.artist.address, accounts.other1.address, reserveCount)
//       ).reverted;
//     });

//     it(`Should transfer reserved project token`, async () => {
//       await contract.connect(accounts.artist).createProject(7, reserveCount, mintPrice);
//       await contract.connect(accounts.artist).transferFrom(accounts.artist.address, accounts.other1.address, 7000000 + 41);
//     });

//     it(`Should FAIL to create project twice`, async () => {
//       await contract.connect(accounts.artist).createProject(8, reserveCount, mintPrice);
//       await expect(
//         contract.connect(accounts.artist).transferFrom(accounts.artist.address, accounts.other1.address, 8000000 + 41)
//       ).reverted;
//     });

//     it(`Should FAIL to transfer project token past reserved`, async () => {
//       await contract.connect(accounts.artist).createProject(8, reserveCount, mintPrice);
//       await expect(
//         contract.connect(accounts.artist).transferFrom(accounts.artist.address, accounts.other1.address, 8000000 + 41)
//       ).reverted;
//     });

//   });
});