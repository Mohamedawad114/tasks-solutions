import mongoose from "mongoose";
import { Gender, Provider, Sys_Role,IUser } from "../../common";


const UserSchema=new mongoose.Schema<IUser>({
username: {
      type: String,
      minlength: [4, "user_name length must great than 4 "],
      required:true
      },
    DOB: {
      type: Date,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9-_.+#]+@gmail.com$/, "invalid Email"],
    },
    phone: {
      type: String,
      required: function (this:IUser) {
        return this.provider == Provider.local
      },
    },
    role: { 
        type: String,
         enum: Sys_Role, 
         default:Sys_Role.user },
    password: {
      type: String,
      required: function (this:IUser) {
        return this.provider == Provider.local;
      },
    },
    subId: {
      type: Number,
    },
    provider: {
      type: String,
      required: true,
      enum: Provider,
      default: Provider.local,
    },
    profilePicture: {
       type: String, default: null ,
    },
    coverPictures: {
      type: String, default: null ,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    gender:{
        type:String,
        enum:Gender,
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export  {UserModel};
