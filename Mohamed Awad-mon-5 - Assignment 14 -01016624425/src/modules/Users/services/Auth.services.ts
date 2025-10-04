import { Request, Response } from "express";
import { confirmEmailDTO, loginDTO, SignUpDTO } from "../user.dto";
import { UserRepo } from "../../../repositories";
import { UserModel } from "../../../DB/models";
import {
  BadRequestException,
  conflictException,
  notFoundException,
} from "../../../common/Errors";
import {
  compareHash,
  createAndSendOTP,
  encrypt,
  generatehHash,
  redis,
} from "../../../utils";
import { generateTokens } from "../../../utils/Tokens/generateTokens";
import { generateAccessToken } from "../../../utils/Tokens/generateAccessToken";
import jwt from "jsonwebtoken";

class AuthServices {
  private userRepo: UserRepo = new UserRepo(UserModel);
  SignUp = async (req: Request, res: Response) => {
    const signUpDTO: SignUpDTO = req.body;
    const checkEmail = await this.userRepo.findOneDocument({
      email: signUpDTO.email,
    });
    if (checkEmail) throw new conflictException(`email is already exist`, {});
    const hashPassword = generatehHash(signUpDTO.password);
    const created = await this.userRepo.createDocument({
      ...signUpDTO,
      password: hashPassword,
      phone: encrypt(signUpDTO.phone),
    });
    await createAndSendOTP(signUpDTO.email);
    return res.status(201).json({ message: `user created`, created });
  };
  confrim_email = async (req: Request, res: Response) => {
    const confirmDTO: confirmEmailDTO = req.body;
    const User = await this.userRepo.findOneDocument({
      email: confirmDTO.email,
    });
    if (!User) throw new notFoundException(`user not found`, {});
    if (!confirmDTO.OTP) throw new BadRequestException(`OTP required`, {});
    const savedOTP = await redis.get(`otp_${confirmDTO.email}`);
    if (!savedOTP) {
      throw new BadRequestException(`expire OTP`, {});
    }
    const isMAtch = compareHash(confirmDTO.OTP, savedOTP);
    if (!isMAtch) throw new BadRequestException(`invalid OTP`, {});
    User.isConfirmed = true;
    await redis.del(`otp_${confirmDTO.email}`);
    await User.save();
    return res.status(200).json({ message: `email is confirmed ` });
  };
  resendOTP = async (req: Request, res: Response) => {
    const email: string = req.query.email as string;
    const User = await this.userRepo.findOneDocument({
      email: email,
      isConfirmed: false,
    });
    if (!User) throw new notFoundException(`email not found or confimed`, {});
    await createAndSendOTP(User.email);
    return res.status(200).send(`OTP sent`);
  };
  loginuser = async (req: Request, res: Response) => {
    const logindto: loginDTO = req.body;
    const user = await this.userRepo.findOneDocument({ email: logindto.email });
    if (!user) throw new notFoundException(`email not found`, {});
    if (!user.isConfirmed)
      throw new BadRequestException(
        `email not verified please verify email first`,
        {}
      );
    const passMatch = await compareHash(
      logindto.password,
      user.password as string
    );
    if (!passMatch)
      throw new BadRequestException(`invalid Password or email`, {});
    const accessToken = await generateTokens({
      res: res,
      id: user._id as string,
      role: user.role as string,
    });
    return res.status(200).json({
      message: `login seccussfully`,
      accessToken,
    });
  };
  refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err: any, decoded: any) => {
        if (err) {
          console.log(err);
          return res.sendStatus(403);
        }
        const isexisted = await redis.get(
          `refreshToken:${decoded.id}:${decoded.jti}`
        );
        if (!isexisted) return res.sendStatus(403);
        const accessToken: string = generateAccessToken({
          id: decoded.id,
          role: decoded.role,
        });
        return res.json({ accessToken });
      }
    );
    return;
  };
}

export default new AuthServices();
