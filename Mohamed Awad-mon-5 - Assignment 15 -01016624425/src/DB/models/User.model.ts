import mongoose from "mongoose";
import { Gender, Provider, Sys_Role,IUser } from "../../common";
import { generatehHash } from "../../utils";


const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      minlength: [4, "user_name length must great than 4 "],
      required: true,
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
    },
    phone: {
      type: String,
      required: function (this: IUser) {
        return this.provider == Provider.local;
      },
    },
    role: {
      type: String,
      enum: Sys_Role,
      default: Sys_Role.user,
      select:false
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.provider == Provider.local;
      },
      select: false,
    },
    subId: {
      type: Number,
      select: false,
    },
    provider: {
      type: String,
      required: true,
      enum: Provider,
      default: Provider.local,
      select: false,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    coverPicture: {
      type: String,
      default: null,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
      select:false
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      enum: Gender,
    },
    blockFriends:[ {
      type: String,
      default: null,
    }],
    isFreezed: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password =generatehHash(this.password as string);
  }
})

const UserModel = mongoose.model<IUser>("User", UserSchema);

export  {UserModel};
