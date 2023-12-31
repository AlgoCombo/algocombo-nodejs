import { TokenInfo } from "types";
import {
  Address,
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum } from "viem/chains";

import abi from "../../abis/SushiSwapper.json";
import ERC20ABI from "../../abis/ERC20.json";

import { V3_SWAP_ROUTER_ADDRESS } from "../../constants";
import { MaxUint256 } from "@uniswap/sdk-core";

export async function swap(
  amountIn: string,
  token0: TokenInfo,
  token1: TokenInfo,
  walletAddress: Address,
  privateKey: Address,
  _chainId: number
) {
  const account = privateKeyToAccount(`0x${privateKey}`);

  const walletClient = createWalletClient({
    chain: arbitrum,
    transport: http(),
    account,
  });

  const publicClient = createPublicClient({
    chain: arbitrum,
    transport: http(),
  });

  console.log("About to check for approval");

  // Check allowance
  const allowance = (await publicClient.readContract({
    abi: ERC20ABI,
    address: token0.address,
    functionName: "allowance",
    args: [walletAddress, V3_SWAP_ROUTER_ADDRESS.arbitrum],
  })) as bigint;

  if (allowance < parseUnits(amountIn, token0.decimals)) {
    // Approve ERC20 token0 to SwapRouter of Sushi
    const hashApprove = await walletClient.writeContract({
      abi: ERC20ABI,
      address: token0.address,
      functionName: "approve",
      args: [V3_SWAP_ROUTER_ADDRESS.arbitrum, MaxUint256],
    });

    console.log("Waiting for approval...");

    // Wait for approval
    await publicClient.waitForTransactionReceipt({ hash: hashApprove });

    console.log("Approved.");
  }

  console.log("Swapping...");
  // Execute Swap
  const hash = await walletClient.writeContract({
    abi,
    address: V3_SWAP_ROUTER_ADDRESS["arbitrum"] as Address,
    functionName: "swapTokens",
    args: [
      token0.address,
      token1.address,
      parseUnits(amountIn, token0.decimals),
      0,
    ],
  });

  console.log("Swap transaction taking place with hash ", hash);

  return hash;
}
