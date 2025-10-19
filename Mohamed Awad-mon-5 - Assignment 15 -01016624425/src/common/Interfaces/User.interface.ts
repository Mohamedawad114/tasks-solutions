import mongoose, { Document } from "mongoose"
import { friendshipEnum, Gender, Provider, Sys_Role } from "../Enums/User.Enum"

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  phone?: string;
  DOB: Date;
  gender: Gender;
  role?: Sys_Role;
  isDeactivated?: boolean;
  profilePicture?: string ;
  coverPicture?: string;
  provider?: Provider;
  isPublic?: boolean;
  subId?: number;
  isConfirmed?: boolean;
  isFreezed?: boolean
  blockFriends?:mongoose.Types.ObjectId[]
}
export interface IEmailargument{
  to: string,
  subject: string,
  cc?: string,
  html:string
}

export interface IFriendship extends Document {
  requestFromId: mongoose.Types.ObjectId|string
  requestToId: mongoose.Types.ObjectId | string
  status: friendshipEnum
}

declare module "express" {
  interface Request {
    user?: IUser,
    session?: any
  }
}