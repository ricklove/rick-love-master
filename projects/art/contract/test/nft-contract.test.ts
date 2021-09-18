import { BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { NftContract } from '../typechain/NftContract'

describe(`NftContract`, async () => {

  let contract = null as unknown as NftContract;
  let accounts = null as unknown as {
    artist:SignerWithAddress, 
    other1:SignerWithAddress,
    other2:SignerWithAddress,
    other3:SignerWithAddress,
  };
  
  before(async ()=>{
    const NftProjects = await ethers.getContractFactory('NftContract');
    contract = await NftProjects.deploy() as NftContract;
    await contract.deployed();
    const [artist, other1, other2, other3] = await ethers.getSigners();
    accounts = {artist, other1, other2,other3};

    // FIX gas price for code coverage to work
    const defaultGasPrice = await contract.connect(accounts.artist).getGasPriceMax();
    const actualGasPrice = (await contract.connect(accounts.artist).setGasPriceMax(1)).gasPrice;
    if(actualGasPrice){
      console.log('actualGasPrice', {
        actualGasPrice_gwei: actualGasPrice.div(1000000).toNumber()/1000, 
        GAS_PRICE_MAX_gwei: GAS_PRICE_MAX.div(1000000).toNumber()/1000,
        actualGasPrice,
        GAS_PRICE_MAX,
      });
      GAS_PRICE_MAX = actualGasPrice??GAS_PRICE_MAX
    }

    await contract.connect(accounts.artist).setGasPriceMax(GAS_PRICE_MAX);

    PROJ_BUCKET_SIZE = await contract.connect(accounts.artist).projectBucketSize();
  });

  let PROJ_BUCKET_SIZE = 1000000;
  
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


  const getTokenId = (projectId:number, projectTokenIndex:number) => BigNumber.from(projectId).mul(PROJ_BUCKET_SIZE).add(projectTokenIndex);


  describe(`metadata`, ()=>{

    it(`Should return contractURI`, async ()=>{
      const contractURI = await contract.connect(accounts.artist).contractURI();
      expect(contractURI).contain('/contract.json');
    });

    it(`Should return tokenURI project 0, first token`, async ()=>{
        const tokenId = getTokenId(0,0);
        const tokenURI = await contract.connect(accounts.artist).tokenURI(tokenId)
        expect(tokenURI).contain(`/${tokenId}.json`);
    });
    it(`Should return tokenURI project 0, last token`, async ()=>{
        const tokenId = getTokenId(0,PROJ_BUCKET_SIZE-1);
        const tokenURI = await contract.connect(accounts.artist).tokenURI(tokenId)
        expect(tokenURI).contain(`/${tokenId}.json`);
    });
    it(`Should return tokenURI project 1000000, last token`, async ()=>{
        const tokenId = getTokenId(1000000,PROJ_BUCKET_SIZE-1);
        const tokenURI = await contract.connect(accounts.artist).tokenURI(tokenId)
        expect(tokenURI).contain(`/${tokenId}.json`);
    });

    it(`Should return tokenURIs`, async ()=>{
      for( let p = 0; p <= 10000; p += 2500 * Math.random()){
        for( let t = 0; t <= 1000000; t += 250000 * Math.random()){
          const tokenId = getTokenId(p|0,t|0);
          const tokenURI = await contract.connect(accounts.artist).tokenURI(tokenId)
          expect(tokenURI, `tokenId:${tokenId}`).contain(`/${tokenId}.json`);
        }
      }
    });

    it(`Should change baseURI`, async ()=>{
      await contract.connect(accounts.artist).setBaseURI('https://test.com/');
      const contractURI = await contract.connect(accounts.artist).contractURI();
      expect(contractURI).equal('https://test.com/contract.json');
    });

    it(`!onlyArtist: Should FAIL to change baseURI`, async () => {
      await expect(
        contract.connect(accounts.other1).setBaseURI('https://test.com/')
      ).revertedWith('a');
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

    it(`Should create project with reserves owned by artist`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);

      for(let i = 0; i<RES_COUNT; i++){
        const tokenOwner = await contract.connect(accounts.other1).ownerOf(getTokenId(PROJ_ID,i));
        expect(tokenOwner,'tokenOwner').equal(accounts.artist.address);
      }
    });

    it(`Should FAIL to create project twice`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);

      await expect(
        contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE)
      ).revertedWith('b');
    });

    // Reserve size cannot be whole project - too much gas since reserves are minted
    // it(`Should create project at max size`, async () => {
    //   await contract.connect(accounts.artist).createProject(PROJ_ID, PROJ_BUCKET_SIZE, MINT_PRICE)
    // });
    it(`Should create project with 1000 reserves minted`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, 1000, MINT_PRICE)
    });
    it(`Should FAIL to create project too large`, async () => {
      await expect(
        contract.connect(accounts.artist).createProject(PROJ_ID, PROJ_BUCKET_SIZE+1, MINT_PRICE)
      ).revertedWith('P');
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
      ).revertedWith('s');
    });

    it(`Should set project supply at max size`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID,PROJ_BUCKET_SIZE);
    });
    it(`Should FAIL to set project supply too large`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await expect(
        contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID,PROJ_BUCKET_SIZE+1)
      ).revertedWith('S');
    });

    it(`Should FAIL to set project supply - if not created`, async () => {
      await expect(
        contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID,10)
      ).revertedWith('n');
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
      
      const tokenId = getTokenId(PROJ_ID, RES_COUNT);
      await contract.connect(accounts.other1).mint(tokenId, { value: MINT_PRICE });

      const projectIdLast = await contract.connect(accounts.other1).projectIdLast();
      const {projectTokenCount, projectTokenSupply, projectMintPrice} = await contract.connect(accounts.other1).projectDetails(PROJ_ID);
      const totalSupply = await contract.connect(accounts.other1).totalSupply();
      const balance = await contract.connect(accounts.other1).balanceOf(accounts.other1.address);
      const tokenOwner = await contract.connect(accounts.other1).ownerOf(tokenId);

      expect(projectIdLast,'projectIdLast').equal(PROJ_ID);
      expect(totalSupply,'totalSupply').equal(lastTotalSupply + RES_COUNT + 100);
      expect(balance,'balance').equal(lastBalance_other1 + 1);
      expect(projectTokenSupply,'projectTokenSupply').equal(RES_COUNT + 100);
      expect(projectTokenCount,'projectTokenCount').equal(RES_COUNT + 1);
      expect(projectMintPrice,'projectMintPrice').equal(MINT_PRICE);
      expect(tokenOwner,'tokenOwner').equal(accounts.other1.address);
    });

    it(`Should FAIL to mint - if 10x gas`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID, RES_COUNT + 100);
      await contract.connect(accounts.artist).setGasPriceMax(GAS_PRICE_MAX);
      
      const tokenId = getTokenId(PROJ_ID, RES_COUNT + 10);
      await expect(
        contract.connect(accounts.other1).mint(tokenId, { gasPrice: GAS_PRICE_MAX.mul(10), value: MINT_PRICE })
      ).revertedWith('~');
    });
    
    it(`Should FAIL to mint - if owned (mint twice)`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID, RES_COUNT + 100);
      
      const tokenId = getTokenId(PROJ_ID, RES_COUNT);
      contract.connect(accounts.other1).mint(tokenId, { value: MINT_PRICE });

      await expect(
        contract.connect(accounts.other1).mint(tokenId, { value: MINT_PRICE })
      ).revertedWith('O');
    });

    it(`Should FAIL to mint - if not sequential`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID, RES_COUNT + 100);
      
      const tokenId = getTokenId(PROJ_ID, RES_COUNT + 1);
      await expect(
        contract.connect(accounts.other1).mint(tokenId, { value: MINT_PRICE })
      ).revertedWith('i');
    });

    it(`Should FAIL to mint - if beyond supply`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID, RES_COUNT + 1);
      
      // Can mint
      await contract.connect(accounts.other1).mint(getTokenId(PROJ_ID, RES_COUNT), { value: MINT_PRICE })
      await expect(
        // Can't mint
        contract.connect(accounts.other1).mint(getTokenId(PROJ_ID, RES_COUNT + 1), { value: MINT_PRICE })
      ).revertedWith('c');
    });

    it(`Should FAIL to mint - if not enough money`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID, RES_COUNT + 100);
      
      const tokenId = getTokenId(PROJ_ID, RES_COUNT);
      await expect(
        contract.connect(accounts.other1).mint(tokenId, { value: MINT_PRICE - 1 })
      ).revertedWith('$');
    });
    it(`Should still mint - if too much money`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID, RES_COUNT + 100);
      
      const tokenId = getTokenId(PROJ_ID, RES_COUNT);
      await contract.connect(accounts.other1).mint(tokenId, { value: MINT_PRICE * 1000 });
    });

  });

  describe(`transfers`, () => {

    it(`Should transfer reserved project token`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist).transferFrom(
        accounts.artist.address, accounts.other1.address, getTokenId(PROJ_ID, RES_COUNT-1));
    });
    
    it(`Should transfer reserved project token (safe)`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist)['safeTransferFrom(address,address,uint256)'](
        accounts.artist.address, accounts.other1.address, getTokenId(PROJ_ID, RES_COUNT-1));
    });

    it(`Should transfer reserved project token (safe data)`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await contract.connect(accounts.artist)['safeTransferFrom(address,address,uint256,bytes)'](
        accounts.artist.address, accounts.other1.address, getTokenId(PROJ_ID, RES_COUNT-1),[]);
    });

    it(`Should FAIL to transfer unminted token (safe)`, async ()=>{
      await expect(
        contract.connect(accounts.artist)['safeTransferFrom(address,address,uint256)'](
          accounts.artist.address, accounts.artist.address, getTokenId(PROJ_ID+1, 0))
      ).revertedWith('o');
    });

    it(`Should FAIL to transfer unowned token - from real owner`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await expect(
        contract.connect(accounts.other1).transferFrom(
          accounts.artist.address, accounts.other1.address, getTokenId(PROJ_ID, RES_COUNT-1))
      ).revertedWith('o');
    });
    it(`Should FAIL to transfer unowned token - from self`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await expect(
        contract.connect(accounts.other1).transferFrom(
          accounts.other1.address, accounts.other2.address, getTokenId(PROJ_ID, RES_COUNT-1))
      ).revertedWith('o');
    });
    
    it(`Should FAIL to transfer to null address`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
      await expect(
        contract.connect(accounts.artist).transferFrom(
          accounts.artist.address, ethers.constants.AddressZero, getTokenId(PROJ_ID, RES_COUNT-1))
      ).revertedWith('t');
    });

  });

  describe(`approvals`, () => {

    it(`Should approve other account - single`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);

      const tokenId = getTokenId(PROJ_ID, RES_COUNT-1);
      await contract.connect(accounts.artist).transferFrom(accounts.artist.address, accounts.other1.address, tokenId);
      await contract.connect(accounts.other1).approve(accounts.other2.address, tokenId);

      const tokenApprovedAccount = await contract.connect(accounts.other1).getApproved(tokenId);

      expect(tokenApprovedAccount,'tokenApprovedAccount').equal(accounts.other2.address);
    });

    it(`Should FAIL to approve unowned token`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);

      const tokenId = getTokenId(PROJ_ID, RES_COUNT-1);
      await expect(
        contract.connect(accounts.other1).approve(accounts.other2.address, tokenId)
      ).revertedWith('o');
    });

    it(`Should approve other account - for all`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);

      const tokenId = getTokenId(PROJ_ID, RES_COUNT-1);
      await contract.connect(accounts.artist).transferFrom(accounts.artist.address, accounts.other1.address, tokenId);
      await contract.connect(accounts.other1).setApprovalForAll(accounts.other2.address, true);

      const isApprovedForAll = await contract.connect(accounts.other1)
        .isApprovedForAll(accounts.other1.address,accounts.other2.address);

      expect(isApprovedForAll,'isApprovedForAll').equal(true);
    });

    it(`Should approve other account - for all - that approves other`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);

      const tokenId = getTokenId(PROJ_ID, RES_COUNT-1);
      await contract.connect(accounts.artist).transferFrom(accounts.artist.address, accounts.other1.address, tokenId);
      await contract.connect(accounts.other1).setApprovalForAll(accounts.other2.address, true);
      await contract.connect(accounts.other2).approve(accounts.other3.address, tokenId);

      const tokenApprovedAccount = await contract.connect(accounts.other1).getApproved(tokenId);
      expect(tokenApprovedAccount,'tokenApprovedAccount').equal(accounts.other3.address);
    });

    it(`Should reset approval after used (other1 gives from artist to other 2)`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);

      const tokenId = getTokenId(PROJ_ID, RES_COUNT-1);
      await contract.connect(accounts.artist).approve(accounts.other1.address, tokenId);
      await contract.connect(accounts.other1).transferFrom(accounts.artist.address, accounts.other2.address, tokenId);

      const tokenApprovedAccount = await contract.connect(accounts.other1).getApproved(tokenId);
      expect(tokenApprovedAccount,'tokenApprovedAccount').equal(ethers.constants.AddressZero);
    });

    it(`Should FAIL to use approval after transfer (other1 gives from artist to other 2, then FAILS)`, async () => {
      await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);

      const tokenId = getTokenId(PROJ_ID, RES_COUNT-1);
      await contract.connect(accounts.artist).approve(accounts.other1.address, tokenId);
      await contract.connect(accounts.other1).transferFrom(accounts.artist.address, accounts.other2.address, tokenId);

      await expect(
        contract.connect(accounts.other1).transferFrom(accounts.other2.address, accounts.other1.address, tokenId)
      ).revertedWith('A');
    });

  });
});