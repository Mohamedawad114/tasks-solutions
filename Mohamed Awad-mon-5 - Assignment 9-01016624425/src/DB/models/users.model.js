import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from 'bcrypt'
dotenv.config();



const userSchema=new mongoose.Schema({
 firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:20,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:20,
        trim:true,        
    },
    phone:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        match:[/^[a-zA-Z0-9-.+_#]+@gmail.com$/,'invalid Email'],
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        minLength:[6,'password length should be greater 6'],
        required:true,
    },
        age:{
            type:Number,
            min:16,
            max:100,
            required:true
    },
    gender:{
        type:String,
        enum:["male","female"],
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    otps:{
        confirmation:String,
        reset:String
    },
    isconfirmed:{
        type:Boolean,
        default:false
    },
    
},{timestamps:true,
    toJSON:{
        virtuals:true
    },
})
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT));
  next();
});
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const user=mongoose.model("user",userSchema)
export default user;
