import { Request, Response } from "express";
import mongoose from "mongoose";
import { postModel } from "../../../DB/models";
import { Post_Repo } from "../../../repositories";
import { notFoundException } from "../../../common/Errors";

class AdminPostServices {
  private postRepo: Post_Repo = new Post_Repo(postModel);

  deletepost = async (req: Request, res: Response) => {
    const postId = req.params.postId as unknown as mongoose.Types.ObjectId;
    const deletedPost = await this.postRepo.findByIdAndDeleteDocument(postId);
    if (deletedPost)
      throw new notFoundException("post not found or already deleted");
    return res
      .status(200)
      .json({ message: "post deleted successfully", deletedPost });
  };
}

export default new AdminPostServices();
