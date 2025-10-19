import mongoose, { Document } from "mongoose";
import { IReaction } from "./Post.interface";

export interface IComment extends Document {
  userId: mongoose.Types.ObjectId | string;
  postId: mongoose.Types.ObjectId | string;
  parentId: mongoose.Types.ObjectId | string;
  content?: string | null;
  attachment?: string;
  reactionsCount?: number;
  reactions?: IReaction[];
  mentions?: mongoose.Types.ObjectId[] | string[];
}
