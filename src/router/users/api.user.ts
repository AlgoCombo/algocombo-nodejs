import { Router, Request, Response } from "express";
import UserController from "./controller.user";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const response = await UserController.getUsers(req.query);
  return res.status(response.status).json(response);
});

router.post("/", async (req: Request, res: Response) => {
  const response = await UserController.createUser(req.body);
  return res.status(response.status).json(response);
});

router.post("/hot-wallet", async (req: Request, res: Response) => {
  const response = await UserController.getHotWallet(req.body);
  return res.status(response.status).json(response);
});

router.get("/get-tokens", async (_: Request, res: Response) => {
  const response = await UserController.getTokens();
  return res.status(response.status).json(response);
});

export default router;
