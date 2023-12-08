import { PublicClient, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client: PublicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export default client
