import express from 'express'
import * as c_servies from './servies/comment.servies.js'
const controllor=express.Router()


controllor.post('/addcomment',c_servies.insertComment)
controllor.put('/update/:id',c_servies.updatecomemnt)
controllor.get('/getcomment',c_servies.get_comment)
controllor.get('/search',c_servies.getspecficcomment)
controllor.get('/newest/:id',c_servies.newestcomments)
controllor.get('/details/:id',c_servies.commentdetail)





export default controllor