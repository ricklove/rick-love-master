/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { NftContract, NftContractInterface } from "../NftContract";

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
        name: "projectId",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "reserveTokenCount",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "projectMintPrice",
        type: "uint256",
      },
    ],
    name: "createProject",
    outputs: [],
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
    inputs: [],
    name: "getGasPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
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
    inputs: [],
    name: "projectBucketSize",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
    ],
    name: "projectDetails",
    outputs: [
      {
        internalType: "uint32",
        name: "projectTokenSupply",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "projectTokenCount",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "projectMintPrice",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "projectIdLast",
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
        name: "baseURI",
        type: "string",
      },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gasPriceMin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gasPriceMax",
        type: "uint256",
      },
    ],
    name: "setGasPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "projectMintPrice",
        type: "uint32",
      },
    ],
    name: "setProjectMintPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "projectId",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "projectTokenSupply",
        type: "uint32",
      },
    ],
    name: "setProjectTokenSupply",
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
  "0x60e0604052602760808181529062001aaf60a0398051620000299160019160209091019062000062565b506402540be40060095564174876e800600a553480156200004957600080fd5b50600080546001600160a01b0319163317905562000145565b828054620000709062000108565b90600052602060002090601f016020900481019282620000945760008555620000df565b82601f10620000af57805160ff1916838001178555620000df565b82800160010185558215620000df579182015b82811115620000df578251825591602001919060010190620000c2565b50620000ed929150620000f1565b5090565b5b80821115620000ed5760008155600101620000f2565b600181811c908216806200011d57607f821691505b602082108114156200013f57634e487b7160e01b600052602260045260246000fd5b50919050565b61195a80620001556000396000f3fe6080604052600436106101265760003560e01c806301ffc9a71461012b57806306fdde0314610160578063081812fc1461019a578063095ea7b3146101d257806318160ddd146101f457806318dd17111461021357806323b872dd1461022857806342842e0e14610248578063455259cb146102685780634e9035651461029057806355f804b3146102b05780636352211e146102d057806370a08231146102f05780637732bbf5146103265780638dd91a561461034657806395d89b41146103b6578063a0712d68146103e7578063a22cb465146103fa578063a7cb05071461041a578063b88d4fde1461043a578063ba8dc8481461045a578063c87b56dd1461047a578063e1ce42f61461049a578063e8a3d485146104b8578063e985e9c5146104cd575b600080fd5b34801561013757600080fd5b5061014b610146366004611488565b6104ed565b60405190151581526020015b60405180910390f35b34801561016c57600080fd5b506040805180820190915260088152675269636b4c6f766560c01b60208201525b60405161015791906116ee565b3480156101a657600080fd5b506101ba6101b536600461150a565b61053f565b6040516001600160a01b039091168152602001610157565b3480156101de57600080fd5b506101f26101ed36600461145e565b61055a565b005b34801561020057600080fd5b506002545b604051908152602001610157565b34801561021f57600080fd5b50600554610205565b34801561023457600080fd5b506101f261024336600461136b565b6105b7565b34801561025457600080fd5b506101f261026336600461136b565b6105c2565b34801561027457600080fd5b50600954600a5460408051928352602083019190915201610157565b34801561029c57600080fd5b506101f26102ab366004611545565b6105e8565b3480156102bc57600080fd5b506101f26102cb3660046114c2565b61073c565b3480156102dc57600080fd5b506101ba6102eb36600461150a565b61077d565b3480156102fc57600080fd5b5061020561030b36600461131d565b6001600160a01b031660009081526004602052604090205490565b34801561033257600080fd5b506101f2610341366004611545565b610798565b34801561035257600080fd5b5061039361036136600461150a565b6000908152600660209081526040808320546007835281842054600890935292205463ffffffff928316939290911691565b6040805163ffffffff948516815293909216602084015290820152606001610157565b3480156103c257600080fd5b506040805180820190915260088152675249434b4c4f564560c01b602082015261018d565b6101f26103f536600461150a565b6107dd565b34801561040657600080fd5b506101f2610415366004611422565b610a9b565b34801561042657600080fd5b506101f2610435366004611523565b610b07565b34801561044657600080fd5b506101f26104553660046113a7565b610b3c565b34801561046657600080fd5b506101f2610475366004611568565b610b59565b34801561048657600080fd5b5061018d61049536600461150a565b610d3e565b3480156104a657600080fd5b50604051620f42408152602001610157565b3480156104c457600080fd5b5061018d610d72565b3480156104d957600080fd5b5061014b6104e8366004611338565b610d9a565b60006001600160e01b031982166301ffc9a760e01b148061051e57506001600160e01b031982166380ac58cd60e01b145b8061053957506001600160e01b03198216635b5e139f60e01b145b92915050565b6000908152600b60205260409020546001600160a01b031690565b60006105658261077d565b90506001600160a01b03811633148061058357506105838133610d9a565b6105a85760405162461bcd60e51b815260040161059f9061171c565b60405180910390fd5b6105b28383610dc8565b505050565b6105b2838383610e36565b6105cd838383610e36565b6105b283838360405180602001604052806000815250610fb0565b6000546001600160a01b031633146106125760405162461bcd60e51b815260040161059f90611701565b620f424063ffffffff8216111561064f5760405162461bcd60e51b81526020600482015260016024820152605360f81b604482015260640161059f565b60008281526007602052604090205463ffffffff9081169082161161069a5760405162461bcd60e51b81526020600482015260016024820152607360f81b604482015260640161059f565b6000828152600860205260409020546106d95760405162461bcd60e51b81526020600482015260016024820152603760f91b604482015260640161059f565b6000828152600660205260409020546106f89063ffffffff16826117b4565b63ffffffff166002600082825461070f9190611752565b9091555050600091825260066020526040909120805463ffffffff191663ffffffff909216919091179055565b6000546001600160a01b031633146107665760405162461bcd60e51b815260040161059f90611701565b80516107799060019060208401906111df565b5050565b6000908152600360205260409020546001600160a01b031690565b6000546001600160a01b031633146107c25760405162461bcd60e51b815260040161059f90611701565b60009182526008602052604090912063ffffffff9091169055565b600a543a11156107ff5760405162461bcd60e51b815260040161059f90611737565b6009543a10156108215760405162461bcd60e51b815260040161059f90611737565b6000818152600360205260409020546001600160a01b03161561086a5760405162461bcd60e51b81526020600482015260016024820152604f60f81b604482015260640161059f565b6000610879620f42408361176a565b9050600061088a620f42408461187f565b60008381526006602052604090205490915063ffffffff1681106108d45760405162461bcd60e51b81526020600482015260016024820152606360f81b604482015260640161059f565b60008281526007602052604090205463ffffffff16811461091b5760405162461bcd60e51b81526020600482015260016024820152606960f81b604482015260640161059f565b60008281526008602052604090205434101561095d5760405162461bcd60e51b81526020600482015260016024820152600960fa1b604482015260640161059f565b600080546040516001600160a01b039091169034908381818185875af1925050503d80600081146109aa576040519150601f19603f3d011682016040523d82523d6000602084013e6109af565b606091505b50509050806109e45760405162461bcd60e51b81526020600482015260016024820152602360f91b604482015260640161059f565b336000908152600460205260408120805460019290610a04908490611752565b9091555050600084815260036020908152604080832080546001600160a01b0319163317905585835260079091528120805463ffffffff1691610a468361185b565b91906101000a81548163ffffffff021916908363ffffffff1602179055505083336001600160a01b031660006001600160a01b031660008051602061190583398151915260405160405180910390a450505050565b336000818152600c602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b6000546001600160a01b03163314610b315760405162461bcd60e51b815260040161059f90611701565b600991909155600a55565b610b47848484610e36565b610b5384848484610fb0565b50505050565b6000546001600160a01b03163314610b835760405162461bcd60e51b815260040161059f90611701565b620f424063ffffffff83161115610bc05760405162461bcd60e51b81526020600482015260016024820152600560fc1b604482015260640161059f565b60008381526007602052604090205463ffffffff1615610c065760405162461bcd60e51b81526020600482015260016024820152603160f91b604482015260640161059f565b6005548311610c1757600554610c19565b825b6005819055508163ffffffff1660026000828254610c379190611752565b90915550506000838152600660209081526040808320805463ffffffff871663ffffffff199182168117909255600784528285208054909116821790556008835281842085905583546001600160a01b0316845260049092528220805491929091610ca3908490611752565b90915550600090505b8263ffffffff168163ffffffff161015610b5357600063ffffffff8216610cd6620f42408761177e565b610ce09190611752565b600080548282526003602052604080832080546001600160a01b0319166001600160a01b0393841617905582549051939450849391169190600080516020611905833981519152908290a45080610d368161185b565b915050610cac565b60606001610d4b8361108e565b604051602001610d5c929190611653565b6040516020818303038152906040529050919050565b60606001604051602001610d869190611688565b604051602081830303815290604052905090565b6001600160a01b039182166000908152600c6020908152604080832093909416825291909152205460ff1690565b6000818152600b6020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610dfd8261077d565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b826001600160a01b0316610e498261077d565b6001600160a01b031614610e6f5760405162461bcd60e51b815260040161059f9061171c565b610e7881611193565b610ea85760405162461bcd60e51b81526020600482015260016024820152604160f81b604482015260640161059f565b6001600160a01b038216610ee25760405162461bcd60e51b81526020600482015260016024820152601d60fa1b604482015260640161059f565b6000818152600b60205260409020546001600160a01b031615610f0a57610f0a600082610dc8565b6001600160a01b0383166000908152600460205260408120805460019290610f3390849061179d565b90915550506001600160a01b0382166000908152600460205260408120805460019290610f61908490611752565b909155505060008181526003602052604080822080546001600160a01b0319166001600160a01b03868116918217909255915184939187169160008051602061190583398151915291a4505050565b823b801561108757604051630a85bd0160e11b81526000906001600160a01b0386169063150b7a0290610fed9033908a90899089906004016116b1565b602060405180830381600087803b15801561100757600080fd5b505af115801561101b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061103f91906114a5565b90506001600160e01b03198116630a85bd0160e11b146110855760405162461bcd60e51b81526020600482015260016024820152603d60f91b604482015260640161059f565b505b5050505050565b6060816110b25750506040805180820190915260018152600360fc1b602082015290565b8160005b81156110dc57806110c681611840565b91506110d59050600a8361176a565b91506110b6565b6000816001600160401b038111156110f6576110f66118d5565b6040519080825280601f01601f191660200182016040528015611120576020820181803683370190505b5090505b841561118b5761113560018361179d565b9150611142600a8661187f565b61114d906030611752565b60f81b818381518110611162576111626118bf565b60200101906001600160f81b031916908160001a905350611184600a8661176a565b9450611124565b949350505050565b60008061119f8361077d565b90506001600160a01b0381163314806111c85750336111bd8461053f565b6001600160a01b0316145b806111d857506111d88133610d9a565b9392505050565b8280546111eb90611805565b90600052602060002090601f01602090048101928261120d5760008555611253565b82601f1061122657805160ff1916838001178555611253565b82800160010185558215611253579182015b82811115611253578251825591602001919060010190611238565b5061125f929150611263565b5090565b5b8082111561125f5760008155600101611264565b60006001600160401b0380841115611292576112926118d5565b604051601f8501601f19908116603f011681019082821181831017156112ba576112ba6118d5565b816040528093508581528686860111156112d357600080fd5b858560208301376000602087830101525050509392505050565b80356001600160a01b038116811461130457600080fd5b919050565b803563ffffffff8116811461130457600080fd5b60006020828403121561132f57600080fd5b6111d8826112ed565b6000806040838503121561134b57600080fd5b611354836112ed565b9150611362602084016112ed565b90509250929050565b60008060006060848603121561138057600080fd5b611389846112ed565b9250611397602085016112ed565b9150604084013590509250925092565b600080600080608085870312156113bd57600080fd5b6113c6856112ed565b93506113d4602086016112ed565b92506040850135915060608501356001600160401b038111156113f657600080fd5b8501601f8101871361140757600080fd5b61141687823560208401611278565b91505092959194509250565b6000806040838503121561143557600080fd5b61143e836112ed565b91506020830135801515811461145357600080fd5b809150509250929050565b6000806040838503121561147157600080fd5b61147a836112ed565b946020939093013593505050565b60006020828403121561149a57600080fd5b81356111d8816118eb565b6000602082840312156114b757600080fd5b81516111d8816118eb565b6000602082840312156114d457600080fd5b81356001600160401b038111156114ea57600080fd5b8201601f810184136114fb57600080fd5b61118b84823560208401611278565b60006020828403121561151c57600080fd5b5035919050565b6000806040838503121561153657600080fd5b50508035926020909101359150565b6000806040838503121561155857600080fd5b8235915061136260208401611309565b60008060006060848603121561157d57600080fd5b8335925061139760208501611309565b600081518084526115a58160208601602086016117d9565b601f01601f19169290920160200192915050565b8054600090600181811c90808316806115d357607f831692505b60208084108214156115f557634e487b7160e01b600052602260045260246000fd5b818015611609576001811461161a57611647565b60ff19861689528489019650611647565b60008881526020902060005b8681101561163f5781548b820152908501908301611626565b505084890196505b50505050505092915050565b600061165f82856115b9565b835161166f8183602088016117d9565b64173539b7b760d91b9101908152600501949350505050565b600061169482846115b9565b6c31b7b73a3930b1ba173539b7b760991b8152600d019392505050565b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906116e49083018461158d565b9695505050505050565b6020815260006111d8602083018461158d565b6020808252600190820152606160f81b604082015260600190565b6020808252600190820152606f60f81b604082015260600190565b6020808252600190820152603f60f91b604082015260600190565b6000821982111561176557611765611893565b500190565b600082611779576117796118a9565b500490565b600081600019048311821515161561179857611798611893565b500290565b6000828210156117af576117af611893565b500390565b600063ffffffff838116908316818110156117d1576117d1611893565b039392505050565b60005b838110156117f45781810151838201526020016117dc565b83811115610b535750506000910152565b600181811c9082168061181957607f821691505b6020821081141561183a57634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561185457611854611893565b5060010190565b600063ffffffff8083168181141561187557611875611893565b6001019392505050565b60008261188e5761188e6118a9565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b03198116811461190157600080fd5b5056feddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa2646970667358221220744b9fbd1b3b2a3330618ba121c914d25d6af67244ea666e2f3cca11e915105764736f6c6343000807003368747470733a2f2f7269636b6c6f76652e6d652f6172742f5f6d657461646174612f6d61696e2f";

export class NftContract__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<NftContract> {
    return super.deploy(overrides || {}) as Promise<NftContract>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): NftContract {
    return super.attach(address) as NftContract;
  }
  connect(signer: Signer): NftContract__factory {
    return super.connect(signer) as NftContract__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NftContractInterface {
    return new utils.Interface(_abi) as NftContractInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NftContract {
    return new Contract(address, _abi, signerOrProvider) as NftContract;
  }
}
