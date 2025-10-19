import { Request, Response } from "express";
import dayjs from "dayjs";
import { postModel, UserModel } from "../../DB/models";
import { friendshipRepo, Post_Repo, UserRepo } from "../../repositories";
import { redis, SuccessResponse } from "../../utils";
import { notFoundException } from "../../common/Errors";
import mongoose from "mongoose";
import { friends_Blacklist } from "../../common";

class Home_Services {
  private userRepo: UserRepo = new UserRepo(UserModel);
  private postRepo: Post_Repo = new Post_Repo(postModel);
  private friendshipRepo: friendshipRepo = new friendshipRepo();

  search = async (req: Request, res: Response): Promise<Response> => {
    const username: string = req.query.name as string;
    const blacklist = await friends_Blacklist(
              req.user?._id as unknown as mongoose.Types.ObjectId
            );
    const page = parseInt(req.query.page as string) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;
    if (!username?.trim())
      return res
        .status(400)
        .json(SuccessResponse("username query is required", 400));
    const users = await this.userRepo.findDocuments(
      { username: { $regex: `${username}`, $options: "i" },_id:{$nin:blacklist} },
      {
        phone: 0,
        email: 0,
      },
      {
        limit: limit,
        skip: offset,
      }
    );
    if (!users.length)
      return res.status(200).json(SuccessResponse("no users found ", 200));
    return res
      .status(200)
      .json(SuccessResponse("users found ", 200, { users, page }));
  };
  getUserPosts = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId as unknown as mongoose.Types.ObjectId;
        const blacklist = await friends_Blacklist(
          req.user?._id as unknown as mongoose.Types.ObjectId
        );
    const user = await this.userRepo.findOneDocument({ $and: [ { _id: userId }, { _id: { $nin: blacklist } } ] });
    if (!user) throw new notFoundException("user not found");
    if (!user.isPublic) {
      return res
        .status(200)
        .json(SuccessResponse("user profile is private", 200));
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = 15;
    const offset = (page - 1) * limit;
    const userPosts = await this.postRepo.findDocuments(
      { userId },
      {
        Reactions: 0,
        sharedFrom: 0,
      },
      {
        limit: limit,
        skip: offset,
        sort: { createdAt: -1 },
      }
    );
    if (!userPosts.length) throw new notFoundException("no posts found");
    return res
      .status(200)
      .json(SuccessResponse("posts found", 200, { userPosts, page }));
  };
  getFeedsPosts = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id;
    const page = parseInt(req.query.page as string) || 1;
    const start = dayjs().subtract(1, "day").startOf("day").toDate();
    const limit = 10;
    const offset = (page - 1) * limit;
    let friends = await redis.smembers(`friends:${userId}`);
    if (!friends.length) {
      const friendships = await this.friendshipRepo.findDocuments(
        {
          $or: [{ requestFromId: userId }, { requestToId: userId }],
          status: "accepted",
        },
        { requester: 1, requestTo: 1 }
      );
      const ids = new Set<string>();
      for (const f of friendships) {
        if (String(f.requestFromId) !== String(userId))
          ids.add(String(f.requestFromId));
        if (String(f.requestToId) !== String(userId))
          ids.add(String(f.requestToId));
      }
      friends = Array.from(ids);
    }
    if (!friends.length)
      return res
        .status(200)
        .json(SuccessResponse("no friends posts found", 200, { posts: [] }));
    const posts = await this.postRepo.findDocuments(
      {
        userId: { $in: friends },
        createdAt: { $gte: start },
      },
      { Reactions: 0 },
      {
        populate: { path: "userId", select: "username profilePicture" },
        limit,
        skip: offset,
        sort: { createdAt: -1 },
      }
    );
    return res
      .status(200)
      .json(SuccessResponse("friends posts", 200, { posts }));
  };
}

export default new Home_Services();
