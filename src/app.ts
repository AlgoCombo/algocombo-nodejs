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

import userRouter from "./router/users/api.user";
app.use("/users", userRouter);

export default app;
