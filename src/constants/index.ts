export * from "./client";
export * from "./tokens";

export const ONE_INCH_KEY = process.env.ONE_INCH_KEY || "";

export const NATIVE_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const AGGREGATOR_ADDRESS = {
  "AAVE/USD": "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9",
};

export const RPC_URLS = {
  80001:
    "https://polygon-mumbai.g.alchemy.com/v2/fWVG_3ipWJMJsAe6kQm3Hx9HsAUBHJxN",
  137: "https://polygon-mainnet.g.alchemy.com/v2/AF2A5lTVs_Uh_Zkk-BF-n91QH5F1FH47",
  31337: "http://127.0.0.1:8545",
} as Record<number, string>;

export const V3_SWAP_ROUTER_ADDRESS = {
  // default: "0xE592427A0AEce92De3Edee1F18E0157C05861564", // Mainnet, Polygon, Optimism, Arbitrum, Testnets Address
  default: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", // Mainnet, Polygon, Optimism, Arbitrum, Testnets Address
  celo: "0x5615CDAb10dc425a742d643d949a7F474C01abc4", // Celo
};

export const MAX_FEE_PER_GAS = 100000000000;
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000;
