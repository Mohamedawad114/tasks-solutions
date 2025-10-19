import { Request, Response } from "express";
import mongoose from "mongoose";
import { commentRepo, Post_Repo } from "../../../repositories";
import { CommentModel, postModel } from "../../../DB/models";
import { redis, s3_services, SuccessResponse } from "../../../utils";
import { BadRequestException, notFoundException } from "../../../common/Errors";
import { friends_Blacklist } from "../../../common";
import { userInfo } from "node:os";

class Post_services {
  private postRepo: Post_Repo = new Post_Repo(postModel);
  private commentRepo: commentRepo = new commentRepo(CommentModel);
  private s3Client = new s3_services();

  getMyPosts = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user as unknown as mongoose.Types.ObjectId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 15;
    const offset = (page - 1) * limit;
    const myposts = await this.postRepo.findDocuments(
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
    if (!myposts.length) throw new notFoundException("posts not found");
    return res
      .status(200)
      .json(SuccessResponse("posts found", 200, { myposts, page }));
  };
  getPost = async (req: Request, res: Response): Promise<Response> => {
    const postId = req.params.postId as unknown as mongoose.Types.ObjectId;
    const blacklist = await redis.smembers(`blocked_friends:${req.user?._id}`);
    const post = await this.postRepo.findOneDocument(
      {
        _id: postId,
        userId: { $nin: blacklist },
      },
      {
        Reactions: 0,
        sharedFrom: 0,
      },
      {
        populate: {
          path: "userId",
          select: "username",
        },
      }
    );
    if (!post) {
      throw new notFoundException("post not found");
    }
    return res.status(200).json(SuccessResponse("post found", 200, { post }));
  };

  createPost = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id as mongoose.Types.ObjectId;
    const content = req.body.content;
    const files = req.files as Express.Multer.File[];
    const createdPost = await this.postRepo.createDocument({
      userId,
      content,
    });
    let uploadResult: string[] = [];
    if (files && files.length > 0) {
      uploadResult = await this.s3Client.upload_files(
        files,
        `${userId}/posts/${createdPost._id}`
      );
      createdPost.attachments = uploadResult;
      await this.postRepo.updatePost(createdPost);
    }
    return res
      .status(201)
      .json(SuccessResponse("post shared", 201, { createdPost }));
  };
  sharePost = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id as mongoose.Types.ObjectId;
    const postId = req.params.postId as unknown as mongoose.Types.ObjectId;
    const { content } = req.body;
    const post = await this.postRepo.findByIdDocument(postId);
    if (!post) throw new notFoundException("original post not found");
    const sharedPost = await this.postRepo.createDocument({
      userId,
      content,
      sharedFrom: postId,
    });
    post.sharedCount = Number(post.sharedCount) + 1;
    await this.postRepo.updatePost(post);
    return res
      .status(201)
      .json(SuccessResponse("post shared", 201, { sharedPost }));
  };
  updatePost = async (req: Request, res: Response): Promise<Response> => {
    const postId = req.params.postId as unknown as mongoose.Types.ObjectId;
    const { content } = req.body;
    if (!postId) throw new BadRequestException("postId is required");
    const postUpdated = await this.postRepo.findAndUpdateDocument(postId, {
      content: content,
    });
    return res
      .status(200)
      .json(SuccessResponse("post updated", 200, { postUpdated }));
  };
  Reaction = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const postId = req.params.postId as unknown as mongoose.Types.ObjectId;
    const { reaction } = req.body;
    const post = await this.postRepo.findByIdDocument(postId);
    if (!post) throw new notFoundException("post not found");
    const existing = post.Reactions?.find(
      (r) => r.userId.toString() === userId.toString()
    );
    if (existing) {
      if (existing.Reaction === reaction) {
        await this.postRepo.updateDocument(
          { _id: postId },
          {
            $pull: { Reactions: { userId } },
            $inc: { reactionCount: -1 },
          }
        );
      } else {
        await this.postRepo.updateDocument(
          { _id: postId, "Reactions.userId": userId },
          {
            $set: { "Reactions.$.Reaction": reaction },
          }
        );
      }
    } else {
      await this.postRepo.updateDocument(
        { _id: postId },
        {
          $push: { Reactions: { userId, Reaction: reaction } },
          $inc: { reactionCount: 1 },
        }
      );
    }
    return res.sendStatus(204);
  };
  getReactionsUsers = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const postId = req.params.postId as unknown as mongoose.Types.ObjectId;
    const blacklist = await friends_Blacklist(
      req.user?._id as unknown as mongoose.Types.ObjectId
    );
    const post = await this.postRepo.findByIdDocument(
      postId,
      { Reactions: 1 },
      {
        populate: { path: "Reactions.userId", select: "username" },
      }
    );
    if (!post) throw new notFoundException("post not found");
    let reactions = post.Reactions;
    if (reactions?.length) {
      if (blacklist.length) {
        reactions = reactions.filter(
          (r) => !blacklist.includes(r.userId.toString())
        );
      }
    }
    if (!reactions?.length)
      return res.status(200).json(SuccessResponse("no reactions yet", 200));
    return res.status(200).json(
      SuccessResponse("reactions found", 200, {
        reactions,
      })
    );
  };
  deletePost = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const postId = req.params.postId as unknown as mongoose.Types.ObjectId;
    const post = await this.postRepo.findByIdDocument(postId);
    if (!post) throw new notFoundException("post not found");
    const session = await mongoose.startSession();
    req.session = session;
    session.startTransaction();
    const PostDeleted = await this.postRepo.findByIdAndDeleteDocument(postId, {
      session,
    });
    await this.commentRepo.deleteManyDocuments({ postId }, { session });
    await session.commitTransaction();
    session.endSession();
    if (post.attachments?.length) {
      await this.s3Client.deleteListderictory(`${userId}/posts/${postId}`);
    }
    return res
      .status(200)
      .json(SuccessResponse("post deleted", 200, { PostDeleted }));
  };
}
export default new Post_services();
