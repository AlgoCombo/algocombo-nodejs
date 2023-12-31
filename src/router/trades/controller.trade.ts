import { Address, recoverMessageAddress } from "viem";
// import Web3 from "web3";
import { TradeModel } from "../../models/trades.model";
import { UserModel } from "../../models/user.model";
import UserController from "../users/controller.user";
import {
  // approveERC20Token,
  transferTokens,
  getCoinDetails,
  storeOnChain,
} from "../../utils";
import { swap } from "../../swap";
import { ordersByMaker } from "../../swap/fusion";
// import { RPC_URLS } from "../../constants";
// import { ONE_INCH_ROUTER_V5 } from "@1inch/fusion-sdk";
// import mongoose from "mongoose";
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

  async getAllTrades(body: any) {
    try {
      const wallet_address = body.wallet_address;
      console.log(wallet_address);

      // const earliestTrades = await TradeModel.aggregate([
      //   {
      //     $match: {
      //       "creator.wallet_address": wallet_address,
      //       isActive: true,
      //     },
      //   },
      //   {
      //     $sort: { createdAt: 1 }, // Sort by createdAt in ascending order
      //   },
      //   {
      //     $group: {
      //       _id: "$trade_id",
      //       earliestTrade: { $first: "$$ROOT" }, // Get the earliest trade in each group
      //     },
      //   },
      // ]);

      // // For the latest trade
      // const latestTrades = await TradeModel.aggregate([
      //   {
      //     $match: {
      //       "creator.wallet_address": wallet_address,
      //       isActive: true,
      //     },
      //   },
      //   {
      //     $sort: { createdAt: -1 }, // Sort by createdAt in descending order
      //   },
      //   {
      //     $group: {
      //       _id: "$trade_id",
      //       latestTrade: { $first: "$$ROOT" }, // Get the latest trade in each group
      //     },
      //   },
      // ]);

      // const earliestMap = new Map(
      //   earliestTrades.map((trade) => [trade._id, trade])
      // );
      // const mergedData = latestTrades.map((trade) => ({
      //   earliest: earliestMap.get(trade._id),
      //   latest: trade,
      // }));

      const mergedData = await TradeModel.find({});

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

  async getTradeLogs(params: any) {
    try {
      const trade_logs = await TradeModel.find({
        trade_id: params.trade_id,
      }).sort({ createdAt: 1 });
      return {
        status: 200,
        message: "Trade logs found",
        data: trade_logs,
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

  async getFusionTrades(params: any) {
    try {
      const trade = await TradeModel.findById(params.id);
      const fusion_trades = await ordersByMaker(
        trade?.creator.hot_wallet_public_key as Address,
        trade?.chain_id as number
      );

      return {
        status: 200,
        message: "Trade logs found",
        data: fusion_trades,
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
      let wallet_addresss = await recoverMessageAddress({
        message: body.message,
        signature: body.signature,
      });
      console.log(wallet_addresss);
      const wallet_address = body.wallet_address;
      const wallet_creation_data = await UserController.createUserHelper({
        wallet_address,
      });
      if (wallet_creation_data.status == 500) {
        return {
          status: 500,
          message: "Internal server error",
          data: wallet_creation_data.data,
        };
      }
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

  //TEST
  async createSwaps(body: any) {
    /*
    body will have only trade_id and signal
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

      const token0 = getCoinDetails(
        current_trade.current_coin,
        current_trade.chain_id
      );

      const token1 = getCoinDetails(current_coin, current_trade.chain_id);

      //TODO: Fusion API swap

      const swap_params = {
        amountIn: current_trade.amount,
        token0: token0,
        token1: token1,
        walletAddress: current_trade.creator.hot_wallet_public_key as Address,
        privateKey: current_trade.creator.hot_wallet_private_key as Address,
        chainId: current_trade.chain_id,
      };

      const swap_data: any = await swap(
        swap_params,
        current_trade.execution_type
      );

      let order_details_json;
      if (current_trade.order_details === "") {
        order_details_json = {
          order_id: swap_data.data,
        };
      } else {
        order_details_json = JSON.parse(current_trade.order_details);
        order_details_json.order_id = swap_data.data;
      }

      const new_trade_data = {
        trade_id: current_trade.trade_id,
        current_coin: current_coin,
        coin_pairs: current_trade.coin_pairs,
        amount: swap_data.amountOut, //will get from fusion api later TODO
        chain_id: current_trade.chain_id,
        isActive: current_trade.isActive,
        creator: current_trade.creator,
        order_details: JSON.stringify(order_details_json),
        algorithm: current_trade.algorithm,
        execution_type: current_trade.execution_type,
      };

      const new_trade: any = await TradeModel.create(new_trade_data);
      await storeOnChain({
        creator: new_trade_data.creator,
        chain_id: new_trade_data.chain_id,
        coin1: current_trade.current_coin,
        coin2: new_trade_data.current_coin,
        amount: new_trade_data.amount,
        trade_id: new_trade_data.trade_id,
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

  async cronJobTrades() {
    try {
      //get all last active trades by group_id
      const latest_active_trades = await TradeModel.aggregate([
        {
          $match: {
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

      //use fetch to get trade signals from the python api in promise.all
      // const algorithms_url=`https://algocombo-backend.onrender.com/algorithms/get_signal/${algorithm_name}`
      const algorithms_response = Promise.all(
        latest_active_trades.map(async (trade: any) => {
          const algorithm = JSON.parse(trade.latestTrade.algorithm);
          const algorithms_url = `https://algocombo-backend.onrender.com/algorithms/get_signal/${algorithm.name}`;
          let current_coin;
          const coin_pairs = trade.latestTrade.coin_pairs;
          for (let i = 0; i < coin_pairs.length; i++) {
            if (coin_pairs[i] != trade.latestTrade.current_coin) {
              current_coin = coin_pairs[i];
              break;
            }
          }
          const post_body = {
            coin1: trade.latestTrade.current_coin,
            coin2: current_coin,
          };

          const response = await fetch(algorithms_url, {
            body: JSON.stringify(post_body),
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });

          return response;
        })
      );

      const algorithms_signals = await algorithms_response;
      const signals = algorithms_signals.map(
        (response: any) => response?.signal || 0
      );

      //foreach trade we run the swap function
      for (let i = 0; i < latest_active_trades.length; i++) {
        const current_trade = latest_active_trades[i].latestTrade;
        TradeController.prototype.createSwaps({
          trade_id: current_trade.trade_id,
          signal: signals[i],
        });
      }

      return {
        status: 200,
        message: "Cron job done",
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

  //TEST
  async closeTrade(params: any) {
    try {
      const trade = await TradeModel.findOne({
        trade_id: params.trade_id,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(1);
      if (!trade) {
        return {
          status: 404,
          message: "Trade does not exist",
        };
      }

      const coin_address = getCoinDetails(
        trade.current_coin,
        trade.chain_id
      ).address;

      const txn_hash = await transferTokens(
        trade.creator.hot_wallet_private_key as Address,
        trade.creator.wallet_address as Address,
        coin_address as Address,
        trade.amount.toString()
      );
      if (!txn_hash) {
        return {
          status: 500,
          message: "Could not withdraw funds. Reverting delete",
        };
      }

      await TradeModel.updateMany(
        {
          trade_id: params.trade_id,
          isActive: true,
        },
        { $set: { isActive: false } }
      );

      return {
        status: 200,
        message: "Trade withdrawn",
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
