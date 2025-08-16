import express from 'express'
import* as  postsservies from './servies/post.servies.js';

const controllor=express.Router()




controllor.post('/addpost',postsservies.insertPost)
controllor.delete('/deletepost/:postid/:userid',postsservies.deletepost)
controllor.get('/details',postsservies.postdetails)
controllor.get('/comments',postsservies.c_count)




export default controllor 