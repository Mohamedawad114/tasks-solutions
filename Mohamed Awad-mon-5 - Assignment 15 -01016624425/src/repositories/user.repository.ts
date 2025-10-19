import { Model } from "mongoose";
import { IUser } from "../common";
import { BaseRepository } from "./Base.repository";

export class UserRepo extends BaseRepository<IUser> {
  constructor(protected userModel: Model<IUser>) {
    super(userModel);
  }
  async updateUser(user: IUser): Promise<IUser> {
    return await user.save();
  }
 
}
