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
  "0x6080604052604051806060016040528060278152602001620036d06027913960019080519060200190620000359291906200009c565b506402540be40060095564174876e800600a553480156200005557600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550620001b1565b828054620000aa906200014c565b90600052602060002090601f016020900481019282620000ce57600085556200011a565b82601f10620000e957805160ff19168380011785556200011a565b828001600101855582156200011a579182015b8281111562000119578251825591602001919060010190620000fc565b5b5090506200012991906200012d565b5090565b5b80821115620001485760008160009055506001016200012e565b5090565b600060028204905060018216806200016557607f821691505b602082108114156200017c576200017b62000182565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b61350f80620001c16000396000f3fe6080604052600436106101665760003560e01c806370a08231116100d1578063a7cb05071161008a578063c87b56dd11610064578063c87b56dd1461052c578063e1ce42f614610569578063e8a3d48514610594578063e985e9c5146105bf57610166565b8063a7cb0507146104b1578063b88d4fde146104da578063ba8dc8481461050357610166565b806370a082311461039c5780637732bbf5146103d95780638dd91a561461040257806395d89b4114610441578063a0712d681461046c578063a22cb4651461048857610166565b806323b872dd1161012357806323b872dd1461028f57806342842e0e146102b8578063455259cb146102e15780634e9035651461030d57806355f804b3146103365780636352211e1461035f57610166565b806301ffc9a71461016b57806306fdde03146101a8578063081812fc146101d3578063095ea7b31461021057806318160ddd1461023957806318dd171114610264575b600080fd5b34801561017757600080fd5b50610192600480360381019061018d9190612334565b6105fc565b60405161019f919061299b565b60405180910390f35b3480156101b457600080fd5b506101bd610736565b6040516101ca91906129b6565b60405180910390f35b3480156101df57600080fd5b506101fa60048036038101906101f591906123d7565b610773565b6040516102079190612934565b60405180910390f35b34801561021c57600080fd5b50610237600480360381019061023291906122f4565b6107b0565b005b34801561024557600080fd5b5061024e61084b565b60405161025b9190612bd8565b60405180910390f35b34801561027057600080fd5b50610279610855565b6040516102869190612bd8565b60405180910390f35b34801561029b57600080fd5b506102b660048036038101906102b191906121de565b61085f565b005b3480156102c457600080fd5b506102df60048036038101906102da91906121de565b61086f565b005b3480156102ed57600080fd5b506102f661089a565b604051610304929190612bf3565b60405180910390f35b34801561031957600080fd5b50610334600480360381019061032f9190612444565b6108ab565b005b34801561034257600080fd5b5061035d6004803603810190610358919061238e565b610ad5565b005b34801561036b57600080fd5b50610386600480360381019061038191906123d7565b610b7d565b6040516103939190612934565b60405180910390f35b3480156103a857600080fd5b506103c360048036038101906103be9190612171565b610bba565b6040516103d09190612bd8565b60405180910390f35b3480156103e557600080fd5b5061040060048036038101906103fb9190612444565b610c03565b005b34801561040e57600080fd5b50610429600480360381019061042491906123d7565b610cb3565b60405161043893929190612c37565b60405180910390f35b34801561044d57600080fd5b50610456610d21565b60405161046391906129b6565b60405180910390f35b610486600480360381019061048191906123d7565b610d5e565b005b34801561049457600080fd5b506104af60048036038101906104aa91906122b4565b611212565b005b3480156104bd57600080fd5b506104d860048036038101906104d39190612404565b61130f565b005b3480156104e657600080fd5b5061050160048036038101906104fc9190612231565b6113af565b005b34801561050f57600080fd5b5061052a60048036038101906105259190612484565b6113cc565b005b34801561053857600080fd5b50610553600480360381019061054e91906123d7565b611792565b60405161056091906129b6565b60405180910390f35b34801561057557600080fd5b5061057e6117c6565b60405161058b9190612c1c565b60405180910390f35b3480156105a057600080fd5b506105a96117d1565b6040516105b691906129b6565b60405180910390f35b3480156105cb57600080fd5b506105e660048036038101906105e1919061219e565b6117f9565b6040516105f3919061299b565b60405180910390f35b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806106c757507f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b8061072f57507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b9050919050565b60606040518060400160405280600881526020017f5269636b4c6f7665000000000000000000000000000000000000000000000000815250905090565b6000600b600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006107bb82610b7d565b90503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614806107fd57506107fc81336117f9565b5b61083c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161083390612a78565b60405180910390fd5b610846838361188d565b505050565b6000600254905090565b6000600554905090565b61086a838383611946565b505050565b61087a838383611946565b61089583838360405180602001604052806000815250611c47565b505050565b600080600954600a54915091509091565b3373ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610939576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161093090612a18565b60405180910390fd5b620f424063ffffffff168163ffffffff16111561098b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161098290612af8565b60405180910390fd5b6007600083815260200190815260200160002060009054906101000a900463ffffffff1663ffffffff168163ffffffff16116109fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109f390612a98565b60405180910390fd5b6000600860008481526020019081526020016000205411610a52576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a4990612a58565b60405180910390fd5b6006600083815260200190815260200160002060009054906101000a900463ffffffff1681610a819190612e6d565b63ffffffff1660026000828254610a989190612d58565b92505081905550806006600084815260200190815260200160002060006101000a81548163ffffffff021916908363ffffffff1602179055505050565b3373ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610b63576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b5a90612a18565b60405180910390fd5b8060019080519060200190610b79929190611f70565b5050565b60006003600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b6000600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b3373ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610c91576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c8890612a18565b60405180910390fd5b8063ffffffff1660086000848152602001908152602001600020819055505050565b60008060006006600085815260200190815260200160002060009054906101000a900463ffffffff1692506007600085815260200190815260200160002060009054906101000a900463ffffffff169150600860008581526020019081526020016000205490509193909250565b60606040518060400160405280600881526020017f5249434b4c4f5645000000000000000000000000000000000000000000000000815250905090565b600a543a1115610da3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d9a90612ad8565b60405180910390fd5b6009543a1015610de8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ddf90612ad8565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff166003600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610e8a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e8190612b58565b60405180910390fd5b6000620f424063ffffffff1682610ea19190612dae565b90506000620f424063ffffffff1683610eba9190613040565b90506006600083815260200190815260200160002060009054906101000a900463ffffffff1663ffffffff168110610f27576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f1e906129f8565b60405180910390fd5b6007600083815260200190815260200160002060009054906101000a900463ffffffff1663ffffffff168114610f92576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f8990612bb8565b60405180910390fd5b6008600083815260200190815260200160002054341015610fe8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fdf90612b18565b60405180910390fd5b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163460405161102f9061291f565b60006040518083038185875af1925050503d806000811461106c576040519150601f19603f3d011682016040523d82523d6000602084013e611071565b606091505b50509050806110b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110ac90612b98565b60405180910390fd5b6001600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546111059190612d58565b92505081905550336003600086815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060076000848152602001908152602001600020600081819054906101000a900463ffffffff168092919061119190613013565b91906101000a81548163ffffffff021916908363ffffffff16021790555050833373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a450505050565b80600c60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051611303919061299b565b60405180910390a35050565b3373ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461139d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161139490612a18565b60405180910390fd5b8160098190555080600a819055505050565b6113ba848484611946565b6113c684848484611c47565b50505050565b3373ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161461145a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161145190612a18565b60405180910390fd5b620f424063ffffffff168263ffffffff1611156114ac576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114a390612ab8565b60405180910390fd5b60006007600085815260200190815260200160002060009054906101000a900463ffffffff1663ffffffff1614611518576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161150f90612b38565b60405180910390fd5b60055483116115295760055461152b565b825b6005819055508163ffffffff16600260008282546115499190612d58565b92505081905550816006600085815260200190815260200160002060006101000a81548163ffffffff021916908363ffffffff160217905550816007600085815260200190815260200160002060006101000a81548163ffffffff021916908363ffffffff1602179055508060086000858152602001908152602001600020819055508163ffffffff16600460008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546116429190612d58565b9250508190555060005b8263ffffffff168163ffffffff16101561178c5760008163ffffffff16620f424063ffffffff168661167e9190612ddf565b6116889190612d58565b905060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff166003600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a450808061178490613013565b91505061164c565b50505050565b6060600161179f83611d7b565b6040516020016117b09291906128ce565b6040516020818303038152906040529050919050565b6000620f4240905090565b606060016040516020016117e591906128fd565b604051602081830303815290604052905090565b6000600c60008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b81600b600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff1661190083610b7d565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b8273ffffffffffffffffffffffffffffffffffffffff1661196682610b7d565b73ffffffffffffffffffffffffffffffffffffffff16146119bc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016119b390612a78565b60405180910390fd5b6119c581611edc565b611a04576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016119fb906129d8565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611a74576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a6b90612b78565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff16600b600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614611ae757611ae660008261188d565b5b6001600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611b379190612e39565b925050819055506001600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611b8e9190612d58565b92505081905550816003600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b6000833b90506000811115611d745760008473ffffffffffffffffffffffffffffffffffffffff1663150b7a02338887876040518563ffffffff1660e01b8152600401611c97949392919061294f565b602060405180830381600087803b158015611cb157600080fd5b505af1158015611cc5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611ce99190612361565b905063150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614611d72576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611d6990612a38565b60405180910390fd5b505b5050505050565b60606000821415611dc3576040518060400160405280600181526020017f30000000000000000000000000000000000000000000000000000000000000008152509050611ed7565b600082905060005b60008214611df5578080611dde90612fca565b915050600a82611dee9190612dae565b9150611dcb565b60008167ffffffffffffffff811115611e1157611e1061312d565b5b6040519080825280601f01601f191660200182016040528015611e435781602001600182028036833780820191505090505b5090505b60008514611ed057600182611e5c9190612e39565b9150600a85611e6b9190613040565b6030611e779190612d58565b60f81b818381518110611e8d57611e8c6130fe565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a85611ec99190612dae565b9450611e47565b8093505050505b919050565b600080611ee883610b7d565b90503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161480611f5757503373ffffffffffffffffffffffffffffffffffffffff16611f3f84610773565b73ffffffffffffffffffffffffffffffffffffffff16145b80611f685750611f6781336117f9565b5b915050919050565b828054611f7c90612f67565b90600052602060002090601f016020900481019282611f9e5760008555611fe5565b82601f10611fb757805160ff1916838001178555611fe5565b82800160010185558215611fe5579182015b82811115611fe4578251825591602001919060010190611fc9565b5b509050611ff29190611ff6565b5090565b5b8082111561200f576000816000905550600101611ff7565b5090565b600061202661202184612c93565b612c6e565b90508281526020810184848401111561204257612041613161565b5b61204d848285612f25565b509392505050565b600061206861206384612cc4565b612c6e565b90508281526020810184848401111561208457612083613161565b5b61208f848285612f25565b509392505050565b6000813590506120a681613466565b92915050565b6000813590506120bb8161347d565b92915050565b6000813590506120d081613494565b92915050565b6000815190506120e581613494565b92915050565b600082601f830112612100576120ff61315c565b5b8135612110848260208601612013565b91505092915050565b600082601f83011261212e5761212d61315c565b5b813561213e848260208601612055565b91505092915050565b600081359050612156816134ab565b92915050565b60008135905061216b816134c2565b92915050565b6000602082840312156121875761218661316b565b5b600061219584828501612097565b91505092915050565b600080604083850312156121b5576121b461316b565b5b60006121c385828601612097565b92505060206121d485828601612097565b9150509250929050565b6000806000606084860312156121f7576121f661316b565b5b600061220586828701612097565b935050602061221686828701612097565b925050604061222786828701612147565b9150509250925092565b6000806000806080858703121561224b5761224a61316b565b5b600061225987828801612097565b945050602061226a87828801612097565b935050604061227b87828801612147565b925050606085013567ffffffffffffffff81111561229c5761229b613166565b5b6122a8878288016120eb565b91505092959194509250565b600080604083850312156122cb576122ca61316b565b5b60006122d985828601612097565b92505060206122ea858286016120ac565b9150509250929050565b6000806040838503121561230b5761230a61316b565b5b600061231985828601612097565b925050602061232a85828601612147565b9150509250929050565b60006020828403121561234a5761234961316b565b5b6000612358848285016120c1565b91505092915050565b6000602082840312156123775761237661316b565b5b6000612385848285016120d6565b91505092915050565b6000602082840312156123a4576123a361316b565b5b600082013567ffffffffffffffff8111156123c2576123c1613166565b5b6123ce84828501612119565b91505092915050565b6000602082840312156123ed576123ec61316b565b5b60006123fb84828501612147565b91505092915050565b6000806040838503121561241b5761241a61316b565b5b600061242985828601612147565b925050602061243a85828601612147565b9150509250929050565b6000806040838503121561245b5761245a61316b565b5b600061246985828601612147565b925050602061247a8582860161215c565b9150509250929050565b60008060006060848603121561249d5761249c61316b565b5b60006124ab86828701612147565b93505060206124bc8682870161215c565b92505060406124cd86828701612147565b9150509250925092565b6124e081612ea1565b82525050565b6124ef81612eb3565b82525050565b600061250082612d0a565b61250a8185612d20565b935061251a818560208601612f34565b61252381613170565b840191505092915050565b600061253982612d15565b6125438185612d3c565b9350612553818560208601612f34565b61255c81613170565b840191505092915050565b600061257282612d15565b61257c8185612d4d565b935061258c818560208601612f34565b80840191505092915050565b600081546125a581612f67565b6125af8186612d4d565b945060018216600081146125ca57600181146125db5761260e565b60ff1983168652818601935061260e565b6125e485612cf5565b60005b83811015612606578154818901526001820191506020810190506125e7565b838801955050505b50505092915050565b6000612624600183612d3c565b915061262f82613181565b602082019050919050565b6000612647600183612d3c565b9150612652826131aa565b602082019050919050565b600061266a600d83612d4d565b9150612675826131d3565b600d82019050919050565b600061268d600183612d3c565b9150612698826131fc565b602082019050919050565b60006126b0600183612d3c565b91506126bb82613225565b602082019050919050565b60006126d3600183612d3c565b91506126de8261324e565b602082019050919050565b60006126f6600183612d3c565b915061270182613277565b602082019050919050565b6000612719600183612d3c565b9150612724826132a0565b602082019050919050565b600061273c600183612d3c565b9150612747826132c9565b602082019050919050565b600061275f600583612d4d565b915061276a826132f2565b600582019050919050565b6000612782600183612d3c565b915061278d8261331b565b602082019050919050565b60006127a5600183612d3c565b91506127b082613344565b602082019050919050565b60006127c8600183612d3c565b91506127d38261336d565b602082019050919050565b60006127eb600183612d3c565b91506127f682613396565b602082019050919050565b600061280e600083612d31565b9150612819826133bf565b600082019050919050565b6000612831600183612d3c565b915061283c826133c2565b602082019050919050565b6000612854600183612d3c565b915061285f826133eb565b602082019050919050565b6000612877600183612d3c565b915061288282613414565b602082019050919050565b600061289a600183612d3c565b91506128a58261343d565b602082019050919050565b6128b981612f0b565b82525050565b6128c881612f15565b82525050565b60006128da8285612598565b91506128e68284612567565b91506128f182612752565b91508190509392505050565b60006129098284612598565b91506129148261265d565b915081905092915050565b600061292a82612801565b9150819050919050565b600060208201905061294960008301846124d7565b92915050565b600060808201905061296460008301876124d7565b61297160208301866124d7565b61297e60408301856128b0565b818103606083015261299081846124f5565b905095945050505050565b60006020820190506129b060008301846124e6565b92915050565b600060208201905081810360008301526129d0818461252e565b905092915050565b600060208201905081810360008301526129f181612617565b9050919050565b60006020820190508181036000830152612a118161263a565b9050919050565b60006020820190508181036000830152612a3181612680565b9050919050565b60006020820190508181036000830152612a51816126a3565b9050919050565b60006020820190508181036000830152612a71816126c6565b9050919050565b60006020820190508181036000830152612a91816126e9565b9050919050565b60006020820190508181036000830152612ab18161270c565b9050919050565b60006020820190508181036000830152612ad18161272f565b9050919050565b60006020820190508181036000830152612af181612775565b9050919050565b60006020820190508181036000830152612b1181612798565b9050919050565b60006020820190508181036000830152612b31816127bb565b9050919050565b60006020820190508181036000830152612b51816127de565b9050919050565b60006020820190508181036000830152612b7181612824565b9050919050565b60006020820190508181036000830152612b9181612847565b9050919050565b60006020820190508181036000830152612bb18161286a565b9050919050565b60006020820190508181036000830152612bd18161288d565b9050919050565b6000602082019050612bed60008301846128b0565b92915050565b6000604082019050612c0860008301856128b0565b612c1560208301846128b0565b9392505050565b6000602082019050612c3160008301846128bf565b92915050565b6000606082019050612c4c60008301866128bf565b612c5960208301856128bf565b612c6660408301846128b0565b949350505050565b6000612c78612c89565b9050612c848282612f99565b919050565b6000604051905090565b600067ffffffffffffffff821115612cae57612cad61312d565b5b612cb782613170565b9050602081019050919050565b600067ffffffffffffffff821115612cdf57612cde61312d565b5b612ce882613170565b9050602081019050919050565b60008190508160005260206000209050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b600082825260208201905092915050565b600081905092915050565b6000612d6382612f0b565b9150612d6e83612f0b565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612da357612da2613071565b5b828201905092915050565b6000612db982612f0b565b9150612dc483612f0b565b925082612dd457612dd36130a0565b5b828204905092915050565b6000612dea82612f0b565b9150612df583612f0b565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615612e2e57612e2d613071565b5b828202905092915050565b6000612e4482612f0b565b9150612e4f83612f0b565b925082821015612e6257612e61613071565b5b828203905092915050565b6000612e7882612f15565b9150612e8383612f15565b925082821015612e9657612e95613071565b5b828203905092915050565b6000612eac82612eeb565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600063ffffffff82169050919050565b82818337600083830152505050565b60005b83811015612f52578082015181840152602081019050612f37565b83811115612f61576000848401525b50505050565b60006002820490506001821680612f7f57607f821691505b60208210811415612f9357612f926130cf565b5b50919050565b612fa282613170565b810181811067ffffffffffffffff82111715612fc157612fc061312d565b5b80604052505050565b6000612fd582612f0b565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561300857613007613071565b5b600182019050919050565b600061301e82612f15565b915063ffffffff82141561303557613034613071565b5b600182019050919050565b600061304b82612f0b565b915061305683612f0b565b925082613066576130656130a0565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4100000000000000000000000000000000000000000000000000000000000000600082015250565b7f6300000000000000000000000000000000000000000000000000000000000000600082015250565b7f636f6e74726163742e6a736f6e00000000000000000000000000000000000000600082015250565b7f6100000000000000000000000000000000000000000000000000000000000000600082015250565b7f7a00000000000000000000000000000000000000000000000000000000000000600082015250565b7f6e00000000000000000000000000000000000000000000000000000000000000600082015250565b7f6f00000000000000000000000000000000000000000000000000000000000000600082015250565b7f7300000000000000000000000000000000000000000000000000000000000000600082015250565b7f5000000000000000000000000000000000000000000000000000000000000000600082015250565b7f2e6a736f6e000000000000000000000000000000000000000000000000000000600082015250565b7f7e00000000000000000000000000000000000000000000000000000000000000600082015250565b7f5300000000000000000000000000000000000000000000000000000000000000600082015250565b7f2400000000000000000000000000000000000000000000000000000000000000600082015250565b7f6200000000000000000000000000000000000000000000000000000000000000600082015250565b50565b7f4f00000000000000000000000000000000000000000000000000000000000000600082015250565b7f7400000000000000000000000000000000000000000000000000000000000000600082015250565b7f4600000000000000000000000000000000000000000000000000000000000000600082015250565b7f6900000000000000000000000000000000000000000000000000000000000000600082015250565b61346f81612ea1565b811461347a57600080fd5b50565b61348681612eb3565b811461349157600080fd5b50565b61349d81612ebf565b81146134a857600080fd5b50565b6134b481612f0b565b81146134bf57600080fd5b50565b6134cb81612f15565b81146134d657600080fd5b5056fea2646970667358221220d069a506c48c2410fbcb157997abf92df01bab9a731b7b43e5828f812248334c64736f6c6343000807003368747470733a2f2f7269636b6c6f76652e6d652f6172742f5f6d657461646174612f6d61696e2f";

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
