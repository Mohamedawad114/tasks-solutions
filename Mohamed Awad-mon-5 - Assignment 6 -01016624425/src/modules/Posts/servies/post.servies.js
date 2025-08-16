import asyncHandler from 'express-async-handler';
import post from '../../../DB/models/posts.model.js';
import user from '../../../DB/models/users.model.js'
import comment from '../../../DB/models/comments.model.js';
import { Sequelize } from 'sequelize';


export const insertPost=asyncHandler(
async(req,res)=>{
const {title,content,userId}=req.body
if((!title || !content )&&!userId)return res.status(400).json({message:`content or tittle is required`})
    if(! await user.findByPk(userId))return res.status(400).send("userId not found")
const newpost =new post({title,content,userId})
const share_Post=await newpost.save()
return res.status(201).json({message:`Post created successfully`})
return res.status(500).json({message:'somethig wrong'})
}
)
export const deletepost=asyncHandler(
    async(req,res)=>{
        const post_id=parseInt(req.params.postid)
        const user_id=parseInt(req.params.userid)
        if(!post_id)return res.status(400).send(`Post ID is required`)
        if(!user_id)return res.status(400).send(`user ID is required`)
    const valid_id=await post.findOne({where:{id:post_id}})
if(!valid_id)return res.status(400).json({message:`postId not found`})
    if(valid_id.userId!==user_id)return res.status(403).json({message:`you are not authorized to delete this post`})
const delete_post=await post.destroy({where:{id:post_id}})
if(delete_post)return res.status(200).json({message:`post is deleted successfully`})
return res.status(500).send(`something wrong`)
    }
)
export const postdetails=asyncHandler(
    async(req,res)=>{
     const posts=   await post.findAll({
            attributes:["id","title"],
            include:[
                {
                model:user,
                attributes:["id","name"]
            },
            {
                model:comment,
                attributes:["id","comment"],
            },
        ],
    group:["post.id"]
})
        return res.status(200).json(posts)
    }
)
export const c_count=
    async(req,res)=>{
        try{
     const posts=   await post.findAll({
            attributes:["id","title",
     [Sequelize.fn('COUNT', Sequelize.col('comments.id')), 'commentCount']
    ],
    include: [
      {
        model: comment,
        attributes: [],
      }
    ],
    group: ['post.id']
  });

        return res.status(200).json(posts)
    }
catch(err){
    res.send(`wrong ${err}`)
}}