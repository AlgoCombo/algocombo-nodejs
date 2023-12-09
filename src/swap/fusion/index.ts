import "dotenv/config";

import {
  FusionSDK,
  ONE_INCH_ROUTER_V5,
  PrivateKeyProviderConnector,
  Web3ProviderConnector,
} from "@1inch/fusion-sdk";
import { ONE_INCH_KEY, RPC_URLS, TOKENS } from "../../constants";
import Web3 from "web3";
import { OrdersByMakerResponse } from "@1inch/fusion-sdk/api/orders";
import { TokenInfo } from "types";
import { approveERC20Token } from "../../utils";

function getSDK(
  chainId: number,
  blockchainProvider: PrivateKeyProviderConnector | Web3ProviderConnector
) {
  console.log("Fusion API Key", ONE_INCH_KEY);
  return new FusionSDK({
    url: "https://api.1inch.dev/fusion",
    network: chainId,
    blockchainProvider,
    authKey: ONE_INCH_KEY,
  });
}

export async function swap(
  amount: string, // BigNumber to string mostly
  token0: TokenInfo,
  token1: TokenInfo,
  walletAddress: string,
  privateKey: string,
  chainId: number
) {
  const web3 = new Web3(RPC_URLS[chainId]);
  const blockchainProvider = new PrivateKeyProviderConnector(privateKey, web3);

  const sdk = getSDK(chainId, blockchainProvider);

  // Check Allowance otherwise Approve
  await approveERC20Token(
    web3,
    TOKENS[137][0].address,
    privateKey,
    ONE_INCH_ROUTER_V5,
    amount
  );

  const result = await sdk.placeOrder({
    fromTokenAddress: token0.address,
    toTokenAddress: token1.address,
    amount,
    walletAddress,
  });

  console.log("Swap Complete with result", result);

  return result;
}

export async function ordersByMaker(
  address: string,
  chainId: number
): Promise<OrdersByMakerResponse> {
  const blockchainProvider = new Web3ProviderConnector(
    new Web3(RPC_URLS[chainId])
  );
  const sdk = getSDK(chainId, blockchainProvider);
  return await sdk.getOrdersByMaker({
    page: 1,
    limit: 10,
    address,
  });
}
