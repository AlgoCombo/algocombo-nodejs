import client from "../constants/client.ts";
import { AGGREGATOR_ADDRESS } from "../constants/index.ts";
import abi from "../abis/AggregatorV3Interface.json";

export async function getHistoricalData(feed = "AAVE/USD") {
  const address = AGGREGATOR_ADDRESS[feed];

  const roundData = await client.readContract({
    abi,
    address,
    functionName: "latestRoundData",
    args: [],
  });

  // Timestamp in Milliseconds
  const updatedAt = Number(roundData[3]) * 1000;

  console.log("updated at ", new Date(updatedAt))

  return roundData;
}
