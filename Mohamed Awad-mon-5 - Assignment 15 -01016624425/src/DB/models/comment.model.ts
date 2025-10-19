import mongoose from "mongoose";
import { IComment } from "../../common";
import { ReactionSchema } from "./Post.model";

const commentSchema = new mongoose.Schema<IComment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    content: {
      type: String,
      required() {
        return !this.attachment;
      },
      trim:true,
    },
    attachment: {
      type: String,
    },
    reactionsCount: {
      type: Number,
      default: 0,
    },
    reactions: [ReactionSchema],
    parentId: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);


const CommentModel = mongoose.model<IComment>("Comment", commentSchema);
export { CommentModel };