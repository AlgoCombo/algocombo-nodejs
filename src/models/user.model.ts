import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  wallet_address: string;
  hot_wallet_public_key: string;
  hot_wallet_private_key: string;
  createdAt: Date;
}

export const UserSchema: Schema = new mongoose.Schema<IUser>({
  wallet_address: String,
  hot_wallet_public_key: String,
  hot_wallet_private_key: String,
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current date/time
  },
});

export const UserModel: Model<IUser> =
  mongoose.models.user || mongoose.model<IUser>("user", UserSchema);
