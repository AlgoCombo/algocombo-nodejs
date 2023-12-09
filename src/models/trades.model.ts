import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser, UserSchema } from "./user.model";

export interface ITrade extends Document {
  trade_id: number;
  current_coin: string;
  coin_pairs: [string];
  amount: number;
  chain_id: number;
  order_details: string;
  algorithm: string;
  execution_type: string;
  creator: IUser;
  isActive: boolean;
  createdAt: Date;
}

export const TradeSchema: Schema = new mongoose.Schema<ITrade>({
  trade_id: {
    type: Number,
  },
  current_coin: String,
  coin_pairs: [String],
  amount: Number,
  chain_id: Number,
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date/time
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  creator: UserSchema,
  algorithm: {
    type: String,
    default: "",
  },
  order_details: {
    type: String,
    default: "",
  },
  execution_type: {
    type: String,
    default: "fusionswap",
  },
});

// Pre-save hook to generate trade_id before saving the document
TradeSchema.pre<ITrade>("save", async function (next) {
  const trade = this as ITrade;
  if (!trade.trade_id) {
    try {
      const highestTrade = await TradeModel.findOne({}, { trade_id: 1 }).sort({
        trade_id: -1,
      });
      if (highestTrade) {
        trade.trade_id = highestTrade.trade_id + 1;
      } else {
        trade.trade_id = 1;
      }
      next();
    } catch (error: any) {
      console.error("Error:", error);
      next(error);
    }
  } else {
    next();
  }
});

export const TradeModel: Model<ITrade> =
  mongoose.models.trade || mongoose.model<ITrade>("trade", TradeSchema);
