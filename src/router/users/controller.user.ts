import { recoverMessageAddress } from "viem";
import { UserModel } from "../../models/user.model";

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
      const user = await UserModel.create(body);
      return {
        status: 201,
        message: "User created",
        data: user,
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
      const wallet_address = await recoverMessageAddress({
        message: "hello world",
        signature: body.signature,
      });
      console.log(wallet_address);

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
