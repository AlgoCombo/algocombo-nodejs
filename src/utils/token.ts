import Web3 from "web3";
import ERC20_ABI from "../abis/ERC20.json";
import { TOKENS } from "../constants/tokens";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";

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

    /// Check Allowance otherwise Approve
    const allowance = (await tokenContract.methods
      .allowance(account.address, spenderAddress)
      .call()) as BigNumber;
    // console.log("Allowance:", allowance);
    if (+formatEther(allowance) >= +amount) {
      return true; // No need to approve any furthur
    }

    ///

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
    // @ts-ignore
    const coin_details: any = TOKENS[chain_id]!.find(
      (token: any) => token.name === coin
    );
    return coin_details;
  } catch (error) {
    console.error("Failed to get token data:", error);
    return false;
  }
}
