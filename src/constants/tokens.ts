import { TokenInfo } from "types";

export const TOKENS = {
  137: [
    {
      name: "matic-network",
      symbol: "WMATIC",
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      decimals: 18,
    },
    {
      name: "tether",
      symbol: "USDT",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      decimals: 6,
    },
    {
      name: "usd-coin",
      symbol: "USDC",
      address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      decimals: 6,
    },
  ],
  42161: [
    {
      name: "wrapped-ether",
      symbol: "WETH",
      address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      decimals: 18,
    },
    {
      name: "tether",
      symbol: "USDT",
      address: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
      decimals: 6,
    },
  ],
} as Record<number, TokenInfo[]>;

export type SupportedChain = keyof typeof TOKENS;

export const DATA_CONTRACTS = {
  137: "0x805dd8b38993334215fe50a1f5a1d2c08f662e96",
  534351: "0x846A821785CB6A0f96f3d047ca8d3D7da838fCd8",
} as Record<number, string>;
