import { createPublicClient } from "viem";

export function storeOnChain(data: any) {
  try {
    const client = createPublicClient({
      chain: { id: 137 },
    });
  } catch (error: any) {
    console.log(error);
    return {
      status: 500,
      message: "Internal server error",
      data: error,
    };
  }
}
