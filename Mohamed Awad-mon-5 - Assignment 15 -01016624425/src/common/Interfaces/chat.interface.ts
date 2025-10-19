import mongoose from "mongoose";
import { conversation } from "../Enums/conversation.Enum";

export interface IConversation {
  _id?: mongoose.Types.ObjectId;
  type?: string;
  members: string[] | mongoose.Types.ObjectId[];
  name?: string;
}
export interface IMessage {
  _id?: mongoose.Types.ObjectId;
  text?: string;
  senderId: string | mongoose.Types.ObjectId;
  name: string;
  conversationId: string | mongoose.Types.ObjectId;
  attachment?: string;
}

export interface IGroup{
  name: string,
  memberIds: string[] ,
  type?:conversation
}