import { Request, Response } from "express";
import { CommentModel, postModel } from "../../../DB/models";
import { commentRepo, Post_Repo } from "../../../repositories";
import { s3_services, SuccessResponse } from "../../../utils";
import { commentDTO, updateCommentDTO } from "./comment.dto";
import mongoose from "mongoose";
import {
  BadRequestException,
  notAuthorizedException,
  notFoundException,
} from "../../../common/Errors";
import { friends_Blacklist } from "../../../common";

class Comment_services {
  private s3Client = new s3_services();
  private commentRepo = new commentRepo(CommentModel);
  private postRepo = new Post_Repo(postModel);

  getComments = async (req: Request, res: Response): Promise<Response> => {
    const postId = req.params.postId as unknown as mongoose.Types.ObjectId;
    const blacklist = await friends_Blacklist(
      req.user?._id as unknown as mongoose.Types.ObjectId
    );
    const page = parseInt(req.query.page as string) || 1;
    const limit = 15;
    const offset = (page - 1) * limit;
    const post = await this.postRepo.findByIdDocument(postId);
    if (!post) throw new notFoundException("post not found");
    const comments = await this.commentRepo.findDocuments(
      { postId, parentId:{$exists:false}, userId: { $nin: blacklist } },
      { reactions: 0 },
      {
        populate: [{ path: "userId", select: "username " }],
        limit: limit,
        skip: offset,
        sort: { createdAt: -1 },
      }
    );
    if (!comments.length) {
      return res.status(200).json(SuccessResponse("no comments yet", 200));
    }
    return res.status(200).json(
      SuccessResponse("comments found", 200, {
        comments,
        page,
      })
    );
  };
  getComments_reply = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const commentId = req.params
      .commentId as unknown as mongoose.Types.ObjectId;
    const blacklist = await friends_Blacklist(
      req.user?._id as unknown as mongoose.Types.ObjectId
    );
    const page = parseInt(req.query.page as string) || 1;
    const limit = 15;
    const offset = (page - 1) * limit;
    const comment = await this.commentRepo.findByIdDocument(commentId);
    if (!comment) throw new notFoundException("comment not found");
    const replies = await this.commentRepo.findDocuments(
      { parentId: commentId, userId: { $nin: blacklist } },
      { reactions: 0, postId: 0 },
      {
        populate: [{ path: "userId", select: "username " }],
        limit: limit,
        skip: offset,
        sort: { createdAt: -1 },
      }
    );
    if (!replies.length) {
      return res.status(200).json(SuccessResponse("no replies yet", 200));
    }
    return res.status(200).json(
      SuccessResponse("replies found", 200, {
        replies,
        page,
      })
    );
  };
  getComment = async (req: Request, res: Response): Promise<Response> => {
    const commentId = req.params
      .commentId as unknown as mongoose.Types.ObjectId;
    const blacklist = await friends_Blacklist(
      req.user?._id as unknown as mongoose.Types.ObjectId
    );
    const comment = await this.commentRepo.findOneDocument(
      { _id: commentId, userId: { $nin: blacklist } },
      { parentId: 0 },
      { populate: [{ path: "userId", select: "username " }] }
    );
    if (!comment) throw new notFoundException("comment not found");
    return res
      .status(200)
      .json(SuccessResponse("comment found", 200, { comment }));
  };
  createComment = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id as mongoose.Types.ObjectId;
    const postId = req.params.postId as unknown as mongoose.Types.ObjectId;
    const file = req.file as Express.Multer.File;
    const commentDTO: commentDTO = req.body;
    let uploadResult: string = "";
    const post = await this.postRepo.findByIdDocument(postId);
    if (!post) throw new notFoundException("post not found");
    if (!file && !commentDTO.content)
      throw new BadRequestException("content Or file are required");
    if (file) {
      const { Key } = await this.s3Client.upload_file(
        file,
        `${userId}/comments`
      );
      uploadResult = Key;
    }
    const created = await this.commentRepo.createDocument({
      postId: postId,
      userId,
      content: commentDTO.content || null,
      attachment: uploadResult,
      mentions: commentDTO.mention,
    });
    post.commentCount = Number(post.commentCount) + 1;
    await this.postRepo.updatePost(post);
    return res
      .status(201)
      .json(SuccessResponse("comment created", 201, { created }));
  };
  createReply = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id as mongoose.Types.ObjectId;
    const parentId = req.params.commentId as unknown as mongoose.Types.ObjectId;
    const file = req.file as Express.Multer.File;
    const replyDTO: commentDTO = req.body;
    if (!file && !replyDTO.content)
      throw new BadRequestException("content or file are required");
    const parentComment = await this.commentRepo.findByIdDocument(parentId);
    if (!parentComment) throw new notFoundException("Parent comment not found");
    let attachment = "";
    if (file) {
      const { Key } = await this.s3Client.upload_file(
        file,
        `${userId}/replies`
      );
      attachment = Key;
    }
    const created = await this.commentRepo.createDocument({
      postId: parentComment.postId,
      userId,
      parentId,
      content: replyDTO.content || null,
      attachment,
      mentions: replyDTO.mention || [],
    });
    const post = await this.postRepo.findByIdDocument(
      parentComment.postId as unknown as mongoose.Types.ObjectId
    );
    if (!post) throw new notFoundException("post not found");
    post.commentCount = Number(post.commentCount) + 1;
    await this.postRepo.updatePost(post);
    return res
      .status(201)
      .json(SuccessResponse("Reply shared", 201, { created }));
  };
  updateComment = async (req: Request, res: Response): Promise<Response> => {
    const commentId = req.params
      .commentId as unknown as mongoose.Types.ObjectId;
    const commentDTO: updateCommentDTO = req.body;
    const comment = await this.commentRepo.findOneDocument({
      _id: commentId,
      userId: req.user?._id,
    });
    if (!comment) throw new notFoundException("comment not found ");
    const commentupdated = await this.commentRepo.updateDocument(
      { _id: commentId },
      { content: commentDTO.content, mentions: commentDTO.mention },
      { new: true }
    );
    return res
      .status(200)
      .json(SuccessResponse("comment updated", 200, { commentupdated }));
  };
  Reaction = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const commentId = req.params
      .commentId as unknown as mongoose.Types.ObjectId;
    const { reaction } = req.body;
    const comment = await this.commentRepo.findByIdDocument(commentId);
    if (!comment) throw new notFoundException("comment not found");
    const existing = comment.reactions?.find(
      (r) => r.userId.toString() === userId.toString()
    );
    if (existing) {
      if (existing.Reaction === reaction) {
        await this.commentRepo.updateDocument(
          { _id: commentId },
          {
            $pull: { reactions: { userId } },
            $inc: { reactionsCount: -1 },
          }
        );
      } else {
        await this.commentRepo.updateDocument(
          { _id: commentId, "reactions.userId": userId },
          {
            $set: { "reactions.$.Reaction": reaction },
          }
        );
      }
    } else {
      await this.commentRepo.updateDocument(
        { _id: commentId },
        {
          $push: { reactions: { userId, Reaction: reaction } },
          $inc: { reactionsCount: 1 },
        }
      );
    }
    return res.sendStatus(204);
  };
  getReactionsUsers = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const commentId = req.params
      .commentId as unknown as mongoose.Types.ObjectId;
    const blacklist = await friends_Blacklist(
      req.user?._id as unknown as mongoose.Types.ObjectId
    );
    const comment = await this.commentRepo.findByIdDocument(
      commentId,
      { reactions: 1 },
      {
        populate: { path: "reactions.userId", select: "username" },
      }
    );
    if (!comment) throw new notFoundException("comment not found");
    let Reactions = comment.reactions;
    if (Reactions?.length) {
      if (blacklist.length) {
        Reactions = Reactions.filter(
          (r) => !blacklist.includes(r.userId.toString())
        );
      }
    }
    if (!Reactions?.length)
      return res.status(200).json(SuccessResponse("no reactions yet", 200));
    return res.status(200).json(
      SuccessResponse("reactions found", 200, {
        Reactions,
      })
    );
  };
  deleteComment = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const commentId = req.params
      .commentId as unknown as mongoose.Types.ObjectId;
    const session = await mongoose.startSession();
    req.session = session;
    const comment = await this.commentRepo.findOneDocument({
      _id: commentId,
    });
    if (!comment) throw new notFoundException("comment not found");
    const post = await this.postRepo.findByIdDocument(
      comment?.postId as unknown as mongoose.Types.ObjectId
    );
    if (
      comment.userId.toString() !== userId.toString() &&
      post?.userId.toString() !== userId.toString()
    ) {
      throw new notAuthorizedException("not authorized to delete this comment");
    }
    session.startTransaction();
    const deleted = await this.commentRepo.deleteDocument(
      { _id: commentId },
      { session }
    );
    await this.commentRepo.deleteDocument({ parentId: commentId }, { session });
    await session.commitTransaction();
    session.endSession();
    if (comment.attachment) {
      await this.s3Client.deleteFile(comment.attachment);
    }
    return res
      .status(200)
      .json(SuccessResponse("comment deleted", 200, { deleted }));
  };
}

export default new Comment_services();
