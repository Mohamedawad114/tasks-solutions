import crypto from 'node:crypto'
import dotenv from "dotenv";
dotenv.config({ path: "./dev.env" });

const key=process.env.CRYPTO_KEY as string
const IV=crypto.randomBytes(16)
export const encrypt=(text:string)=>{
    const buffer=Buffer.from(key)
    const cipher=crypto.createCipheriv("aes-256-cbc",buffer,IV)
    let encrypted:string=cipher.update(text,'utf-8','hex')
    encrypted +=cipher.final('hex')
    return IV.toString('hex')+":"+encrypted
}


export const decrypt=(textencrypt:string)=>{
const [Ivhex,encrypted]=textencrypt.split(":")
const Iv=Buffer.from(Ivhex,'hex')
    const decipher=crypto.createDecipheriv("aes-256-cbc",key,Iv)
    let decrypted=decipher.update(encrypted,'hex',"utf-8")
    decrypted+=decipher.final('utf-8')
    return decrypted
}

