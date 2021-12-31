/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface ExperimentsContractInterface extends ethers.utils.Interface {
  functions: {
    "create256BitString()": FunctionFragment;
    "get16Bit(uint256)": FunctionFragment;
    "get256Bit(uint256)": FunctionFragment;
    "get256Bit10k()": FunctionFragment;
    "get256Bit10k_inline()": FunctionFragment;
    "get256Bit10k_loopOnly()": FunctionFragment;
    "get256Bit10k_unsafe()": FunctionFragment;
    "get8Bit(uint256)": FunctionFragment;
    "getData_01(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "create256BitString",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "get16Bit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "get256Bit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "get256Bit10k",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "get256Bit10k_inline",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "get256Bit10k_loopOnly",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "get256Bit10k_unsafe",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "get8Bit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getData_01",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "create256BitString",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "get16Bit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get256Bit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "get256Bit10k",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "get256Bit10k_inline",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "get256Bit10k_loopOnly",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "get256Bit10k_unsafe",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "get8Bit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getData_01", data: BytesLike): Result;

  events: {};
}

export class ExperimentsContract extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ExperimentsContractInterface;

  functions: {
    create256BitString(overrides?: CallOverrides): Promise<[string]>;

    get16Bit(
      offset: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    get256Bit(
      offset: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    get256Bit10k(overrides?: CallOverrides): Promise<[BigNumber]>;

    get256Bit10k_inline(overrides?: CallOverrides): Promise<[BigNumber]>;

    get256Bit10k_loopOnly(overrides?: CallOverrides): Promise<[BigNumber]>;

    get256Bit10k_unsafe(overrides?: CallOverrides): Promise<[BigNumber]>;

    get8Bit(
      offset: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getData_01(
      _dataByteIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  create256BitString(overrides?: CallOverrides): Promise<string>;

  get16Bit(offset: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  get256Bit(
    offset: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  get256Bit10k(overrides?: CallOverrides): Promise<BigNumber>;

  get256Bit10k_inline(overrides?: CallOverrides): Promise<BigNumber>;

  get256Bit10k_loopOnly(overrides?: CallOverrides): Promise<BigNumber>;

  get256Bit10k_unsafe(overrides?: CallOverrides): Promise<BigNumber>;

  get8Bit(offset: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  getData_01(
    _dataByteIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    create256BitString(overrides?: CallOverrides): Promise<string>;

    get16Bit(
      offset: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    get256Bit(
      offset: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    get256Bit10k(overrides?: CallOverrides): Promise<BigNumber>;

    get256Bit10k_inline(overrides?: CallOverrides): Promise<BigNumber>;

    get256Bit10k_loopOnly(overrides?: CallOverrides): Promise<BigNumber>;

    get256Bit10k_unsafe(overrides?: CallOverrides): Promise<BigNumber>;

    get8Bit(
      offset: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getData_01(
      _dataByteIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    create256BitString(overrides?: CallOverrides): Promise<BigNumber>;

    get16Bit(
      offset: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    get256Bit(
      offset: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    get256Bit10k(overrides?: CallOverrides): Promise<BigNumber>;

    get256Bit10k_inline(overrides?: CallOverrides): Promise<BigNumber>;

    get256Bit10k_loopOnly(overrides?: CallOverrides): Promise<BigNumber>;

    get256Bit10k_unsafe(overrides?: CallOverrides): Promise<BigNumber>;

    get8Bit(
      offset: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getData_01(
      _dataByteIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    create256BitString(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    get16Bit(
      offset: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    get256Bit(
      offset: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    get256Bit10k(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    get256Bit10k_inline(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    get256Bit10k_loopOnly(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    get256Bit10k_unsafe(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    get8Bit(
      offset: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getData_01(
      _dataByteIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
