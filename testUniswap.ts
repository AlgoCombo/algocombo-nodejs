import "dotenv/config";

import { swap } from "./src/swap/uniswap";
import { TOKENS } from "./src/constants";
import { Address } from "viem";

const walletAddress = process.env.PERSONAL_WALLET_ADDRESS as Address;
const privateKey = process.env.PERSONAL_PRIVATE_KEY as Address;

async function main() {
  const result = await swap(
    "0.01",
    TOKENS[137][0],
    TOKENS[137][1],
    walletAddress,
    privateKey,
    137
  );
  console.log("Result of Swap", { result });
}

main();
