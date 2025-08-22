import mongoose from "mongoose";



const tokenSchema=new mongoose.Schema({
    refreshToken:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    expireAt:{
        type:Date,
        required:true
    }},{
        titimestamps:true,
    }
)

 const Token=mongoose.model("Token",tokenSchema)
 export default Token