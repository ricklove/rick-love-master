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
  "0x608060405234801561001057600080fd5b50600080546001600160a01b031916331790556117bc806100326000396000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c806370a08231116100ad578063b88d4fde11610071578063b88d4fde146102f2578063c87b56dd14610305578063cf34842514610318578063e8a3d4851461032b578063e985e9c51461033357600080fd5b806370a082311461026b5780638e3ddfc71461029457806395d89b411461029c578063a22cb465146102bc578063b4b5b48f146102cf57600080fd5b806318160ddd116100f457806318160ddd1461020157806323b872dd146102095780633bef6a931461021c57806342842e0e1461022f5780636352211e1461024257600080fd5b806301ffc9a71461013157806306fdde0314610159578063081812fc1461018a578063095ea7b3146101cb57806309ac840f146101e0575b600080fd5b61014461013f366004611189565b610346565b60405190151581526020015b60405180910390f35b60408051808201909152600c81526b15195cdd10dbdb9d1c9858dd60a21b60208201525b6040516101509190611459565b6101b36101983660046111c3565b6000908152600760205260409020546001600160a01b031690565b6040516001600160a01b039091168152602001610150565b6101de6101d936600461115f565b610398565b005b6101f36101ee3660046111dc565b610407565b604051908152602001610150565b6001546101f3565b6101de61021736600461107f565b61056a565b61017d61022a3660046111c3565b610575565b6101de61023d36600461107f565b61061f565b6101b36102503660046111c3565b6000908152600260205260409020546001600160a01b031690565b6101f3610279366004611031565b6001600160a01b031660009081526003602052604090205490565b61017d610645565b604080518082019091526004815263151154d560e21b602082015261017d565b6101de6102ca366004611123565b610665565b6102e26102dd3660046111c3565b6106d1565b604051610150949392919061146c565b6101de6103003660046110bb565b6108b1565b61017d6103133660046111c3565b6108ce565b61017d6103263660046111c3565b61090d565b61017d6109d4565b61014461034136600461104c565b610a21565b60006001600160e01b031982166301ffc9a760e01b148061037757506001600160e01b031982166380ac58cd60e01b145b8061039257506001600160e01b03198216635b5e139f60e01b145b92915050565b6000818152600260205260409020546001600160a01b0316338114806103c357506103c38133610a21565b6103f85760405162461bcd60e51b81526020600482015260016024820152606f60f81b60448201526064015b60405180910390fd5b6104028383610a4f565b505050565b600080546001600160a01b031633146104465760405162461bcd60e51b81526020600482015260016024820152606160f81b60448201526064016103ef565b846001541461047b5760405162461bcd60e51b81526020600482015260016024820152603760f91b60448201526064016103ef565b6001805490600061048b8361158d565b9091555050600085815260046020908152604090912085516104af92870190610eef565b50600085815260066020908152604090912084516104cf92860190610eef565b50600085815260056020908152604090912083516104ef92850190610eef565b503360009081526003602052604081208054600192906105109084906114b6565b909155505060008581526002602052604080822080546001600160a01b0319163390811790915590518792907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a450929392505050565b610402838383610ab6565b6060604051806040016040528060098152602001683d913730b6b2911d1160b91b8152506004600084815260200190815260200160002060405180610160016040528061012181526020016115ee61012191396105d18561090d565b6040518060400160405280600b81526020016a272f3e3c2f7376673e227d60a81b815250604051602001610609959493929190611328565b6040516020818303038152906040529050919050565b61062a838383610ab6565b61040283838360405180602001604052806000815250610c56565b606060405180606001604052806038815260200161174f60389139905090565b3360008181526008602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b60008181526004602090815260408083206006835281842060059093529083208154606093849384938893919291839061070a90611552565b80601f016020809104026020016040519081016040528092919081815260200182805461073690611552565b80156107835780601f1061075857610100808354040283529160200191610783565b820191906000526020600020905b81548152906001019060200180831161076657829003601f168201915b5050505050925081805461079690611552565b80601f01602080910402602001604051908101604052809291908181526020018280546107c290611552565b801561080f5780601f106107e45761010080835404028352916020019161080f565b820191906000526020600020905b8154815290600101906020018083116107f257829003601f168201915b5050505050915080805461082290611552565b80601f016020809104026020016040519081016040528092919081815260200182805461084e90611552565b801561089b5780601f106108705761010080835404028352916020019161089b565b820191906000526020600020905b81548152906001019060200180831161087e57829003601f168201915b5050505050905093509350935093509193509193565b6108bc848484610ab6565b6108c884848484610c56565b50505050565b606060006108e36108de84610575565b610d34565b9050806040516020016108f691906113d7565b604051602081830303815290604052915050919050565b60008181526005602052604081208054606092916109b19161092e90611552565b80601f016020809104026020016040519081016040528092919081815260200182805461095a90611552565b80156109a75780601f1061097c576101008083540402835291602001916109a7565b820191906000526020600020905b81548152906001019060200180831161098a57829003601f168201915b5050505050610d34565b60008481526006602090815260409182902091519293506108f69284910161138a565b606060006109f960405180606001604052806038815260200161174f60389139610d34565b905080604051602001610a0c91906113d7565b60405160208183030381529060405291505090565b6001600160a01b03918216600090815260086020908152604080832093909416825291909152205460ff1690565b600081815260076020908152604080832080546001600160a01b0319166001600160a01b038781169182179092556002909352818420549151859492909116917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a45050565b6000818152600260205260409020546001600160a01b03848116911614610b035760405162461bcd60e51b81526020600482015260016024820152606f60f81b60448201526064016103ef565b610b0c81610e9c565b610b3c5760405162461bcd60e51b81526020600482015260016024820152604160f81b60448201526064016103ef565b6001600160a01b038216610b765760405162461bcd60e51b81526020600482015260016024820152601d60fa1b60448201526064016103ef565b6000818152600760205260409020546001600160a01b031615610b9e57610b9e600082610a4f565b6001600160a01b0383166000908152600360205260408120805460019290610bc790849061150f565b90915550506001600160a01b0382166000908152600360205260408120805460019290610bf59084906114b6565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b823b8015610d2d57604051630a85bd0160e11b81526000906001600160a01b0386169063150b7a0290610c939033908a908990899060040161141c565b602060405180830381600087803b158015610cad57600080fd5b505af1158015610cc1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ce591906111a6565b90506001600160e01b03198116630a85bd0160e11b14610d2b5760405162461bcd60e51b81526020600482015260016024820152603d60f91b60448201526064016103ef565b505b5050505050565b6060815160001415610d5457505060408051602081019091526000815290565b600060405180606001604052806040815260200161170f6040913990506000600384516002610d8391906114b6565b610d8d91906114ce565b610d989060046114f0565b90506000610da78260206114b6565b67ffffffffffffffff811115610dbf57610dbf6115be565b6040519080825280601f01601f191660200182016040528015610de9576020820181803683370190505b509050818152600183018586518101602084015b81831015610e575760039283018051603f601282901c811687015160f890811b8552600c83901c8216880151811b6001860152600683901c8216880151811b60028601529116860151901b93820193909352600401610dfd565b600389510660018114610e715760028114610e8257610e8e565b613d3d60f01b600119830152610e8e565b603d60f81b6000198301525b509398975050505050505050565b6000818152600260205260408120546001600160a01b031633811480610ed857506000838152600760205260409020546001600160a01b031633145b80610ee85750610ee88133610a21565b9392505050565b828054610efb90611552565b90600052602060002090601f016020900481019282610f1d5760008555610f63565b82601f10610f3657805160ff1916838001178555610f63565b82800160010185558215610f63579182015b82811115610f63578251825591602001919060010190610f48565b50610f6f929150610f73565b5090565b5b80821115610f6f5760008155600101610f74565b80356001600160a01b0381168114610f9f57600080fd5b919050565b600082601f830112610fb557600080fd5b813567ffffffffffffffff80821115610fd057610fd06115be565b604051601f8301601f19908116603f01168101908282118183101715610ff857610ff86115be565b8160405283815286602085880101111561101157600080fd5b836020870160208301376000602085830101528094505050505092915050565b60006020828403121561104357600080fd5b610ee882610f88565b6000806040838503121561105f57600080fd5b61106883610f88565b915061107660208401610f88565b90509250929050565b60008060006060848603121561109457600080fd5b61109d84610f88565b92506110ab60208501610f88565b9150604084013590509250925092565b600080600080608085870312156110d157600080fd5b6110da85610f88565b93506110e860208601610f88565b925060408501359150606085013567ffffffffffffffff81111561110b57600080fd5b61111787828801610fa4565b91505092959194509250565b6000806040838503121561113657600080fd5b61113f83610f88565b91506020830135801515811461115457600080fd5b809150509250929050565b6000806040838503121561117257600080fd5b61117b83610f88565b946020939093013593505050565b60006020828403121561119b57600080fd5b8135610ee8816115d4565b6000602082840312156111b857600080fd5b8151610ee8816115d4565b6000602082840312156111d557600080fd5b5035919050565b600080600080608085870312156111f257600080fd5b84359350602085013567ffffffffffffffff8082111561121157600080fd5b61121d88838901610fa4565b9450604087013591508082111561123357600080fd5b61123f88838901610fa4565b9350606087013591508082111561125557600080fd5b5061111787828801610fa4565b6000815180845261127a816020860160208601611526565b601f01601f19169290920160200192915050565b8054600090600181811c90808316806112a857607f831692505b60208084108214156112ca57634e487b7160e01b600052602260045260246000fd5b8180156112de57600181146112ef5761131c565b60ff1986168952848901965061131c565b60008881526020902060005b868110156113145781548b8201529085019083016112fb565b505084890196505b50505050505092915050565b6000865161133a818460208b01611526565b6113468184018861128e565b90508551611358818360208a01611526565b855191019061136b818360208901611526565b845191019061137e818360208801611526565b01979650505050505050565b6a646174613a696d6167652f60a81b815260006113aa600b83018561128e565b670ed8985cd94d8d0b60c21b815283516113cb816008840160208801611526565b01600801949350505050565b7f646174613a6170706c69636174696f6e2f6a736f6e3b6261736536342c00000081526000825161140f81601d850160208701611526565b91909101601d0192915050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061144f90830184611262565b9695505050505050565b602081526000610ee86020830184611262565b8481526080602082015260006114856080830186611262565b82810360408401526114978186611262565b905082810360608401526114ab8185611262565b979650505050505050565b600082198211156114c9576114c96115a8565b500190565b6000826114eb57634e487b7160e01b600052601260045260246000fd5b500490565b600081600019048311821515161561150a5761150a6115a8565b500290565b600082821015611521576115216115a8565b500390565b60005b83811015611541578181015183820152602001611529565b838111156108c85750506000910152565b600181811c9082168061156657607f821691505b6020821081141561158757634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156115a1576115a16115a8565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b0319811681146115ea57600080fd5b5056fe222c22696d616765223a223c7376672077696474683d273130302527206865696768743d2731303025272076696577426f783d273020302033322033322720786d6c6e733d27687474703a2f2f7777772e77332e6f72672f323030302f7376672720786d6c6e733a7376673d27687474703a2f2f7777772e77332e6f72672f323030302f7376672720786d6c6e733a786c696e6b3d27687474703a2f2f7777772e77332e6f72672f313939392f786c696e6b273e3c696d6167652077696474683d273130302527206865696768743d273130302527207374796c653d27696d6167652d72656e646572696e673a706978656c617465643b20696d6167652d72656e646572696e673a63726973702d65646765732720786c696e6b3a687265663d274142434445464748494a4b4c4d4e4f505152535455565758595a6162636465666768696a6b6c6d6e6f707172737475767778797a303132333435363738392b2f7b226e616d65223a2254657374436f6e7472616374222c226465736372697074696f6e223a2254657374204465736372697074696f6e227da264697066735822122024eba60d0a9e3109a76f5f7ada50d899555375aa1d78e714686203ee23e5c5ed64736f6c63430008070033";

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
