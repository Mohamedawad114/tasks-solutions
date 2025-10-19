import bcrypt from 'bcrypt'
import dotenv from "dotenv";
dotenv.config({ path: "./dev.env" });

export const generatehHash=(text:string,salt:number=parseInt(process.env.SALT as  string)):string=>{
    return bcrypt.hashSync(text, salt)
}


export const compareHash=async(text:string,hashText:string)=>{
    return await bcrypt.compare(text, hashText);
} 