import mongoose, { Document } from "mongoose";

export interface IReaction {
  userId: mongoose.Types.ObjectId | string;
  Reaction: number;
}

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId | string;
  content?: string;
  Reactions?: IReaction[];
  attachments?: string[];
  reactionCount: Number;
  commentCount: Number;
  sharedCount: Number;
  sharedFrom?: mongoose.Types.ObjectId | string;
}
