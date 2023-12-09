import { SwapData } from "types";

import { swap as swapFusion } from "./fusion";
import { swap as swapUniswap } from "./uniswap";

export function swap(data: SwapData, type = "uniswap") {
  switch (type) {
    case "uniswap": {
      return swapUniswap.apply(null, Object.values(data) as any);
    }
    case "fusionswap": {
      return swapFusion.apply(null, Object.values(data) as any);
    }
    default:
      return null;
  }
}
