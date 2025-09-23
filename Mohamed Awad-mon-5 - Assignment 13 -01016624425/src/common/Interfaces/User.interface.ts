import { Document } from "mongoose"
import { Gender, Provider, Sys_Role } from "../Enums/User.Enum"

export interface IUser extends Document{
 username:string
 email:string
 password?:string
 phone?:string
 DOB:Date
 gender:Gender
 role?:Sys_Role
 isDeactivated?:boolean
 profilePicture?: {
    public_id: string | null;
    url: string | null;
  };
  coverPictures?: {
    public_id: string | null;
    url: string | null;
  };
 provider? :Provider
 isPublic? : boolean
 subId?:number,
 isConfirmed?:boolean
 isDeleted?:boolean
}
export interface IEmailargument{
  to: string,
  subject: string,
  cc?: string,
  html:string
}