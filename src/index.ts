import express from "express";
import { getHistoricalData } from "./chainlink/getHistoricalData.ts";

const app = express();

const PORT = process.env.PORT || 8080;

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.get("/", (_, res) => {
  res.send("OK");
});

app.get("/addTrade", (req, res) => {
  // Schedule trade, i.e. add to database
});

app.get("/execute", (req, res) => {
  // Fetch all trades (Daily for now)
  // Call Python API to run each trade's algorithm
  // If positive, execute the trade using 1Inch
  // Log the results in database
});

// TESTING
app.get("/data", async (req, res) => {
  res.send(await getHistoricalData());
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}/`);
});
