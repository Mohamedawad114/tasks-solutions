import asyncHandler from 'express-async-handler';
import user from '../../../DB/models/users.model.js';
import bcrypt from 'bcrypt'
import jwt from'jsonwebtoken'
const key =process.env.KEY

export const adduser=asyncHandler(
   async (req,res)=>{
const {name,email,password,role}=req.body
const salt =await bcrypt.genSalt(10)
const valid_email=await user.findOne({where:{email}})
if(!valid_email){
    if(password.length<=6){
        return res.status(400).json({message:'password must be greater than 6'})
    }
    const hash_password= await bcrypt.hash(password,salt)
    const token= jwt.sign({name:name,email:email},key)
const insert_user=await user.create({name,email,password:hash_password,role})
return res.status(201).json({message:`user added successfully\n token: ${token}`})}
return res.status(409).json({message:'Email already exists.'})
    })
export const updateuser=asyncHandler(
    async(req,res)=>{
        const {name,email,password,role}=req.body
        const salt =await bcrypt.genSalt(10)
        const id=parseInt(req.params.id)
        if(!id) return res.status(400).send('ID is required')
            const id_user=await user.findByPk(id)
        if(!id_user) return res.status(400).send(`User Id not found`)
        if(name) id_user.name=name;
        if(password){
            const hash_password=await bcrypt.hash(password,salt)
            id_user.password=hash_password;}
        if(role) id_user.role=role;
        if(email) id_user.email=email
        await id_user.save({
            validate:false
        }
        )
        return res.status(200).json({message:`user update or created seccussfully`})
    }
)
export const getuser=asyncHandler(
    async(req,res)=>{
        const {email}=req.query;
        if(!email) return res.status(400).send(`Email is required`)
  const valid_email=await user.findOne({where:{email:email}})
   if(!valid_email) return res.status(400).json({message:` user email not found`})
  res.status(200).json({valid_email})
    }
)
export const get_user=asyncHandler(
    async(req,res)=>{
        const userid=parseInt(req.params.id);
        if(!userid) return res.status(400).send(`ID is required`)
  const valid_id=await user.findByPk(userid,{
attributes:['name','email','password','createdAt','updatedAt']})
   if(!valid_id) return res.status(400).json({message:` user email not found`})
  res.status(200).json({valid_id})
    }
)