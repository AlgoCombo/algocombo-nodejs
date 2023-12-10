import "dotenv/config";

import { Address } from "viem";
import { TOKENS } from "./src/constants";
import { swap } from "./src/swap";

const walletAddress = process.env.ARBITRUM_WALLET_ADDRESS as Address;
const privateKey = process.env.ARBITRUM_PRIVATE_KEY as Address;

console.log({ walletAddress, privateKey });

async function main() {
  const result = await swap(
    {
      amountIn: "0.00001",
      token0: TOKENS[42161][0],
      token1: TOKENS[42161][1],
      walletAddress,
      privateKey,
      chainId: 42161,
    },
    "sushiswap"
  );

  console.log("Result of Swap", { result });
}

main();
