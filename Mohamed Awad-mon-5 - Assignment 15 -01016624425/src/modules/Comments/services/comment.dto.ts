import mongoose from "mongoose";

export interface commentDTO {
  content?: string;
  mention?: mongoose.Types.ObjectId[];
  postId: mongoose.Types.ObjectId | string;
}
export interface replyCommentDTO {
  content: string;
  mention?: mongoose.Types.ObjectId[];
  parentId: mongoose.Types.ObjectId | string
}
export interface updateCommentDTO {
  content?: string;
  mention?: mongoose.Types.ObjectId[];
}
