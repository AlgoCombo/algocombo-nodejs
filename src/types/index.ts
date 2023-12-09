import { Address } from "viem";
import { Token } from "@uniswap/sdk-core";

export interface TokenInfo {
  symbol: string;
  address: Address;
  decimals: number;
}

export interface SwapData {
  amountIn: string;
  token0: TokenInfo;
  token1: TokenInfo;
  walletAddress: Address;
  privateKey: Address;
  chainId: number;
}

export interface BasicConfig {
  rpc: string;
  wallet: {
    address: string;
    privateKey: string;
  };
  tokens: {
    in: Token;
    out: Token;
    amountIn: string | number;
  };
}
