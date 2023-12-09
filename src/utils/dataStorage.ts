import { ethers } from "ethers";
import { JsonRpcProvider } from "ethers";
import dataStorageABI from "../abis/dataStorage.json";
import { RPC_URLS } from "../constants";
import { DATA_CONTRACTS } from "constants/tokens";
import { getCoinDetails } from "./token";

export async function storeOnChain(data: any) {
  try {
    const provider = new JsonRpcProvider(RPC_URLS[data.chain_id]);

    const wallet = new ethers.Wallet(
      data.creator.hot_wallet_private_key,
      provider
    );

    const contractAddress = DATA_CONTRACTS[data.chain_id];
    const contractABI = dataStorageABI; // Your contract ABI here
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    const coin1_addresss = getCoinDetails(data.coin1, data.chain_id).address;
    const coin2_address = getCoinDetails(data.coin2, data.chain_id).address;

    const methodName = "addTrade";
    const methodArgs = [
      data.creator.wallet_address,
      [
        data.trade_id.toString(),
        data.creator.wallet_address,
        data.amount,
        coin1_addresss,
        coin2_address,
      ],
    ];

    const transaction = await contract[methodName](...methodArgs);
    console.log("Transaction hash:", transaction.hash);
    transaction.wait();
    return {
      status: 200,
      message: "Trade data stored on chain successfully",
      data: transaction.hash,
    };
  } catch (error: any) {
    console.log(error);
    return {
      status: 500,
      message: "Internal server error",
      data: error,
    };
  }
}

// Transaction successful
console.log("Transaction successful!");
