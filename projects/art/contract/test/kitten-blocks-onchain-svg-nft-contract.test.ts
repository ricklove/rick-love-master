import { BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { KittenBlocksOnchainSvgNftContract } from '../typechain/KittenBlocksOnchainSvgNftContract';

describe(`KittenBlocksOnchainSvgNftContract`, async () => {
  let contract = null as unknown as KittenBlocksOnchainSvgNftContract;
  let accounts = null as unknown as {
    artist: SignerWithAddress;
    other1: SignerWithAddress;
    other2: SignerWithAddress;
    other3: SignerWithAddress;
  };

  const contractName = `TestContract`;
  const contractSymbol = `TEST`;

  /*
{"name": "TestContract", "description": "Test Description", "image": "<svg width='100%' height='100%' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><image width='100%' height='100%' style='image-rendering:pixelated; image-rendering:crisp-edges' xlink:href='data:image/webp;base64,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'/></svg>", "seller_fee_basis_points": 100, "fee_recipient": "0xA97F337c39cccE66adfeCB2BF99C1DdC54C2D721"}
  */
  const contractJsonObj = {
    name: contractName,
    description: `Test Description`,
    image: "data:image/png;base64,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",
    // Royalties?
    seller_fee_basis_points: 100, 
    fee_recipient: "0xA97F337c39cccE66adfeCB2BF99C1DdC54C2D721"
  } as const;
  const contractJson = JSON.stringify(contractJsonObj);

    /*
{"name": "
", "description": "This is some great art!", "image": "<svg width='100%' height='100%' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><image width='100%' height='100%' style='image-rendering:pixelated; image-rendering:crisp-edges' xlink:href='
'/></svg>"}
  */
  const tokenJsonTemplateObj = {
    name: "{SPLIT}",
    description: "This is some great art!", 
    image: "<svg/></svg>", 
    animation_url: "data:text/html;base64,", 
  } as const;
  const tokenJsonTemplate = JSON.stringify(tokenJsonTemplateObj);

  const tokenJsonTemplateParts = tokenJsonTemplate.split('{SPLIT}');
  const tokenJson_beforeName = tokenJsonTemplateParts[0];
  const tokenJson_afterNameBeforeImage = tokenJsonTemplateParts[1];
  const tokenJson_afterImage = tokenJsonTemplateParts[2];

  const parseBase64Json = <TReturn>(jsonBase64: string)=>{
    const base64 = jsonBase64
      .replace('data:application/json;base64,','')
      ;
    const json = Buffer.from(base64, 'base64').toString();

    // console.log(`json`, { base64, json });
    return JSON.parse(json) as TReturn;
  };

  const parseBase64 = (base64: string)=>{
    const base64NoPrefix = base64
      .replace(/data\:\w+\/\w+\;base64,/g,'')
      ;
    const content = Buffer.from(base64NoPrefix, 'base64').toString();
    return content;
  };

  before(async () => {
    const NftProjects = await ethers.getContractFactory(`KittenBlocksOnchainSvgNftContract`);
    contract = (await NftProjects.deploy()) as KittenBlocksOnchainSvgNftContract;
    await contract.deployed();
    const [artist, other1, other2, other3] = await ethers.getSigners();
    accounts = { artist, other1, other2, other3 };

    // await contract.setupProject(
    //   contractName,
    //   contractSymbol,
    //   contractJson,  
    //   tokenJson_beforeName,
    //   tokenJson_afterNameBeforeImage,
    //   tokenJson_afterImage
    // );
  });

  beforeEach(async () => {

  });


  describe(`metadata`, () => {
    it(`Should return name`, async () => {
      const actualName = await contract.connect(accounts.artist).name();
      expect(actualName).contain(contractName);
    });

    it(`Should return symbol`, async () => {
      const actualSymbol = await contract.connect(accounts.artist).symbol();
      expect(actualSymbol).contain(contractSymbol);
    });

    it(`Should return contractJson`, async () => {
      const contractJsonText = await contract.connect(accounts.artist).contractJson();
      const actualContractJson = JSON.parse(contractJsonText) as typeof contractJsonObj;

      expect(actualContractJson.name).contain(contractJsonObj.name);
      expect(actualContractJson.description).contain(contractJsonObj.description);
    });

    it(`Should return contractUri with json`, async () => {
      const contractURI = await contract.connect(accounts.artist).contractURI();
      const actualContractJson = parseBase64Json<typeof contractJsonObj>(contractURI);

      expect(actualContractJson.name).contain(contractJsonObj.name);
      expect(actualContractJson.description).contain(contractJsonObj.description);
    });
  });

  const tokenName = `Empty Svg`;
  const tokenImageSvg = `<svg></svg>`;
  const tokenIframeHtml = `<!DOCTYPE html><html><head><title>${tokenName}</title></head><body>${tokenImageSvg}</body></html>`;

  describe(`token`, () => {
    it(`Should createToken`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);

      const tokenUri = await contract.connect(accounts.artist).tokenURI(tokenId);
      const actualTokenJson = parseBase64Json<typeof tokenJsonTemplateObj>(tokenUri);

      expect(actualTokenJson.name).contain(tokenName);
    });

    it(`Should get token json`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);

      const tokenJsonText = await contract.connect(accounts.artist).tokenJson(tokenId);
      const actualTokenJson = JSON.parse(tokenJsonText) as typeof tokenJsonTemplateObj;

      expect(actualTokenJson.name).contain(tokenName);
      expect(actualTokenJson.image).contain(tokenImageSvg);
    });
    it(`Should get token json - animation_url`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);

      const tokenJsonText = await contract.connect(accounts.artist).tokenJson(tokenId);
      const actualTokenJson = JSON.parse(tokenJsonText) as typeof tokenJsonTemplateObj;

      const actualAnimationUrlIframeHtml = parseBase64(actualTokenJson.animation_url);

      // console.log('actualAnimationUrlIframeHtml',{actualAnimationUrlIframeHtml})
      expect(actualAnimationUrlIframeHtml).contain(tokenImageSvg);
      expect(actualAnimationUrlIframeHtml).equals(tokenIframeHtml);
    });

    it(`Should get balance of and total supply`, async () => {

      const beforeTotalSupply = await contract.connect(accounts.artist).totalSupply();
      const beforeBalance = await contract.connect(accounts.artist).balanceOf(accounts.artist.address);

      const tokenId = beforeTotalSupply;
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);

      const actualTotalSupply = await contract.connect(accounts.artist).totalSupply();
      const actualBalance = await contract.connect(accounts.artist).balanceOf(accounts.artist.address);

      expect(actualTotalSupply.toNumber(), 'actualTotalSupply').equals(beforeTotalSupply.toNumber() + 1);
      expect(actualBalance.toNumber(), 'actualBalance').equals(beforeBalance.toNumber() + 1);
    });

    it(`Should get tokenData`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);

      const [actualTokenId, actualTokenName, actualTokenImageSvg] = await contract.connect(accounts.artist).tokenData(tokenId);

      expect(actualTokenId).equals(tokenId);
      expect(actualTokenName).equals(tokenName);
      expect(actualTokenImageSvg).equals(tokenImageSvg);
    });

    it(`Should get tokenImage`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);

      const actualTokenImageSvg = await contract.connect(accounts.artist).tokenImage(tokenId);
      expect(actualTokenImageSvg).equals(tokenImageSvg);
    });
  });


  describe(`transfers`, () => {
    it(`Should transfer token`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);

      await contract
        .connect(accounts.artist)
        .transferFrom(accounts.artist.address, accounts.other1.address, tokenId);
    });

    it(`Should transfer token (safe)`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);

      await contract
        .connect(accounts.artist)
        [`safeTransferFrom(address,address,uint256)`](
          accounts.artist.address,
          accounts.other1.address,
          tokenId,
        );
    });

    it(`Should transfer token (safe data)`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);

      await contract
        .connect(accounts.artist)
        [`safeTransferFrom(address,address,uint256,bytes)`](
          accounts.artist.address,
          accounts.other1.address,
          tokenId,
          [],
        );
    });

    it(`Should FAIL to transfer unminted token (safe)`, async () => {
      const totalSupply = await contract.connect(accounts.artist).totalSupply();
      const tokenId = totalSupply;

      await expect(
        contract
          .connect(accounts.artist)
          [`safeTransferFrom(address,address,uint256)`](
            accounts.artist.address,
            accounts.artist.address,
            tokenId,
          ),
      ).revertedWith(`o`);
    });

    it(`Should FAIL to transfer unowned token - from real owner`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);

      await expect(
        contract
          .connect(accounts.other1)
          .transferFrom(accounts.artist.address, accounts.other1.address, tokenId),
      ).revertedWith(`o`);
    });
    it(`Should FAIL to transfer unowned token - from self`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);

      await expect(
        contract
          .connect(accounts.other1)
          .transferFrom(accounts.other1.address, accounts.other2.address, tokenId),
      ).revertedWith(`o`);
    });

    it(`Should FAIL to transfer to null address`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);

      await expect(
        contract
          .connect(accounts.artist)
          .transferFrom(accounts.artist.address, ethers.constants.AddressZero, tokenId),
      ).revertedWith(`t`);
    });
  });

  describe(`approvals`, () => {
    it(`Should approve other account - single`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);


      await contract.connect(accounts.artist).transferFrom(accounts.artist.address, accounts.other1.address, tokenId);
      await contract.connect(accounts.other1).approve(accounts.other2.address, tokenId);

      const tokenApprovedAccount = await contract.connect(accounts.other1).getApproved(tokenId);

      expect(tokenApprovedAccount, `tokenApprovedAccount`).equal(accounts.other2.address);
    });

    it(`Should FAIL to approve unowned token`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);


      await expect(contract.connect(accounts.other1).approve(accounts.other2.address, tokenId)).revertedWith(`o`);
    });

    it(`Should approve other account - for all`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);


      await contract.connect(accounts.artist).transferFrom(accounts.artist.address, accounts.other1.address, tokenId);
      await contract.connect(accounts.other1).setApprovalForAll(accounts.other2.address, true);

      const isApprovedForAll = await contract
        .connect(accounts.other1)
        .isApprovedForAll(accounts.other1.address, accounts.other2.address);

      expect(isApprovedForAll, `isApprovedForAll`).equal(true);
    });

    it(`Should approve other account - for all - that approves other`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);


      await contract.connect(accounts.artist).transferFrom(accounts.artist.address, accounts.other1.address, tokenId);
      await contract.connect(accounts.other1).setApprovalForAll(accounts.other2.address, true);
      await contract.connect(accounts.other2).approve(accounts.other3.address, tokenId);

      const tokenApprovedAccount = await contract.connect(accounts.other1).getApproved(tokenId);
      expect(tokenApprovedAccount, `tokenApprovedAccount`).equal(accounts.other3.address);
    });

    it(`Should reset approval after used (other1 gives from artist to other 2)`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);


      await contract.connect(accounts.artist).approve(accounts.other1.address, tokenId);
      await contract.connect(accounts.other1).transferFrom(accounts.artist.address, accounts.other2.address, tokenId);

      const tokenApprovedAccount = await contract.connect(accounts.other1).getApproved(tokenId);
      expect(tokenApprovedAccount, `tokenApprovedAccount`).equal(ethers.constants.AddressZero);
    });

    it(`Should FAIL to use approval after transfer (other1 gives from artist to other 2, then FAILS)`, async () => {

      const tokenId = await contract.connect(accounts.artist).totalSupply();
      await contract.connect(accounts.artist).createToken(tokenId, tokenName, tokenImageSvg);


      await contract.connect(accounts.artist).approve(accounts.other1.address, tokenId);
      await contract.connect(accounts.other1).transferFrom(accounts.artist.address, accounts.other2.address, tokenId);

      await expect(
        contract.connect(accounts.other1).transferFrom(accounts.other2.address, accounts.other1.address, tokenId),
      ).revertedWith(`A`);
    });
  });

});
