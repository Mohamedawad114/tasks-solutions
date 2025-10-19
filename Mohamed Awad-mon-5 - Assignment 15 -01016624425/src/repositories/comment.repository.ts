import { IComment } from "../common";
import { BaseRepository } from "./Base.repository";
import { Model } from "mongoose";


export class commentRepo extends BaseRepository<IComment> {
    constructor(protected CommentModel: Model<IComment>) {
        super(CommentModel)
    }
    async updateComment(comment: IComment): Promise<IComment> {
        return await comment.save();
    }
}