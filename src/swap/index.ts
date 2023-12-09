import "dotenv/config";

import {
  FusionSDK,
  PrivateKeyProviderConnector,
  Web3ProviderConnector,
} from "@1inch/fusion-sdk";
import { ONE_INCH_KEY, RPC_URLS } from "../constants";
import Web3 from "web3";
import { OrdersByMakerResponse } from "@1inch/fusion-sdk/api/orders";

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
  fromTokenAddress: string,
  toTokenAddress: string,
  walletAddress: string,
  privateKey: string,
  chainId = 80001
) {
  const blockchainProvider = new PrivateKeyProviderConnector(
    privateKey,
    new Web3(RPC_URLS[chainId])
  );

  const sdk = getSDK(chainId, blockchainProvider);

  const result = await sdk.placeOrder({
    fromTokenAddress,
    toTokenAddress,
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
