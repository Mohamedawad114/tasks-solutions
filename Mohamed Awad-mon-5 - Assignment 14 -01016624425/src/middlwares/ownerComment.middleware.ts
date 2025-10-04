import { NextFunction, Request, Response } from "express";
import { CommentModel } from "../DB/models";
import { notAuthorizedException, notFoundException } from "../common/Errors";
import mongoose from "mongoose";


async function IsOwnerComment(req:Request, res:Response, next:NextFunction) {
    const userId = req.user?._id as mongoose.Types.ObjectId;
    const commentId = req.params.commentId
    const comment = await CommentModel.findById(commentId)
    if (!comment) throw new notFoundException("comment not found")
    if (comment.userId.toString() !== userId.toString()) {
        throw new notAuthorizedException("you 're not authorized")
    }
    next();
}

export { IsOwnerComment}