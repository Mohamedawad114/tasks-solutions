import { Request, Response } from "express";
import { user } from "../../DB/models/User.model";
import { BadRequestException, conflictException, notFoundException } from "../../utils/error";
import { ConfirmOTPDTO, EmailDTO, LoginDTO, RegisterDTO } from "./User.dto";
import bcrypt from 'bcrypt'
import { createAndSendOTP } from "../../utils/Send-Email";
import { generateTokens } from "../../utils/generateTokens";
import redis from "../../utils/redis";



class userServices {
    constructor(){}
    async register(req:Request,res:Response){
        const registerDTO:RegisterDTO=req.body
        const userExisted=await user.findOne({email:registerDTO.email})
        if(userExisted) throw new conflictException(`email is already existed`)
    const hashedPassword = await bcrypt.hash(registerDTO.password, 10);
    const newUser = await user.create({
      ...registerDTO,
      password: hashedPassword,
      role: registerDTO.role || "user",
      isVerified: false,
    });
    await createAndSendOTP(newUser.email);
    res.status(201).json({
      message: "User registered. Please check your email for OTP confirmation.",
      userId: newUser._id,
    });
    }

 async confrim_email (req:Request, res:Response) {
  const confirmOTP:ConfirmOTPDTO = req.body;
  const User = await user.findOne({ email: confirmOTP.email, isVerified: false });
  if (!User)
    throw new BadRequestException(`email is already confirmed or not found`);
  if (!confirmOTP.OTP) throw new BadRequestException(`OTP required`);
  const savedOTP = await redis.get(`otp_${confirmOTP.email}`);
  if (!savedOTP) {
    throw new BadRequestException(`expire OTP`);
  }
  const isMAtch = await bcrypt.compare(confirmOTP.OTP, savedOTP);
  if (!isMAtch) throw new BadRequestException(`invalid OTP`);
  User.isVerified = true;
  await redis.del(`otp_${confirmOTP.email}`);
  await User.save();
  return res.status(200).json({ message: `email is confirmed ` });
};

async resendOTP (req:Request, res:Response) {
  const emailDTO:EmailDTO = {email:req.query.email as string};
  const User = await user.findOne({ email: emailDTO.email, isVerified: false });
  if (!User) throw new BadRequestException(`email not found or confimed`);
  await createAndSendOTP(User.email);
  return res.status(200).send(`OTP sent`);
};

    async login(req:Request,res:Response){
        const loginDTO:LoginDTO=req.body
        const checkUser=await user.findOne({email:loginDTO.email})
        if(!checkUser) throw new notFoundException(`email not found`)
            const isMatch=await bcrypt.compare(loginDTO.password,checkUser.password)
        if(!isMatch)throw new BadRequestException(`Invalid Password`) 
            if (!checkUser.isVerified) throw new BadRequestException("Please verify your email before login");
            const {accessToken,refreshToken}=await generateTokens(checkUser._id,checkUser.role)
    res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
        res.status(200).json({message:`login successfully`,accessToken})
    }
}



export default new userServices()