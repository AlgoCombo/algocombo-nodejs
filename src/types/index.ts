import { Address } from "viem";

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
