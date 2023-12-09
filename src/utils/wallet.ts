import Wallet from "ethereumjs-wallet";

import { Address, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygon } from "viem/chains";

import ERC20ABI from "../abis/ERC20.json";

export function generateWallet() {
  const wallet = Wallet.generate();

  const address = wallet.getAddressString();
  const privateKey = wallet.getPrivateKeyString();

  return { address, privateKey };
}

export async function transferTokens(
  privateKey: Address,
  destAddress: Address,
  tokenAddress: Address,
  amount: string
) {
  try {
    const account = privateKeyToAccount(privateKey);
    const walletClient = createWalletClient({
      account,
      chain: polygon,
      // @ts-ignore
      transport: http(),
    });

    // ERC20 Transfer
    const hash = await walletClient.writeContract({
      abi: ERC20ABI as any,
      address: tokenAddress,
      args: [destAddress, amount],
      functionName: "transfer",
    });

    console.log("transferTokens txn hash:", hash);

    return hash;
  } catch (e) {
    console.log(e);
    return null;
  }
}
