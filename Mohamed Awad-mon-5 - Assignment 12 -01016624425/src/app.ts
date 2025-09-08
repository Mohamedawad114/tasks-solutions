import express, { NextFunction, Request, Response } from 'express'
import db_connection from './DB/db.connection';
import user_router from './modules/User/users.controllors'
import cookieParser from "cookie-parser";
import env from 'dotenv'
env.config()

const app=express();

app.use(express.json())
app.use(cookieParser())

app.use("/users",user_router)


 db_connection()


app.use("/",(req,res,next)=>{
    res.status(404).json("page not found")
})



app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
  res
    .status(err.cause || 500)
    .json({ message: `something broke`, err: err.message, stack: err.stack });
});


export default app