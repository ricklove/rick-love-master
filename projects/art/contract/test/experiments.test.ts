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
      const actual = await contract.connect(accounts.artist).get16Bit(3*2);
      expect(actual).eq(3);
    });
    it(`Should read uint16 - loop`, async () => {
      for(let i = 0; i < 32; i++){
        const actual = await contract.connect(accounts.artist).get16Bit(i*2);
        expect(actual).eq(i);  
      }
    });
    it(`Should read uint256`, async () => {
      const actual = await contract.connect(accounts.artist).get256Bit(3*32);
      expect(actual).eq(3);
    });
    it(`Should read uint256 - loop`, async () => {
      for(let i = 0; i < 32; i++){
        const actual = await contract.connect(accounts.artist).get256Bit(i*32);
        expect(actual).eq(i);  
      }
    });

    it(`Should create string`, async () => {
      const actual = await contract.connect(accounts.artist).create256BitString();
      // console.log('actual',{actual});
      expect(actual.replace(/0123456789/g,'')).eq('');
    });

    it(`Should read bytes - gas cost`, async () => {
      console.log('getNBit estimateGas', {
        gas8:   (await contract.estimateGas.get8Bit(7)).toNumber(),
        gas16:  (await contract.estimateGas.get16Bit(7)).toNumber(),
        gas256: (await contract.estimateGas.get256Bit(7)).toNumber(),
        //   1618557/1k * 10 calls + for loop
        //  - 286557/1k *  1 calls + for loop
        // = 1332000/1k *  9 calls 
        // =  148000/1k calls
        // = 148 gas/call
        gas256_10k: (await contract.estimateGas.get256Bit10k()).toNumber(),
        gas256_10k_unsafe: (await contract.estimateGas.get256Bit10k_unsafe()).toNumber(),
        gas256_10k_inline: (await contract.estimateGas.get256Bit10k_inline()).toNumber(),
        gas256_10k_loopOnly: (await contract.estimateGas.get256Bit10k_loopOnly()).toNumber(),
        create256BitString: (await contract.estimateGas.create256BitString()).toNumber(),

        /* Results:
            gas256_10k:             1648602 - 146579 = 1,502,023  ~ 150 gas/call
            gas256_10k_unsafe:       155558 - 146579 =     8,979  ~  <1 gas/call ??
            gas256_10k_inline:       155557 - 146579 =     8,978  ~  <1 gas/call ??
            gas256_10k_loopOnly:     146579   146579

            155558 - unsafe 1k * 11 calls
            155558 - unsafe 1k *  1 calls


            // With sum
            gas256_10k:             2348602 - 888579 = 1,460,023 ~ 146 gas/call
            gas256_10k_unsafe:      1035558 - 888579 =   146,979 ~  15 gas/call
            gas256_10k_inline:      1085565 - 888579 =   196,986 ~  20 gas/call
            gas256_10k_loopOnly:              888579 

            // create256BitString - 10kb string:  5300317 gas
            // create256BitString - 20kb string: 10580131 gas ~ 1058 gas/char
            
        */
      });

    });

  });

  
});
