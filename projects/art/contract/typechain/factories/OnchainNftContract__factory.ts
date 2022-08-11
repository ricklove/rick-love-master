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
    stateMutability: "pure",
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
    stateMutability: "pure",
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
        name: "tokenImageType",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "tokenImageData",
        type: "bytes",
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
    stateMutability: "pure",
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
    stateMutability: "pure",
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
    name: "tokenData",
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
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
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
    name: "tokenImage",
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
  "0x608060405234801561001057600080fd5b50600080546001600160a01b03191633179055611783806100326000396000f3fe608060405234801561001057600080fd5b50600436106100fc5760003560e01c806301ffc9a71461010157806306fdde0314610129578063081812fc1461015a578063095ea7b31461018557806309ac840f1461019a57806318160ddd146101bb57806323b872dd146101c35780633bef6a93146101d657806342842e0e146101e95780636352211e146101fc57806370a082311461020f5780638e3ddfc71461023857806395d89b4114610240578063a22cb46514610260578063b4b5b48f14610273578063b88d4fde14610296578063c87b56dd146102a9578063cf348425146102bc578063e8a3d485146102cf578063e985e9c5146102d7575b600080fd5b61011461010f366004611116565b6102ea565b60405190151581526020015b60405180910390f35b60408051808201909152600c81526b15195cdd10dbdb9d1c9858dd60a21b60208201525b60405161012091906113e5565b61016d610168366004611150565b61033c565b6040516001600160a01b039091168152602001610120565b6101986101933660046110ec565b610357565b005b6101ad6101a8366004611169565b6103b4565b604051908152602001610120565b6001546101ad565b6101986101d136600461100d565b610505565b61014d6101e4366004611150565b610510565b6101986101f736600461100d565b6105ba565b61016d61020a366004611150565b6105e0565b6101ad61021d366004610fbf565b6001600160a01b031660009081526003602052604090205490565b61014d6105fb565b604080518082019091526004815263151154d560e21b602082015261014d565b61019861026e3660046110b0565b61061b565b610286610281366004611150565b610687565b6040516101209493929190611413565b6101986102a4366004611049565b610867565b61014d6102b7366004611150565b610884565b61014d6102ca366004611150565b6108c3565b61014d61098a565b6101146102e5366004610fda565b6109d7565b60006001600160e01b031982166301ffc9a760e01b148061031b57506001600160e01b031982166380ac58cd60e01b145b8061033657506001600160e01b03198216635b5e139f60e01b145b92915050565b6000908152600760205260409020546001600160a01b031690565b6000610362826105e0565b90506001600160a01b038116331480610380575061038081336109d7565b6103a55760405162461bcd60e51b815260040161039c906113f8565b60405180910390fd5b6103af8383610a05565b505050565b600080546001600160a01b031633146103f35760405162461bcd60e51b81526020600482015260016024820152606160f81b604482015260640161039c565b84600154146104285760405162461bcd60e51b81526020600482015260016024820152603760f91b604482015260640161039c565b6001805490600061043883611534565b90915550506000858152600460209081526040909120855161045c92870190610e7e565b506000858152600660209081526040909120845161047c92860190610e7e565b506000858152600560209081526040909120835161049c92850190610e7e565b503360009081526003602052604081208054600192906104bd90849061145d565b909155505060008581526002602052604080822080546001600160a01b03191633908117909155905187929060008051602061172e833981519152908290a450929392505050565b6103af838383610a73565b6060604051806040016040528060098152602001683d913730b6b2911d1160b91b815250600460008481526020019081526020016000206040518061016001604052806101218152602001611595610121913961056c856108c3565b6040518060400160405280600b81526020016a272f3e3c2f7376673e227d60a81b8152506040516020016105a49594939291906112b4565b6040516020818303038152906040529050919050565b6105c5838383610a73565b6103af83838360405180602001604052806000815250610bed565b6000908152600260205260409020546001600160a01b031690565b60606040518060600160405280603881526020016116f660389139905090565b3360008181526008602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6000818152600460209081526040808320600683528184206005909352908320815460609384938493889391929183906106c0906114f9565b80601f01602080910402602001604051908101604052809291908181526020018280546106ec906114f9565b80156107395780601f1061070e57610100808354040283529160200191610739565b820191906000526020600020905b81548152906001019060200180831161071c57829003601f168201915b5050505050925081805461074c906114f9565b80601f0160208091040260200160405190810160405280929190818152602001828054610778906114f9565b80156107c55780601f1061079a576101008083540402835291602001916107c5565b820191906000526020600020905b8154815290600101906020018083116107a857829003601f168201915b505050505091508080546107d8906114f9565b80601f0160208091040260200160405190810160405280929190818152602001828054610804906114f9565b80156108515780601f1061082657610100808354040283529160200191610851565b820191906000526020600020905b81548152906001019060200180831161083457829003601f168201915b5050505050905093509350935093509193509193565b610872848484610a73565b61087e84848484610bed565b50505050565b6060600061089961089484610510565b610ccb565b9050806040516020016108ac9190611363565b604051602081830303815290604052915050919050565b6000818152600560205260408120805460609291610967916108e4906114f9565b80601f0160208091040260200160405190810160405280929190818152602001828054610910906114f9565b801561095d5780601f106109325761010080835404028352916020019161095d565b820191906000526020600020905b81548152906001019060200180831161094057829003601f168201915b5050505050610ccb565b60008481526006602090815260409182902091519293506108ac92849101611316565b606060006109af6040518060600160405280603881526020016116f660389139610ccb565b9050806040516020016109c29190611363565b60405160208183030381529060405291505090565b6001600160a01b03918216600090815260086020908152604080832093909416825291909152205460ff1690565b600081815260076020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610a3a826105e0565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b826001600160a01b0316610a86826105e0565b6001600160a01b031614610aac5760405162461bcd60e51b815260040161039c906113f8565b610ab581610e32565b610ae55760405162461bcd60e51b81526020600482015260016024820152604160f81b604482015260640161039c565b6001600160a01b038216610b1f5760405162461bcd60e51b81526020600482015260016024820152601d60fa1b604482015260640161039c565b6000818152600760205260409020546001600160a01b031615610b4757610b47600082610a05565b6001600160a01b0383166000908152600360205260408120805460019290610b709084906114b6565b90915550506001600160a01b0382166000908152600360205260408120805460019290610b9e90849061145d565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03868116918217909255915184939187169160008051602061172e83398151915291a4505050565b823b8015610cc457604051630a85bd0160e11b81526000906001600160a01b0386169063150b7a0290610c2a9033908a90899089906004016113a8565b602060405180830381600087803b158015610c4457600080fd5b505af1158015610c58573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c7c9190611133565b90506001600160e01b03198116630a85bd0160e11b14610cc25760405162461bcd60e51b81526020600482015260016024820152603d60f91b604482015260640161039c565b505b5050505050565b6060815160001415610ceb57505060408051602081019091526000815290565b60006040518060600160405280604081526020016116b66040913990506000600384516002610d1a919061145d565b610d249190611475565b610d2f906004611497565b90506000610d3e82602061145d565b6001600160401b03811115610d5557610d55611565565b6040519080825280601f01601f191660200182016040528015610d7f576020820181803683370190505b509050818152600183018586518101602084015b81831015610ded5760039283018051603f601282901c811687015160f890811b8552600c83901c8216880151811b6001860152600683901c8216880151811b60028601529116860151901b93820193909352600401610d93565b600389510660018114610e075760028114610e1857610e24565b613d3d60f01b600119830152610e24565b603d60f81b6000198301525b509398975050505050505050565b600080610e3e836105e0565b90506001600160a01b038116331480610e67575033610e5c8461033c565b6001600160a01b0316145b80610e775750610e7781336109d7565b9392505050565b828054610e8a906114f9565b90600052602060002090601f016020900481019282610eac5760008555610ef2565b82601f10610ec557805160ff1916838001178555610ef2565b82800160010185558215610ef2579182015b82811115610ef2578251825591602001919060010190610ed7565b50610efe929150610f02565b5090565b5b80821115610efe5760008155600101610f03565b80356001600160a01b0381168114610f2e57600080fd5b919050565b600082601f830112610f4457600080fd5b81356001600160401b0380821115610f5e57610f5e611565565b604051601f8301601f19908116603f01168101908282118183101715610f8657610f86611565565b81604052838152866020858801011115610f9f57600080fd5b836020870160208301376000602085830101528094505050505092915050565b600060208284031215610fd157600080fd5b610e7782610f17565b60008060408385031215610fed57600080fd5b610ff683610f17565b915061100460208401610f17565b90509250929050565b60008060006060848603121561102257600080fd5b61102b84610f17565b925061103960208501610f17565b9150604084013590509250925092565b6000806000806080858703121561105f57600080fd5b61106885610f17565b935061107660208601610f17565b92506040850135915060608501356001600160401b0381111561109857600080fd5b6110a487828801610f33565b91505092959194509250565b600080604083850312156110c357600080fd5b6110cc83610f17565b9150602083013580151581146110e157600080fd5b809150509250929050565b600080604083850312156110ff57600080fd5b61110883610f17565b946020939093013593505050565b60006020828403121561112857600080fd5b8135610e778161157b565b60006020828403121561114557600080fd5b8151610e778161157b565b60006020828403121561116257600080fd5b5035919050565b6000806000806080858703121561117f57600080fd5b8435935060208501356001600160401b038082111561119d57600080fd5b6111a988838901610f33565b945060408701359150808211156111bf57600080fd5b6111cb88838901610f33565b935060608701359150808211156111e157600080fd5b506110a487828801610f33565b600081518084526112068160208601602086016114cd565b601f01601f19169290920160200192915050565b8054600090600181811c908083168061123457607f831692505b602080841082141561125657634e487b7160e01b600052602260045260246000fd5b81801561126a576001811461127b576112a8565b60ff198616895284890196506112a8565b60008881526020902060005b868110156112a05781548b820152908501908301611287565b505084890196505b50505050505092915050565b600086516112c6818460208b016114cd565b6112d28184018861121a565b905085516112e4818360208a016114cd565b85519101906112f78183602089016114cd565b845191019061130a8183602088016114cd565b01979650505050505050565b6a646174613a696d6167652f60a81b81526000611336600b83018561121a565b670ed8985cd94d8d0b60c21b815283516113578160088401602088016114cd565b01600801949350505050565b7f646174613a6170706c69636174696f6e2f6a736f6e3b6261736536342c00000081526000825161139b81601d8501602087016114cd565b91909101601d0192915050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906113db908301846111ee565b9695505050505050565b602081526000610e7760208301846111ee565b6020808252600190820152606f60f81b604082015260600190565b84815260806020820152600061142c60808301866111ee565b828103604084015261143e81866111ee565b9050828103606084015261145281856111ee565b979650505050505050565b600082198211156114705761147061154f565b500190565b60008261149257634e487b7160e01b600052601260045260246000fd5b500490565b60008160001904831182151516156114b1576114b161154f565b500290565b6000828210156114c8576114c861154f565b500390565b60005b838110156114e85781810151838201526020016114d0565b8381111561087e5750506000910152565b600181811c9082168061150d57607f821691505b6020821081141561152e57634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156115485761154861154f565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b03198116811461159157600080fd5b5056fe222c22696d616765223a223c7376672077696474683d273130302527206865696768743d2731303025272076696577426f783d273020302033322033322720786d6c6e733d27687474703a2f2f7777772e77332e6f72672f323030302f7376672720786d6c6e733a7376673d27687474703a2f2f7777772e77332e6f72672f323030302f7376672720786d6c6e733a786c696e6b3d27687474703a2f2f7777772e77332e6f72672f313939392f786c696e6b273e3c696d6167652077696474683d273130302527206865696768743d273130302527207374796c653d27696d6167652d72656e646572696e673a706978656c617465643b20696d6167652d72656e646572696e673a63726973702d65646765732720786c696e6b3a687265663d274142434445464748494a4b4c4d4e4f505152535455565758595a6162636465666768696a6b6c6d6e6f707172737475767778797a303132333435363738392b2f7b226e616d65223a2254657374436f6e7472616374222c226465736372697074696f6e223a2254657374204465736372697074696f6e227dddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa2646970667358221220daa3373947b181c44bf1315e36067900c1c34b2dded47fb053250909b244374664736f6c63430008070033";

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