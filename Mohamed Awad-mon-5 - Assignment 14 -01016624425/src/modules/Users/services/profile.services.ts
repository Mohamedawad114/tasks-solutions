import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  compareHash,
  createAndSendOTP_password,
  decrypt,
  encrypt,
  generatehHash,
  redis,
  s3_services,
  SuccessResponse,
} from "../../../utils";
import { IUser } from "../../../common";
import {
  ResetPasswordDTO,
  updatePasswordDTO,
  updateUserDTO,
} from "../user.dto";
import { BadRequestException, conflictException } from "../../../common/Errors";
import { UserRepo } from "../../../repositories";
import { UserModel } from "../../../DB/models";

export class ProfileServices {
  private userRep: UserRepo = new UserRepo(UserModel);
  private s3Client = new s3_services();
  async profile(req: Request, res: Response) {
    const user = req.user as IUser;
    if (user.phone) {
      user.phone = decrypt(user.phone);
    }
    return res.status(200).json({ profile: user });
  }

  async Updateuser(req: Request, res: Response) {
    const user = req.user;
    const updateUser: updateUserDTO = req.body;
    if (updateUser.email) {
      const valid_email = await this.userRep.findOneDocument({
        email: updateUser.email,
      });
      if (valid_email) throw new conflictException(`email already existed`);
    }
    if (updateUser.phone) {
      updateUser.phone = encrypt(updateUser.phone);
    }
    const updatedUser = await this.userRep.findAndUpdateDocument(
      user?._id as mongoose.Types.ObjectId,
      updateUser
    );
    if (!updatedUser) throw new BadRequestException(`something wrong`);
    return res.json(SuccessResponse("user Updated", 200, { updatedUser }));
  }

  async updatePassword(req: Request, res: Response) {
    if (!req.user) throw new BadRequestException("User not found");
    const user = req.user;
    const updatePassword: updatePasswordDTO = req.body;
    if (updatePassword.newPassword !== updatePassword.confirmPassword) {
      throw new BadRequestException(
        "confirmPassword must be similar newPassword"
      );
    }
    const isMatch = await compareHash(
      updatePassword.oldPassword,
      user?.password as string
    );
    if (!isMatch) throw new BadRequestException(`invalid oldPasword`);
    user.password = generatehHash(updatePassword.newPassword);
    await this.userRep.updateUser(user);
    const keys = await redis.keys(`refreshToken:${user._id as string}:*`);
    if (keys.length) await redis.del(...keys);
    return res.json(SuccessResponse(`password updated`, 200));
  }

  async resetPasswordreq(req: Request, res: Response) {
    const user = req.user;
    await createAndSendOTP_password(user?.email as string);
    return res.json(SuccessResponse(`OTP is sent`, 200));
  }

  async resendOTP_reset(req: Request, res: Response) {
    const user = req.user;
    await createAndSendOTP_password(user?.email as string);
    return res.json(SuccessResponse(`OTP sent`, 200));
  }
  async resetPasswordconfrim(req: Request, res: Response) {
    if (!req.user) throw new BadRequestException("User not found");
    const user = req.user;
    const resetPassword: ResetPasswordDTO = req.body;
    if (
      !resetPassword.OTP ||
      !resetPassword.newPassword ||
      !resetPassword.confirmPassword
    )
      throw new BadRequestException(`Both OTP and new passwords are required`);
    const savedOTP = await redis.get(`otp_reset:${user.email}`);
    if (!savedOTP) throw new BadRequestException(`expire OTP.`);
    const isMatch = await compareHash(resetPassword.OTP, savedOTP);
    if (!isMatch) throw new BadRequestException(`Invalid OTP`);
    const hashpassword = generatehHash(resetPassword.confirmPassword);
    user.password = hashpassword;
    await redis.del(`otp_reset:${user.email}`);
    await this.userRep.updateUser(user);
    const keys = await redis.keys(`refreshToken:${user._id}:*`);
    if (keys.length) await redis.del(...keys);
    return res.json(SuccessResponse(`password updated`, 200));
  }

  uploadProfile_pic = async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestException("User not found");
    const user = req.user;
    const file = req.file as Express.Multer.File;
    if (!file) throw new BadRequestException("file is required");
    const { Key} = await this.s3Client.upload_file(
      file,
      `${user?._id}/profile`
    );
    user.profilePicture = Key;
    await this.userRep.updateUser(user);
    return res.status(200).json(SuccessResponse("photo uploaded", 200, { Key }));
  };
  renew_SignedUrl = async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestException("User not found");
    const user = req.user;
    const { key, keyType } = req.body as { key: string; keyType: keyof IUser };
    if (!key || !keyType)
      throw new BadRequestException("key and keyType required");
    if (user[keyType] !== key) throw new BadRequestException("invalid key");
    const url = await this.s3Client.getSignedUrl(key);
    return res.status(200).json(SuccessResponse("photo url", 200, { url }));
  };
  deleteAccount = async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestException("User not found");
    const user = req.user;
    const deleted = await this.userRep.findAndDeleteDocument(
      user._id as mongoose.Types.ObjectId
    );
    const userKeys = [user.profilePicture, user.coverPictures].filter(
      (k): k is string => Boolean(k)
    );
    await this.s3Client.deleteBUlk(userKeys);
    return res
      .status(200)
      .json(SuccessResponse("account deleted", 200, { deleted }));
  };
}

export default new ProfileServices();
