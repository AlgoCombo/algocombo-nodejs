import { FusionSDK, PrivateKeyProviderConnector } from "@1inch/fusion-sdk";
import { ONE_INCH_KEY, RPC_URLS } from "../constants";
import Web3 from "web3";

function getSDK(
  chainId: number,
  blockchainProvider: PrivateKeyProviderConnector
) {
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
  privateKey: string,
  chainId = 80001
) {
  const blockchainProvider = new PrivateKeyProviderConnector(
    privateKey,
    new Web3(RPC_URLS[chainId])
  );

  const sdk = getSDK(chainId, blockchainProvider);

  const result = await sdk
    .placeOrder({
      fromTokenAddress,
      toTokenAddress,
      amount,
      walletAddress: privateKey,
    })
    .then(console.log);

  console.log("Swap Complete with result", result);
}
