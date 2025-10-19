import mongoose from "mongoose";
import { redis } from "../../utils";

export const friends_Blacklist = async (
  userId: mongoose.Types.ObjectId | string
) => {
  const balckList = await redis.smembers(`blocked_friends:${userId}`);
  return balckList || [];
};

export const isBlock = async (
  userId: mongoose.Types.ObjectId | string,
  checkId: mongoose.Types.ObjectId | string
) => {
  return await redis.sismember(
    `blocked_friends:${userId}`,
    checkId as any
  );
};