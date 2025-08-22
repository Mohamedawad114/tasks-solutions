import mongoose from "mongoose";



const userSchema=new mongoose.Schema({
 Name:{
        type:String,
        required:true,
        minLength:4,
        maxLength:20,
        trim:true
 },        
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        minLength:[6,'password length should be greater 6'],
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isconfirmed:{
        type:Boolean,
        default:false
    },
    image:{
        url:{type:String,default:""},
        public_id:{type:String,default:""},
    }
},{timestamps:true,
})



const user=mongoose.model("user",userSchema)
export default user;
