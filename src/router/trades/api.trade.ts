import { Router, Request, Response } from "express";
import TradeController from "./controller.trade";

const router: Router = Router();

router.post("/active-trades", async (req: Request, res: Response) => {
  const response = await TradeController.getActiveTrades(req.body);
  return res.status(response.status).json(response);
});

router.post("/", async (req: Request, res: Response) => {
  const response = await TradeController.createTrade(req.body);
  return res.status(response.status).json(response);
});

router.post("/swap", async (req: Request, res: Response) => {
  const response = await TradeController.createSwaps(req.body);
  return res.status(response.status).json(response);
});

export default router;
