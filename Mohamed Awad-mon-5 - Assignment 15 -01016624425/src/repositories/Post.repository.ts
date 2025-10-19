import { Model } from "mongoose";
import { IPost } from "../common";
import { BaseRepository } from "./Base.repository";

export class Post_Repo extends BaseRepository<IPost> {
  constructor(protected postModel: Model<IPost>) {
    super(postModel);
  }
  async updatePost(post:IPost): Promise<IPost> {
    return await post.save();
  }
}
