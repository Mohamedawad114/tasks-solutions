import mongoose from "mongoose";

const userschema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [/^[a-zA-Z0-9-.+#]+@gmail.com$/, "invalid Email"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isConfirmed:{
      type:Boolean,
      default:false
    },
    otps:{
      confirmation:{type:String,default:null}
    }
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", userschema);
export default user;
