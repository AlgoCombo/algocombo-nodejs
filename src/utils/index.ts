import Wallet from "ethereumjs-wallet";

export function generateWallet() {
  const wallet = Wallet.generate();

  const address = wallet.getAddressString();
  const privateKey = wallet.getPrivateKeyString();

  return { address, privateKey };
}

export * from "./token";
