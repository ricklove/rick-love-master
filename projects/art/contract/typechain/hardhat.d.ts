/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "ExperimentsContract",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ExperimentsContract__factory>;
    getContractFactory(
      name: "ExperimentsContract2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ExperimentsContract2__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "KittenBlocksOnchainSvgNftContract",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.KittenBlocksOnchainSvgNftContract__factory>;
    getContractFactory(
      name: "NftContract",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.NftContract__factory>;
    getContractFactory(
      name: "OnchainNftContract",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OnchainNftContract__factory>;
    getContractFactory(
      name: "OnchainSvgNftContract",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OnchainSvgNftContract__factory>;

    getContractAt(
      name: "ExperimentsContract",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ExperimentsContract>;
    getContractAt(
      name: "ExperimentsContract2",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ExperimentsContract2>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "IERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC721Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "KittenBlocksOnchainSvgNftContract",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.KittenBlocksOnchainSvgNftContract>;
    getContractAt(
      name: "NftContract",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.NftContract>;
    getContractAt(
      name: "OnchainNftContract",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OnchainNftContract>;
    getContractAt(
      name: "OnchainSvgNftContract",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OnchainSvgNftContract>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
