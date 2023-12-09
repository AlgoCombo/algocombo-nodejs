import { Router, Request, Response } from "express";
import TradeController from "./controller.trade";

const router: Router = Router();

router.post("/active-trades", async (req: Request, res: Response) => {
  const response = await TradeController.getActiveTrades(req.body);
  return res.status(response.status).json(response);
});

router.get("/:trade_id", async (req: Request, res: Response) => {
  const response = await TradeController.getTradeLogs(req.params);
  return res.status(response.status).json(response);
});

router.get("/fusion/:id", async (req: Request, res: Response) => {
  const response = await TradeController.getFusionTrades(req.params);
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

router.get("/trade-cron", async (_: Request, res: Response) => {
  const response = await TradeController.cronJobTrades();
  return res.status(response.status).json(response);
});

router.delete("/:trade_id", async (req: Request, res: Response) => {
  const response = await TradeController.closeTrade(req.params);
  return res.status(response.status).json(response);
});

export default router;
