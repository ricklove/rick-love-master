/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ExperimentsContract2,
  ExperimentsContract2Interface,
} from "../ExperimentsContract2";

const _abi = [
  {
    inputs: [
      {
        internalType: "bool",
        name: "isTrue",
        type: "bool",
      },
    ],
    name: "sequentialAccessA",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061029a806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c806352090bb914610030575b600080fd5b61004a6004803603810190610045919061015e565b610060565b60405161005791906101dd565b60405180910390f35b6000816100a2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610099906101bd565b60405180910390fd5b60006100e3565b600060a3905090565b600060b351805191506001810160b5525090565b600060c3516100d36100a9565b81510191506001810160c5525090565b6100eb6100a9565b60a6016100f66100b2565b6100fe6100c6565b6101066100a9565b8101820183018060005b610100811015610137576101226100c6565b8201915060d382019150602081019050610110565b50809550505050505080915050919050565b6000813590506101588161024d565b92915050565b6000602082840312156101745761017361021f565b5b600061018284828501610149565b91505092915050565b60006101986015836101f8565b91506101a382610224565b602082019050919050565b6101b781610215565b82525050565b600060208201905081810360008301526101d68161018b565b9050919050565b60006020820190506101f260008301846101ae565b92915050565b600082825260208201905092915050565b60008115159050919050565b6000819050919050565b600080fd5b7f7265715f73657175656e7469616c416363657373410000000000000000000000600082015250565b61025681610209565b811461026157600080fd5b5056fea264697066735822122007910aad16bb5756c28897b5dca6927d8e360664c3fc300d96b66f99c468dd4864736f6c63430008070033";

export class ExperimentsContract2__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ExperimentsContract2> {
    return super.deploy(overrides || {}) as Promise<ExperimentsContract2>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ExperimentsContract2 {
    return super.attach(address) as ExperimentsContract2;
  }
  connect(signer: Signer): ExperimentsContract2__factory {
    return super.connect(signer) as ExperimentsContract2__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ExperimentsContract2Interface {
    return new utils.Interface(_abi) as ExperimentsContract2Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ExperimentsContract2 {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ExperimentsContract2;
  }
}
