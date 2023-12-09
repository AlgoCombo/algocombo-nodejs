export * from "./client";

export const ONE_INCH_KEY = process.env.ONE_INCH_KEY || "";

export const NATIVE_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"

export const AGGREGATOR_ADDRESS = {
  "AAVE/USD": "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9",
};

export const RPC_URLS = {
  80001:
    "https://polygon-mumbai.g.alchemy.com/v2/fWVG_3ipWJMJsAe6kQm3Hx9HsAUBHJxN",
  137: "https://polygon-mainnet.g.alchemy.com/v2/AF2A5lTVs_Uh_Zkk-BF-n91QH5F1FH47",
  31337: "http://127.0.0.1:8545",
} as Record<number, string>;
