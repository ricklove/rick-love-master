import { BigNumber } from '@ethersproject/bignumber';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ExperimentsContract } from '../typechain/ExperimentsContract';

describe(`ExperimentsContract`, async () => {
  let contract = null as unknown as ExperimentsContract;
  let accounts = null as unknown as {
    artist: SignerWithAddress;
    other1: SignerWithAddress;
    other2: SignerWithAddress;
    other3: SignerWithAddress;
  };

  before(async () => {
    const NftProjects = await ethers.getContractFactory(`ExperimentsContract`);
    contract = (await NftProjects.deploy()) as ExperimentsContract;
    await contract.deployed();
    const [artist, other1, other2, other3] = await ethers.getSigners();
    accounts = { artist, other1, other2, other3 };

  });

  describe(`bytes conversions`, () => {
    it(`Should read uint8`, async () => {
      const actual = await contract.connect(accounts.artist).get8Bit(3);
      expect(actual).eq(3);
    });
    it(`Should read uint8 - loop`, async () => {
      for(let i = 0; i < 32; i++){
        const actual = await contract.connect(accounts.artist).get8Bit(i);
        expect(actual).eq(i);  
      }
    });
    it(`Should read uint16`, async () => {
      const actual = await contract.connect(accounts.artist).get16Bit(3);
      expect(actual).eq(3);
    });
    it(`Should read uint16 - loop`, async () => {
      for(let i = 0; i < 32; i++){
        const actual = await contract.connect(accounts.artist).get16Bit(i);
        expect(actual).eq(i);  
      }
    });
    it(`Should read uint256`, async () => {
      const actual = await contract.connect(accounts.artist).get256Bit(3);
      expect(actual).eq(3);
    });
    it(`Should read uint256 - loop`, async () => {
      for(let i = 0; i < 32; i++){
        const actual = await contract.connect(accounts.artist).get256Bit(i);
        expect(actual).eq(i);  
      }
    });

  });

  
});
