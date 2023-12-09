import express from "express";
import { Application } from "express";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.get("/", (_, res) => {
  res.send("Hello World!");
});

//import user router
import userRouter from "./router/users/api.user";
app.use("/users", userRouter);

//import trade router
import tradeRouter from "./router/trades/api.trade";
app.use("/trades", tradeRouter);

export default app;
