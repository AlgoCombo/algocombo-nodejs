import Wallet from "ethereumjs-wallet";

export function generateWallet() {
  const wallet = Wallet.default.generate();

  const address = wallet.getAddressString();
  const privateKey = wallet.getPrivateKeyString();

  return { address, privateKey };
}
