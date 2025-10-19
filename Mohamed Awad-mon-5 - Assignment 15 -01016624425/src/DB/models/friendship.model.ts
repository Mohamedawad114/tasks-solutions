import mongoose from "mongoose";
import {  friendshipEnum, IFriendship } from "../../common";



const friendshipSchema = new mongoose.Schema<IFriendship>({
    requestFromId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    requestToId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    status: {
        type: String,
        enum: friendshipEnum,
        default:friendshipEnum.pending
    }
})

const friendshipModel = mongoose.model<IFriendship>("Friendship", friendshipSchema)
export {friendshipModel}