import { Request, Response } from "express";
import mongoose from "mongoose";
import { commentRepo, Post_Repo, UserRepo } from "../../../repositories";
import { CommentModel, postModel, UserModel } from "../../../DB/models";
import { redis, s3_services } from "../../../utils";
import { SuccessResponse } from "../../../utils";
import { notFoundException } from "../../../common/Errors";

class AdminServices {
  private userRepo: UserRepo = new UserRepo(UserModel);
  private postRepo: Post_Repo = new Post_Repo(postModel);
  private commentRepo: commentRepo = new commentRepo(CommentModel);
  private s3Client = new s3_services();

  dashboard = async (req: Request, res: Response) => {
    const result = await Promise.allSettled([
      this.userRepo.findDocuments({}),
      this.postRepo.findDocuments({}),
    ]);
    return res
      .status(200)
      .json(SuccessResponse("users and posts", 200, { result }));
  };
  deleteUserAccount = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const session = await mongoose.startSession();
    req.session = session;
    session.startTransaction();
    const deleted = await this.userRepo.findByIdAndDeleteDocument(userId, {
      session,
    });
    await this.postRepo.deleteManyDocuments({ userId }, { session });
    await this.commentRepo.deleteManyDocuments({ userId }, { session });
    await session.commitTransaction();
    session.endSession();
    await this.s3Client.deleteListderictory(userId.toString());
    return res
      .status(200)
      .json(SuccessResponse("account deleted", 200, { deleted }));
  };
  strictFreezeUser = async (req: Request, res: Response) => {
    const userId = req.params.userId as unknown as mongoose.Types.ObjectId;
    const user = await this.userRepo.findByIdDocument(userId);
    if (!user) throw new notFoundException("user not found");
    user.isFreezed = true;
    const updatedUser = await this.userRepo.updateUser(user);
    return res
      .status(200)
      .json(SuccessResponse("user freezed", 200, { updatedUser }));
  };

  FreezeUser_peroid = async (req: Request, res: Response) => {
    const userId = req.params.userId as unknown as mongoose.Types.ObjectId;
    const user = await this.userRepo.findByIdDocument(userId);
    if (!user) throw new notFoundException("user not found");
    await redis.set(`freeze:${userId}`, "true", "EX", 60 * 60 * 24 * 7);
    return res.status(200).json(SuccessResponse("user freezed for week", 200));
  };
}
export default new AdminServices();
