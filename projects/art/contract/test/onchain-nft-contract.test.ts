import { BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { OnchainNftContract } from '../typechain/OnchainNftContract';

describe(`OnchainNftContract`, async () => {
  let contract = null as unknown as OnchainNftContract;
  let accounts = null as unknown as {
    artist: SignerWithAddress;
    other1: SignerWithAddress;
    other2: SignerWithAddress;
    other3: SignerWithAddress;
  };

  const contractName = `TestContract`;
  const contractSymbol = `TEST`;

  const contractJsonObj = {
    name: contractName,
    description: `Test Description`,
    image: "data:image/png;base64,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",
    // Royalties?
    seller_fee_basis_points: 100, 
    fee_recipient: "0xA97F337c39cccE66adfeCB2BF99C1DdC54C2D721"
  } as const;
  const contractJson = JSON.stringify(contractJsonObj);

  const tokenJsonTemplateObj = {
    name: "{SPLIT}",
    description: "This is some great art!", 
    image: "<svg width='100%' height='100%' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><image width='100%' height='100%' style='image-rendering:pixelated; image-rendering:crisp-edges' xlink:href='data:image/webp;base64,{SPLIT}'/></svg>", 
  } as const;
  const tokenJsonTemplate = JSON.stringify(tokenJsonTemplateObj);

  const tokenJsonTemplateParts = tokenJsonTemplate.split('{SPLIT}');
  const tokenJson_beforeName = tokenJsonTemplateParts[0];
  const tokenJson_afterNameBeforeImage = tokenJsonTemplateParts[1];
  const tokenJson_afterImage = tokenJsonTemplateParts[2];

  before(async () => {
    const NftProjects = await ethers.getContractFactory(`OnchainNftContract`);
    contract = (await NftProjects.deploy()) as OnchainNftContract;
    await contract.deployed();
    const [artist, other1, other2, other3] = await ethers.getSigners();
    accounts = { artist, other1, other2, other3 };

    await contract.setupProject(
      contractName,
      contractSymbol,
      contractJson,  
      tokenJson_beforeName,
      tokenJson_afterNameBeforeImage,
      tokenJson_afterImage
    );
  });

  beforeEach(async () => {

  });


  describe(`metadata`, () => {
    it(`Should return contractJson`, async () => {
      const contractURI = await contract.connect(accounts.artist).contractURI();

      expect(contractURI).contain(contractJson);
    });
  });

  describe(`token`, () => {
    it(`Should return contractJson`, async () => {
      const tokenId = 1;
      const tokenName = `Rick Love Borg`;
      const tokenImageData = `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`;

      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageData);
      const tokenUri = await contract.connect(accounts.artist).tokenURI(tokenId);
      const tokenJson = JSON.parse(tokenUri) as typeof tokenJsonTemplateObj;

      console.log(`tokenUri`, {tokenUri})

      expect(tokenJson.name).contain(tokenName);
    });
  });

  // describe(`minting`, () => {
  //   it(`Should mint by other`, async () => {
  //     await contract.connect(accounts.artist).createProject(PROJ_ID, RES_COUNT, MINT_PRICE);
  //     await contract.connect(accounts.artist).setProjectTokenSupply(PROJ_ID, RES_COUNT + 100);

  //     const tokenId = getTokenId(PROJ_ID, RES_COUNT);
  //     await contract.connect(accounts.other1).mint(tokenId, { value: MINT_PRICE });

  //     const projectIdLast = await contract.connect(accounts.other1).projectIdLast();
  //     const { projectTokenCount, projectTokenSupply, projectMintPrice } = await contract
  //       .connect(accounts.other1)
  //       .projectDetails(PROJ_ID);
  //     const totalSupply = await contract.connect(accounts.other1).totalSupply();
  //     const balance = await contract.connect(accounts.other1).balanceOf(accounts.other1.address);
  //     const tokenOwner = await contract.connect(accounts.other1).ownerOf(tokenId);

  //     expect(projectIdLast, `projectIdLast`).equal(PROJ_ID);
  //     expect(totalSupply, `totalSupply`).equal(lastTotalSupply + RES_COUNT + 100);
  //     expect(balance, `balance`).equal(lastBalance_other1 + 1);
  //     expect(projectTokenSupply, `projectTokenSupply`).equal(RES_COUNT + 100);
  //     expect(projectTokenCount, `projectTokenCount`).equal(RES_COUNT + 1);
  //     expect(projectMintPrice, `projectMintPrice`).equal(MINT_PRICE);
  //     expect(tokenOwner, `tokenOwner`).equal(accounts.other1.address);
  //   });

  // });

});
