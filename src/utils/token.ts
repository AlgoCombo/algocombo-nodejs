import Web3 from "web3";
import ERC20_ABI from "../abis/ERC20.json";
import { TOKENS } from "../constants/tokens";

export async function approveERC20Token(
  web3: Web3,
  contractAddress: string,
  privateKey: string,
  spenderAddress: string,
  amount: string
): Promise<boolean> {
  try {
    const tokenContract = new web3.eth.Contract(
      ERC20_ABI as any,
      contractAddress
    );
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.defaultAccount = account.address;

    // @ts-ignore
    const approvalData = tokenContract.methods
      .approve(spenderAddress, amount)
      .encodeABI();

    const signedTransaction = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
        data: approvalData,
        gas: "50000", // Adjust the gas limit as needed
      },
      privateKey
    );

    if (!signedTransaction.rawTransaction)
      throw new Error("Failed to sign transaction");

    // Send the signed transaction
    const transactionReceipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );

    console.log("Transaction successful:", transactionReceipt);
    return true;
  } catch (error) {
    console.error("Failed to approve ERC20 token:", error);
    return false;
  }
}

export function getCoinDetails(coin: string, chain_id: number) {
  try {
    const coin_details: any = TOKENS[chain_id].filter(
      (token: any) => token.name === coin
    )[0];
    return coin_details;
  } catch (error) {
    console.error("Failed to get token data:", error);
    return false;
  }
}
