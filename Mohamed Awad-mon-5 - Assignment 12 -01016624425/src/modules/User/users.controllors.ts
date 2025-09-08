import UserServices from "./User.services";
import { Router } from "express";
const router=Router()


router.post("/signup",(req,res)=>UserServices.register(req,res))
router.post("/confirmEmail",(req,res)=>UserServices.confrim_email(req,res))
router.get("/resendOTP",(req,res)=>UserServices.resendOTP(req,res))
router.post("/login",(req,res)=>UserServices.login(req,res))



export default router