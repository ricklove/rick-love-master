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

interface ExperimentsContract2Interface extends ethers.utils.Interface {
  functions: {
    "selectBit(bool)": FunctionFragment;
    "selectBreed(bool)": FunctionFragment;
    "sequentialAccessA(bool)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "selectBit", values: [boolean]): string;
  encodeFunctionData(
    functionFragment: "selectBreed",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "sequentialAccessA",
    values: [boolean]
  ): string;

  decodeFunctionResult(functionFragment: "selectBit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "selectBreed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sequentialAccessA",
    data: BytesLike
  ): Result;

  events: {};
}

export class ExperimentsContract2 extends BaseContract {
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

  interface: ExperimentsContract2Interface;

  functions: {
    selectBit(isTrue: boolean, overrides?: CallOverrides): Promise<[BigNumber]>;

    selectBreed(
      isTrue: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    sequentialAccessA(
      isTrue: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  selectBit(isTrue: boolean, overrides?: CallOverrides): Promise<BigNumber>;

  selectBreed(isTrue: boolean, overrides?: CallOverrides): Promise<BigNumber>;

  sequentialAccessA(
    isTrue: boolean,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    selectBit(isTrue: boolean, overrides?: CallOverrides): Promise<BigNumber>;

    selectBreed(isTrue: boolean, overrides?: CallOverrides): Promise<BigNumber>;

    sequentialAccessA(
      isTrue: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    selectBit(isTrue: boolean, overrides?: CallOverrides): Promise<BigNumber>;

    selectBreed(isTrue: boolean, overrides?: CallOverrides): Promise<BigNumber>;

    sequentialAccessA(
      isTrue: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    selectBit(
      isTrue: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    selectBreed(
      isTrue: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    sequentialAccessA(
      isTrue: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
