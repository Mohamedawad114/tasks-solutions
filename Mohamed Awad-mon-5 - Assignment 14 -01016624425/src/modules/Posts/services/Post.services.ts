import { Request, Response } from "express";
import mongoose from "mongoose";
import { Post_Repo } from "../../../repositories";
import { postModel } from "../../../DB/models";
import { s3_services, SuccessResponse } from "../../../utils";
import { BadRequestException, notFoundException } from "../../../common/Errors";

class Post_services {
  private postRepo: Post_Repo = new Post_Repo(postModel);
  private s3Client = new s3_services();

  getPost = async (req: Request, res: Response): Promise<Response> => {
    const postId = req.params.id as unknown as mongoose.Types.ObjectId;
    const post = await this.postRepo.findOneDocument(
      { id: postId },
      { Reactions: 0 },
      {
        populate: {
          path: "userId",
          select: "userName",
        },
      }
    );
    if (!post) throw new notFoundException("post not found");
    return res.status(200).json(SuccessResponse("post found", 200, { post }));
  };
  createPost = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id as mongoose.Types.ObjectId;
    const {content} = req.body;
    const files = req.files as Express.Multer.File[];
    let uploadResult: string[] = [];
    if (files && files.length > 0) {
      uploadResult = await this.s3Client.upload_files(files, `${userId}/posts`);
    }
    const created = await this.postRepo.createDocument({
      userId: userId,
      content,
      attachments: uploadResult,
    });
    return res
      .status(201)
      .json(SuccessResponse("post shared", 201, { created }));
  };
  updatePost = async (req: Request, res: Response): Promise<Response> => {
    const postId = req.params.id as unknown as mongoose.Types.ObjectId;
    const content: string = req.body;
    const postUpdated = await this.postRepo.findAndUpdateDocument(postId, {
      content: content,
    });
    return res
      .status(200)
      .json(SuccessResponse("post updated", 200, { postUpdated }));
  };
  deletePost = async (req: Request, res: Response): Promise<Response> => {
    const postId = req.params.id as unknown as mongoose.Types.ObjectId;
    const PostDeleted = await this.postRepo.findAndDeleteDocument(postId);
    if (PostDeleted) {
      return res
        .status(200)
        .json(SuccessResponse("post deleted", 200, { PostDeleted }));
    }
    throw new BadRequestException("something worng");
  };
  Reaction = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const postId = req.params.id as unknown as mongoose.Types.ObjectId;
    const { reaction } = req.body;
  
    const post = await this.postRepo.findByIdDocument(postId);
    if (!post) throw new notFoundException("post not found");
    const existingReaction = post.Reactions?.find(
      (react: any) => react.userId.toString() === userId.toString()
    );
    if (existingReaction) {
      if (existingReaction.Reaction == reaction) {
        post.Reactions = post.Reactions?.filter(
          (react) => react.userId.toString() !== userId.toString()
        );
        post.reactionCount = Number(post.reactionCount) - 1;
      } else {
        existingReaction.Reaction = reaction;
      }
    } else {
      post.Reactions?.push({ userId, Reaction: reaction });
      post.reactionCount = Number(post.reactionCount) + 1;
    }
    await this.postRepo.updatePost(post);
    return res.sendStatus(204);
  };
  getReactionsUsers = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const postId = req.params.id as unknown as mongoose.Types.ObjectId;
    const post = await this.postRepo.findByIdDocument(postId);
    if (!post) throw new notFoundException("post not found");
    const reactions = post.Reactions;
    if (reactions?.length) {
      return res
        .status(200)
        .json(SuccessResponse("reactions found", 200, { reactions }));
    }
    return res.status(200).json(SuccessResponse("no reactions yet", 200));
  };
}
export default new Post_services();
