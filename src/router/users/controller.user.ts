import { recoverMessageAddress } from "viem";
import { UserModel } from "../../models/user.model";
import { generateWallet } from "../../utils";

class UserController {
  async getUsers(query: any) {
    try {
      const users = await UserModel.find(query);
      return {
        status: 200,
        message: "Users found",
        data: users,
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

  async createUser(body: any) {
    try {
      const wallet_address = await recoverMessageAddress({
        message: body.message,
        signature: body.signature,
      });

      const user = await UserModel.findOne({ wallet_address });
      if (user) {
        return {
          status: 200,
          message: "User already exists",
          data: user.hot_wallet_public_key,
        };
      }

      //create hot wallet
      const hot_wallet_data = generateWallet();

      const new_user_data = {
        wallet_address,
        hot_wallet_public_key: hot_wallet_data.address,
        hot_wallet_private_key: hot_wallet_data.privateKey,
      };
      const new_user = await UserModel.create(new_user_data);

      return {
        status: 201,
        message: "User created",
        data: new_user,
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

  async getHotWallet(body: any) {
    try {
      const wallet_address = body.wallet_address;

      let data;
      const hot_wallet: any = await UserModel.findOne({ wallet_address });
      if (!hot_wallet) {
        data = null;
      } else {
        data = hot_wallet.hot_wallet_public_key;
      }
      return {
        status: 200,
        message: "Hot wallet found",
        data,
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

export default new UserController();
