import { compare, hashSync } from 'bcrypt'


export const generatehHash=(text:string,salt:number=parseInt(process.env.SALT as  string)):string=>{
    return hashSync(text, salt)
}


export const compareHash=async(text:string,hashText:string)=>{
    return await compare(text,hashText)
} 