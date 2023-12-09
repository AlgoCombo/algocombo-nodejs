export * from "./client";

export const ONE_INCH_KEY = process.env.ONE_INCH_KEY || "";

export const AGGREGATOR_ADDRESS = {
  "AAVE/USD": "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9",
};

export const RPC_URLS = {
  80001:
    "https://polygon-mumbai.g.alchemy.com/v2/fWVG_3ipWJMJsAe6kQm3Hx9HsAUBHJxN",
} as Record<number, string>;
