/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  OnchainNftContract,
  OnchainNftContractInterface,
} from "../OnchainNftContract";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractJson",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenImageData",
        type: "string",
      },
    ],
    name: "createToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getTokenData",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data_",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "string",
        name: "contractJson",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenJson_beforeName",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenJson_afterNameBeforeImage",
        type: "string",
      },
      {
        internalType: "string",
        name: "tokenJson_afterImage",
        type: "string",
      },
    ],
    name: "setupProject",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenJson",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50600080546001600160a01b0319163317905561166d806100326000396000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c80638e3ddfc7116100ad578063b88d4fde11610071578063b88d4fde146102b9578063c87b56dd146102cc578063df3d8f40146102df578063e8a3d485146102f2578063e985e9c5146102fa57600080fd5b80638e3ddfc71461026157806395d89b4114610269578063a22cb46514610271578063b09afec114610284578063b1037e78146102a657600080fd5b806323b872dd116100f457806323b872dd146101d65780633bef6a93146101e957806342842e0e146101fc5780636352211e1461020f57806370a082311461023857600080fd5b806301ffc9a71461013157806306fdde0314610159578063081812fc1461016e578063095ea7b3146101af57806318160ddd146101c4575b600080fd5b61014461013f36600461114a565b61030d565b60405190151581526020015b60405180910390f35b61016161035f565b6040516101509190611482565b61019761017c366004611279565b6000908152600c60205260409020546001600160a01b031690565b6040516001600160a01b039091168152602001610150565b6101c26101bd366004611120565b6103f1565b005b6007545b604051908152602001610150565b6101c26101e436600461102c565b610460565b6101616101f7366004611279565b61046b565b6101c261020a36600461102c565b6104b5565b61019761021d366004611279565b6000908152600860205260409020546001600160a01b031690565b6101c8610246366004610fde565b6001600160a01b031660009081526009602052604090205490565b6101616104db565b6101616104ea565b6101c261027f3660046110e4565b6104f9565b610297610292366004611279565b610565565b60405161015093929190611495565b6101c86102b4366004611292565b6106aa565b6101c26102c7366004611068565b6107ec565b6101616102da366004611279565b610809565b6101c26102ed366004611184565b610848565b610161610906565b610144610308366004610ff9565b6109c5565b60006001600160e01b031982166301ffc9a760e01b148061033e57506001600160e01b031982166380ac58cd60e01b145b8061035957506001600160e01b03198216635b5e139f60e01b145b92915050565b60606001805461036e9061155c565b80601f016020809104026020016040519081016040528092919081815260200182805461039a9061155c565b80156103e75780601f106103bc576101008083540402835291602001916103e7565b820191906000526020600020905b8154815290600101906020018083116103ca57829003601f168201915b5050505050905090565b6000818152600860205260409020546001600160a01b03163381148061041c575061041c81336109c5565b6104515760405162461bcd60e51b81526020600482015260016024820152606f60f81b60448201526064015b60405180910390fd5b61045b83836109f3565b505050565b61045b838383610a5a565b6000818152600a60209081526040808320600b835292819020905160609361049f93600493919260059291600691016113c5565b6040516020818303038152906040529050919050565b6104c0838383610a5a565b61045b83838360405180602001604052806000815250610bfa565b60606003805461036e9061155c565b60606002805461036e9061155c565b336000818152600d602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6000818152600a60209081526040808320600b909252822081546060928392869282906105919061155c565b80601f01602080910402602001604051908101604052809291908181526020018280546105bd9061155c565b801561060a5780601f106105df5761010080835404028352916020019161060a565b820191906000526020600020905b8154815290600101906020018083116105ed57829003601f168201915b5050505050915080805461061d9061155c565b80601f01602080910402602001604051908101604052809291908181526020018280546106499061155c565b80156106965780601f1061066b57610100808354040283529160200191610696565b820191906000526020600020905b81548152906001019060200180831161067957829003601f168201915b505050505090509250925092509193909250565b600080546001600160a01b031633146106e95760405162461bcd60e51b81526020600482015260016024820152606160f81b6044820152606401610448565b836007541461071e5760405162461bcd60e51b81526020600482015260016024820152603760f91b6044820152606401610448565b6007805490600061072e83611597565b90915550506000848152600a60209081526040909120845161075292860190610e93565b506000848152600b60209081526040909120835161077292850190610e93565b503360009081526009602052604081208054600192906107939084906114c0565b909155505060008481526008602052604080822080546001600160a01b0319163390811790915590518692907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a4509192915050565b6107f7848484610a5a565b61080384848484610bfa565b50505050565b6060600061081e6108198461046b565b610cd8565b9050806040516020016108319190611400565b604051602081830303815290604052915050919050565b6000546001600160a01b031633146108865760405162461bcd60e51b81526020600482015260016024820152606160f81b6044820152606401610448565b8551610899906001906020890190610e93565b5084516108ad906002906020880190610e93565b5083516108c1906003906020870190610e93565b5082516108d5906004906020860190610e93565b5081516108e9906005906020850190610e93565b5080516108fd906006906020840190610e93565b50505050505050565b6060600061099d6003805461091a9061155c565b80601f01602080910402602001604051908101604052809291908181526020018280546109469061155c565b80156109935780601f1061096857610100808354040283529160200191610993565b820191906000526020600020905b81548152906001019060200180831161097657829003601f168201915b5050505050610cd8565b9050806040516020016109b09190611400565b60405160208183030381529060405291505090565b6001600160a01b039182166000908152600d6020908152604080832093909416825291909152205460ff1690565b6000818152600c6020908152604080832080546001600160a01b0319166001600160a01b038781169182179092556008909352818420549151859492909116917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a45050565b6000818152600860205260409020546001600160a01b03848116911614610aa75760405162461bcd60e51b81526020600482015260016024820152606f60f81b6044820152606401610448565b610ab081610e40565b610ae05760405162461bcd60e51b81526020600482015260016024820152604160f81b6044820152606401610448565b6001600160a01b038216610b1a5760405162461bcd60e51b81526020600482015260016024820152601d60fa1b6044820152606401610448565b6000818152600c60205260409020546001600160a01b031615610b4257610b426000826109f3565b6001600160a01b0383166000908152600960205260408120805460019290610b6b908490611519565b90915550506001600160a01b0382166000908152600960205260408120805460019290610b999084906114c0565b909155505060008181526008602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b823b8015610cd157604051630a85bd0160e11b81526000906001600160a01b0386169063150b7a0290610c379033908a9089908990600401611445565b602060405180830381600087803b158015610c5157600080fd5b505af1158015610c65573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c899190611167565b90506001600160e01b03198116630a85bd0160e11b14610ccf5760405162461bcd60e51b81526020600482015260016024820152603d60f91b6044820152606401610448565b505b5050505050565b6060815160001415610cf857505060408051602081019091526000815290565b60006040518060600160405280604081526020016115f86040913990506000600384516002610d2791906114c0565b610d3191906114d8565b610d3c9060046114fa565b90506000610d4b8260206114c0565b67ffffffffffffffff811115610d6357610d636115c8565b6040519080825280601f01601f191660200182016040528015610d8d576020820181803683370190505b509050818152600183018586518101602084015b81831015610dfb5760039283018051603f601282901c811687015160f890811b8552600c83901c8216880151811b6001860152600683901c8216880151811b60028601529116860151901b93820193909352600401610da1565b600389510660018114610e155760028114610e2657610e32565b613d3d60f01b600119830152610e32565b603d60f81b6000198301525b509398975050505050505050565b6000818152600860205260408120546001600160a01b031633811480610e7c57506000838152600c60205260409020546001600160a01b031633145b80610e8c5750610e8c81336109c5565b9392505050565b828054610e9f9061155c565b90600052602060002090601f016020900481019282610ec15760008555610f07565b82601f10610eda57805160ff1916838001178555610f07565b82800160010185558215610f07579182015b82811115610f07578251825591602001919060010190610eec565b50610f13929150610f17565b5090565b5b80821115610f135760008155600101610f18565b600067ffffffffffffffff80841115610f4757610f476115c8565b604051601f8501601f19908116603f01168101908282118183101715610f6f57610f6f6115c8565b81604052809350858152868686011115610f8857600080fd5b858560208301376000602087830101525050509392505050565b80356001600160a01b0381168114610fb957600080fd5b919050565b600082601f830112610fcf57600080fd5b610e8c83833560208501610f2c565b600060208284031215610ff057600080fd5b610e8c82610fa2565b6000806040838503121561100c57600080fd5b61101583610fa2565b915061102360208401610fa2565b90509250929050565b60008060006060848603121561104157600080fd5b61104a84610fa2565b925061105860208501610fa2565b9150604084013590509250925092565b6000806000806080858703121561107e57600080fd5b61108785610fa2565b935061109560208601610fa2565b925060408501359150606085013567ffffffffffffffff8111156110b857600080fd5b8501601f810187136110c957600080fd5b6110d887823560208401610f2c565b91505092959194509250565b600080604083850312156110f757600080fd5b61110083610fa2565b91506020830135801515811461111557600080fd5b809150509250929050565b6000806040838503121561113357600080fd5b61113c83610fa2565b946020939093013593505050565b60006020828403121561115c57600080fd5b8135610e8c816115de565b60006020828403121561117957600080fd5b8151610e8c816115de565b60008060008060008060c0878903121561119d57600080fd5b863567ffffffffffffffff808211156111b557600080fd5b6111c18a838b01610fbe565b975060208901359150808211156111d757600080fd5b6111e38a838b01610fbe565b965060408901359150808211156111f957600080fd5b6112058a838b01610fbe565b9550606089013591508082111561121b57600080fd5b6112278a838b01610fbe565b9450608089013591508082111561123d57600080fd5b6112498a838b01610fbe565b935060a089013591508082111561125f57600080fd5b5061126c89828a01610fbe565b9150509295509295509295565b60006020828403121561128b57600080fd5b5035919050565b6000806000606084860312156112a757600080fd5b83359250602084013567ffffffffffffffff808211156112c657600080fd5b6112d287838801610fbe565b935060408601359150808211156112e857600080fd5b506112f586828701610fbe565b9150509250925092565b60008151808452611317816020860160208601611530565b601f01601f19169290920160200192915050565b8054600090600181811c908083168061134557607f831692505b602080841082141561136757634e487b7160e01b600052602260045260246000fd5b81801561137b576001811461138c576113b9565b60ff198616895284890196506113b9565b60008881526020902060005b868110156113b15781548b820152908501908301611398565b505084890196505b50505050505092915050565b60006113f56113ef6113e96113e36113dd868c61132b565b8a61132b565b8861132b565b8661132b565b8461132b565b979650505050505050565b7f646174613a6170706c69636174696f6e2f6a736f6e3b6261736536342c00000081526000825161143881601d850160208701611530565b91909101601d0192915050565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090611478908301846112ff565b9695505050505050565b602081526000610e8c60208301846112ff565b8381526060602082015260006114ae60608301856112ff565b828103604084015261147881856112ff565b600082198211156114d3576114d36115b2565b500190565b6000826114f557634e487b7160e01b600052601260045260246000fd5b500490565b6000816000190483118215151615611514576115146115b2565b500290565b60008282101561152b5761152b6115b2565b500390565b60005b8381101561154b578181015183820152602001611533565b838111156108035750506000910152565b600181811c9082168061157057607f821691505b6020821081141561159157634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156115ab576115ab6115b2565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b0319811681146115f457600080fd5b5056fe4142434445464748494a4b4c4d4e4f505152535455565758595a6162636465666768696a6b6c6d6e6f707172737475767778797a303132333435363738392b2fa26469706673582212206bc78a55fc4811b7b14696bdf0214dbf3a058d1810a823c132d29c0dc760dea564736f6c63430008070033";

export class OnchainNftContract__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<OnchainNftContract> {
    return super.deploy(overrides || {}) as Promise<OnchainNftContract>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): OnchainNftContract {
    return super.attach(address) as OnchainNftContract;
  }
  connect(signer: Signer): OnchainNftContract__factory {
    return super.connect(signer) as OnchainNftContract__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OnchainNftContractInterface {
    return new utils.Interface(_abi) as OnchainNftContractInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OnchainNftContract {
    return new Contract(address, _abi, signerOrProvider) as OnchainNftContract;
  }
}
