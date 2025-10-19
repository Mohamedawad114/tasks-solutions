import { NextFunction, Request, Response } from "express";
import { postModel } from "../DB/models";
import { notAuthorizedException, notFoundException } from "../common/Errors";
import mongoose from "mongoose";


async function IsOwner(req:Request, res:Response, next:NextFunction) {
    const userId = req.user?._id as mongoose.Types.ObjectId;
    const postId = req.params.postId
    const post = await postModel.findById(postId)
    if (!post) throw new notFoundException("post not found")
    if (post.userId.toString() !== userId.toString()) {
        throw new notAuthorizedException("you 're not authorized")
    }
    next();
}

export { IsOwner}