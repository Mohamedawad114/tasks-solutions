import express from 'express';
import* as userservies from "./servies/users.servies.js";
const controllor=express.Router()


controllor.post('/signup',userservies.adduser)
controllor.put('/update/:id',userservies.updateuser)
controllor.get('/user',userservies.getuser)
controllor.get('/user/:id',userservies.get_user)




export default controllor