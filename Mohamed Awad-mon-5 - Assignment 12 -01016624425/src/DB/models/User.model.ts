import mongoose, {  Schema } from "mongoose";
import { GENDER_USER, SYS_role } from "../../utils/Enums/user.enums";


export interface User{
    Name:string,
    email:string,
    phone?:string,
    age:number,
    password:string,
    gender:GENDER_USER,
    role:SYS_role,
    isVerified?:Boolean,
} 


const userSchema=new Schema <User>({
     Name:{
        type:String,
        minlength:4,
        required:true},
 email:{ type:String,
        required:true,
        unique:true,
        match:[/^[a-zA-Z0-9-.+#]+@gmail.com$/, "invalid Email"],
        trim:true,
        lowercase:true
    },
phone:{
    type:String,
},
 age:{type:Number,
    min:16,
    required:true
 },
 password:{
    type:String,
    minlength:6,
    required:true
 },
 gender:{
    type:String,
    enum:GENDER_USER,
    required:true,
 },
 role:{
    type:String,
    enum:SYS_role,
    required:true,
    default:SYS_role.user
 },
 isVerified: {
  type: Boolean,
  default: false,
}

},{timestamps:true})

export const user=mongoose.model<User>("user",userSchema)