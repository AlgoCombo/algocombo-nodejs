// Uniswap
import { Token, Percent, TradeType, CurrencyAmount } from "@uniswap/sdk-core";
import {
  AlphaRouter,
  SwapOptionsSwapRouter02,
  SwapType,
} from "@uniswap/smart-order-router";
import ERC20ABI from "../../abis/ERC20.json";
import { BigNumber } from "ethers";

// General
import {
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  RPC_URLS,
  V3_SWAP_ROUTER_ADDRESS,
} from "../../constants";
import { TokenInfo } from "types";
import { Address } from "viem";

import { formatEther, parseUnits } from "ethers/lib/utils";
import { ethers } from "ethers";

interface BasicConfig {
  rpc: string;
  wallet: {
    address: string;
    privateKey: string;
  };
  tokens: {
    in: Token;
    amountIn: string | number;
    out: Token;
  };
}

export async function approveDEX(
  amountIn: string,
  privateKey: Address,
  chainId: number,
  token0: TokenInfo
) {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URLS[chainId]);
  const wallet = new ethers.Wallet(privateKey, provider);
  const tokenContract = new ethers.Contract(token0.address, ERC20ABI, wallet);

  // Check allowance
  const allowance = (await tokenContract.allowance(
    wallet.address,
    V3_SWAP_ROUTER_ADDRESS.default
  )) as BigNumber;

  if (+formatEther(allowance) >= +amountIn) {
    console.log("Allowance already exists. No need to approve");
    return { wait: () => {}, hash: "" };
  }

  const tokenApproval = await tokenContract.approve(
    V3_SWAP_ROUTER_ADDRESS.default,
    parseUnits(amountIn.toString(), token0.decimals)
  );

  // Will have hash with wait() function mostly, its from ethers
  return tokenApproval;
}

export async function swap(
  amountIn: string,
  token0: TokenInfo,
  token1: TokenInfo,
  walletAddress: Address,
  privateKey: Address,
  chainId: number
) {
  const CurrentConfig: BasicConfig = {
    rpc: RPC_URLS[chainId],
    tokens: {
      amountIn,
      in: new Token(chainId, token0.address, token0.decimals, token0.symbol),
      out: new Token(chainId, token1.address, token1.decimals, token1.symbol),
    },
    wallet: {
      address: walletAddress,
      privateKey,
    },
  };

  const provider = new ethers.providers.JsonRpcProvider(CurrentConfig.rpc);

  // Smart Router
  const router = new AlphaRouter({
    chainId,
    provider,
  });

  // Swap Options
  const options: SwapOptionsSwapRouter02 = {
    recipient: CurrentConfig.wallet.address,
    slippageTolerance: new Percent(50, 10_000),
    deadline: Math.floor(Date.now() / 1000 + 1800), // 30 Minutes deadline
    type: SwapType.SWAP_ROUTER_02,
  };

  // Route
  const route = await router.route(
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.in,
      parseUnits(amountIn, CurrentConfig.tokens.in.decimals).toString()
    ),
    CurrentConfig.tokens.out,
    TradeType.EXACT_INPUT,
    options
  );

  // Important Check. Happens in case no route between the tokens or something else
  if (!route || !route.methodParameters) {
    console.log({ route });
    throw new Error(
      "Invalid Route. Perhaps route between tokens does not exist or network error."
    );
  }

  // Check Approval
  const { hash: approveHash, wait: approveWait } = await approveDEX(
    amountIn,
    privateKey,
    chainId,
    token0
  );

  console.log(
    "Approval of ",
    token0.symbol,
    "ongoing at txn with hash",
    approveHash
  );

  await approveWait(1);

  // Continue after approval
  // Use custom Hot Wallet
  const wallet = new ethers.Wallet(privateKey, provider);

  // Fee Data for max fees and stuff
  const feeData = await provider.getFeeData();

  const { hash, wait } = await wallet.sendTransaction({
    data: route.methodParameters.calldata,
    to: V3_SWAP_ROUTER_ADDRESS.default,
    value: route.methodParameters.value,
    from: wallet.address,
    gasLimit: 40_000,
    maxFeePerGas: feeData.maxFeePerGas || MAX_FEE_PER_GAS,
    maxPriorityFeePerGas:
      feeData.maxPriorityFeePerGas || MAX_PRIORITY_FEE_PER_GAS,
  });

  console.log("Swap txn it sent with hash", hash);

  return { hash, wait };
}
