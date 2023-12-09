import { Address } from "viem";

export interface TokenInfo {
  symbol: string;
  address: Address;
  decimals: number;
}
