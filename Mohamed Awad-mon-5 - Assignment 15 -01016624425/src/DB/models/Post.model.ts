import mongoose from "mongoose";
import { IPost, IReaction, Post_Reaction } from "../../common";

export const ReactionSchema = new mongoose.Schema<IReaction>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Reaction: {
      type: Number,
      enum: Post_Reaction,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PostSchema = new mongoose.Schema<IPost>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Reactions: [ReactionSchema],
    attachments: [{ type: String }],
    content: {
      type: String,
      required() {
        return (
          !this.attachments ||
          (this.attachments.length === 0 && !this.sharedFrom)
        );
      },
      trim: true,
    },
    reactionCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    sharedCount: { type: Number, default: 0 },
    sharedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.model<IPost>("Post", PostSchema);
export { postModel };
