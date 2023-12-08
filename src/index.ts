import express from "express";

const app = express();

app.get("/addTrade", (req, res) => {
  // Schedule trade, i.e. add to database
});

app.get("/execute", (req, res) => {
    // Fetch all trades (Daily for now)
    // Call Python API to run each trade's algorithm
    // If positive, execute the trade using 1Inch
    // Log the results in database
})
