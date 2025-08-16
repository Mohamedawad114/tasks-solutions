import comment from '../../../DB/models/comments.model.js'
import user from '../../../DB/models/users.model.js'
import post from '../../../DB/models/posts.model.js'
import asyncHandler from'express-async-handler'
import { Op, where } from 'sequelize'

export const insertComment=asyncHandler(
    async(req,res)=>{
        const {content,userId,postId}=req.body
        const foundUser = await user.findByPk(userId);
        const foundPost = await post.findByPk(postId);
        if(!content || !userId ||! postId) return res.status(400).json({message:`comment or userid or postid required`})
            if(!foundPost ||!foundUser)return res.status(403).send(`user or post not found`)
            const insert_c=await comment.create(req.body)
   if(insert_c)return res.status(201).json({message:`comment created`})
    return res.status(500).send(`failed create comment`)
    }
)
export const updatecomemnt=asyncHandler(
    async(req,res)=>{
        const comment_id=parseInt(req.params.id);
        const {content,userId}=req.body
        const valid_comment=await comment.findOne({where:{id:comment_id}})
        if(!valid_comment) return res.status(404).json({message:`comment not found`})
                    if(!content|| !userId) return res.status(400).send(`content or userId required`)
        if(valid_comment.userId !== userId) return res.status(403).json({message:`you are not authorized to update this comment`})
            valid_comment.content=content
        const update=await valid_comment.save();
        if(update) return res.status(200).json({message:`comment updated`})
            return res.status(500).json({mesaage:`something wrong`})
    }
)
export const get_comment=asyncHandler(
    async(req,res)=>{
        const {content,userId,postId}=req.body
        if (!postId || !userId || !content) return res.status(400).json({ message: 'postId, userId, and content are required' })
        const [exist,create]= await comment.findOrCreate({where:{content,userId,postId}})
    if(exist) return res.status(200).json({exist})
    if(create) return res.status(201).json({create})
    }
)
export const getspecficcomment=asyncHandler(
    async(req,res)=>{
        const {word}=req.query
         if (!word) return res.status(400).json({ message: 'Search word is required' });
        const results= await comment.findAndCountAll({where:{content:{[Op.like]:`%${word}%`}}})
        console.log(results)
        if(results.count>0) return res.status(200).json({results})
            return res.status(403).json({message: "no comments found"}) 
    }
)
export const newestcomments=asyncHandler(
    async(req,res)=>{
        const postId=parseInt(req.params.id)
    if(!postId) return res.status(400).send(`post id is required`)
        const result= await comment.findAll(
    {where:{postId:postId}
    ,order:[["id","DESC"]],
    limit:3
})
    if(result) return res.status(200).json({result})
        return res.status(403).json({message: `no comments found`})
    }
)
export const commentdetail=asyncHandler(
    async(req,res)=>{
        const comment_id=req.params.id
        if(!comment_id) return res.status(400).send(`comment id required`)
            const comment_details=await comment.findOne({where:{id:comment_id}})
        if(!comment_details) return res.status(403).json({mesaage:`no comments found`})
            const user_details= await user.findOne({where:{id:comment_details.userId}})
            const post_details= await post.findOne({where:{id:comment_details.postId}})
            console.log(comment_details)
            return res.json({comment_details,user_details,post_details})
    }
)