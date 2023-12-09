import { recoverMessageAddress } from "viem";
import { TradeModel } from "../../models/trades.model";
import { UserModel } from "../../models/user.model";

class TradeController {
  async getActiveTrades(body: any) {
    try {
      const wallet_address = body.wallet_address;

      const earliestTrades = await TradeModel.aggregate([
        {
          $match: {
            "creator.wallet_address": wallet_address,
            isActive: true,
          },
        },
        {
          $sort: { createdAt: 1 }, // Sort by createdAt in ascending order
        },
        {
          $group: {
            _id: "$trade_id",
            earliestTrade: { $first: "$$ROOT" }, // Get the earliest trade in each group
          },
        },
      ]);

      // For the latest trade
      const latestTrades = await TradeModel.aggregate([
        {
          $match: {
            "creator.wallet_address": wallet_address,
            isActive: true,
          },
        },
        {
          $sort: { createdAt: -1 }, // Sort by createdAt in descending order
        },
        {
          $group: {
            _id: "$trade_id",
            latestTrade: { $first: "$$ROOT" }, // Get the latest trade in each group
          },
        },
      ]);

      const earliestMap = new Map(
        earliestTrades.map((trade) => [trade._id, trade])
      );
      const mergedData = latestTrades.map((trade) => ({
        earliest: earliestMap.get(trade._id),
        latest: trade,
      }));

      return {
        status: 200,
        message: "Trades found",
        data: mergedData,
      };
    } catch (error: any) {
      console.log(error);
      return {
        status: 500,
        message: "Internal server error",
        data: error,
      };
    }
  }

  async createTrade(body: any) {
    try {
      const wallet_address = await recoverMessageAddress({
        message: "hello world",
        signature: body.signature,
      });
      const user: any = await UserModel.findOne({ wallet_address });
      if (!user)
        return {
          status: 400,
          message: "User not found",
          data: null,
        };
      const trade = await TradeModel.create({ ...body.trade, creator: user });
      return {
        status: 201,
        message: "Trade created",
        data: trade,
      };
    } catch (error: any) {
      console.log(error);
      return {
        status: 500,
        message: "Internal server error",
        data: error,
      };
    }
  }

  async createSwaps(body: any) {
    /*
    creates a swap programatically on the basis of a signal
    */
    try {
      const current_trade: any = await TradeModel.findOne({
        trade_id: body.trade_id,
      })
        .sort({ createdAt: -1 })
        .limit(1);
      if (!current_trade) {
        return {
          status: 400,
          message: "Trade not found",
          data: null,
        };
      }

      const validSignals = [-1, 0, 1];
      const signal = body.signal;
      if (!validSignals.includes(signal)) {
        return {
          status: 400,
          message: "Invalid signal",
          data: null,
        };
      }
      if (signal == 0) {
        return {
          status: 200,
          message: "Holding",
          data: null,
        };
      }
      if (signal == -1) {
        return {
          status: 201,
          message: "Sell signal so not moving ahead with the trade",
          data: null,
        };
      }

      let current_coin;
      const coin_pairs = current_trade.coin_pairs;
      for (let i = 0; i < coin_pairs.length; i++) {
        if (coin_pairs[i] != current_trade.current_coin) {
          current_coin = coin_pairs[i];
          break;
        }
      }

      //TODO: Fusion API swap

      const new_trade: any = await TradeModel.create({
        trade_id: current_trade.trade_id,
        current_coin: current_coin,
        coin_pairs: current_trade.coin_pairs,
        amount: current_trade.amount, //will get from fusion api later
        creator: current_trade.creator,
      });
      return {
        status: 201,
        message: "Trade created",
        data: new_trade,
      };
    } catch (error: any) {
      console.log(error);
      return {
        status: 500,
        message: "Internal server error",
        data: error,
      };
    }
  }
}

export default new TradeController();
