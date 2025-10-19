import { Request, Response } from "express";
import mongoose, { FilterQuery } from "mongoose";
import jwt from "jsonwebtoken";
import {
  compareHash,
  createAndSendOTP,
  createAndSendOTP_password,
  decrypt,
  encrypt,
  generatehHash,
  redis,
  s3_services,
  SuccessResponse,
} from "../../../utils";
import {
  conversation,
  friends_Blacklist,
  friendshipEnum,
  IFriendship,
  IGroup,
  IUser,
} from "../../../common";
import {
  ResetPasswordDTO,
  updatePasswordDTO,
  updateUserDTO,
} from "../user.dto";
import {
  BadRequestException,
  conflictException,
  notFoundException,
} from "../../../common/Errors";
import {
  commentRepo,
  conversation_Repo,
  friendshipRepo,
  Post_Repo,
  UserRepo,
} from "../../../repositories";
import { CommentModel, postModel, UserModel } from "../../../DB/models";

export class ProfileServices {
  private userRepo: UserRepo = new UserRepo(UserModel);
  private s3Client = new s3_services();
  private postRepo: Post_Repo = new Post_Repo(postModel);
  private commnetRepo: commentRepo = new commentRepo(CommentModel);
  private friendshipRepo: friendshipRepo = new friendshipRepo();
  private conversationRepo: conversation_Repo = new conversation_Repo();
  profile = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const user = await this.userRepo.findByIdDocument(userId, {
      blockFriends: 0,
    });
    if (!user) throw new BadRequestException(`User not found`);
    if (user.phone) user.phone = decrypt(user.phone);
    return res.status(200).json(SuccessResponse("user profile", 200, { user }));
  };
  Updateuser = async (req: Request, res: Response) => {
    const user = req.user;
    const updateUser: updateUserDTO = req.body;
    if (updateUser.email) {
      const valid_email = await this.userRepo.findOneDocument({
        email: updateUser.email,
      });
      if (valid_email) throw new conflictException(`email already existed`);
    }
    if (updateUser.phone) {
      updateUser.phone = encrypt(updateUser.phone);
    }
    if (updateUser.email) {
      await createAndSendOTP(updateUser.email);
      updateUser.isConfirmed = false;
    }
    const updatedUser = await this.userRepo.findAndUpdateDocument(
      user?._id as mongoose.Types.ObjectId,
      updateUser
    );
    if (!updatedUser) throw new BadRequestException(`something wrong`);
    return res
      .status(200)
      .json(SuccessResponse("user Updated", 200, { updatedUser }));
  };
  updatePassword = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const updatePassword: updatePasswordDTO = req.body;
    const user = await this.userRepo.findByIdDocument(userId, " +password", {
      blockFriends: 0,
    });
    if (!user) throw new notFoundException("user not found");
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
    user.password = updatePassword.confirmPassword;
    await this.userRepo.updateUser(user);
    const keys = await redis.keys(`refreshToken:${user._id as string}:*`);
    if (keys.length) await redis.del(...keys);
    return res     .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json(SuccessResponse(`password updated`, 200))

  };
  resetPasswordreq = async (req: Request, res: Response) => {
    const user = req.user;
    await createAndSendOTP_password(user?.email as string);
    return res.status(200).json(SuccessResponse(`OTP is sent`, 200));
  };
  async resendOTP_reset(req: Request, res: Response) {
    const user = req.user;
    await createAndSendOTP_password(user?.email as string);
    return res.status(200).json(SuccessResponse(`OTP sent`, 200));
  }
  resetPasswordconfrim = async (req: Request, res: Response) => {
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
    user.password = resetPassword.confirmPassword;
    await redis.del(`otp_reset:${user.email}`);
    await this.userRepo.updateUser(user);
    const keys = await redis.keys(`refreshToken:${user._id}:*`);
    if (keys.length) await redis.del(...keys);
    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json(SuccessResponse(`password updated`, 200));
    
  };
  uploadProfile_pic = async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestException("User not found");
    const user = req.user;
    const file = req.file as Express.Multer.File;
    if (!file) throw new BadRequestException("file is required");
    const { Key } = await this.s3Client.upload_file(
      file,
      `${user?._id}/profile`
    );
    user.profilePicture = Key;
    await this.userRepo.updateUser(user);
    return res
      .status(200)
      .json(SuccessResponse("photo uploaded", 200, { Key }));
  };
  uploadCover_pic = async (req: Request, res: Response) => {
    if (!req.user) throw new BadRequestException("User not found");
    const user = req.user;
    const file = req.file as Express.Multer.File;
    if (!file) throw new BadRequestException("file is required");
    const { Key } = await this.s3Client.upload_file(file, `${user?._id}/cover`);
    user.coverPicture = Key;
    await this.userRepo.updateUser(user);
    return res
      .status(200)
      .json(SuccessResponse("photo uploaded", 200, { Key }));
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
    const userId = user._id as mongoose.Types.ObjectId;
    const session = await mongoose.startSession();
    req.session = session;
    session.startTransaction();
    const deleted = await this.userRepo.findByIdAndDeleteDocument(
      user._id as mongoose.Types.ObjectId,
      { session }
    );
    await this.postRepo.deleteManyDocuments({ userId }, { session });
    await this.commnetRepo.deleteManyDocuments({ userId }, { session });
    await session.commitTransaction();
    session.endSession();
    await this.s3Client.deleteListderictory(userId.toString());
    return res
      .status(200)
      .json(SuccessResponse("account deleted", 200, { deleted }));
  };
  sendFreindship = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId | string;
    const { friendRequestTo } = req.body;
    const user = await this.userRepo.findByIdDocument(friendRequestTo);
    if (!user) throw new notFoundException("user not found");
    const friendshipRequest = this.friendshipRepo.createDocument({
      requestFromId: userId,
      requestToId: friendRequestTo,
    });
    return res
      .status(201)
      .json(SuccessResponse("request send", 201, { friendshipRequest }));
  };
  responseFreindship = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const { requestFromId, response } = req.body;
    const friendship = await this.friendshipRepo.findOneDocument({
      requestFromId,
      requestToId: userId,
      status: friendshipEnum.pending,
    });
    if (!friendship) throw new notFoundException("user not found");
    friendship.status = response;
    const updated = await this.friendshipRepo.saveUpdate(friendship);
    if (response == friendshipEnum.accepted) {
      await redis.sadd(`friends:${userId}`, requestFromId);
      await redis.sadd(`friends:${requestFromId}`, userId as any);
    }
    return res
      .status(200)
      .json(SuccessResponse("response send", 200, { updated }));
  };
  listRequsts = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const { status } = req.query;
    const filters: FilterQuery<IFriendship> = { status };
    if (filters.status == friendshipEnum.accepted) {
      const friends = await redis.smembers(`friends:${userId}`);
      if (friends.length) {
        const users = await this.userRepo.findDocuments(
          { _id: { $in: friends } },
          { username: 1, profilePicture: 1 }
        );
        return res
          .status(200)
          .json(SuccessResponse("friends from redis", 200, { friends: users }));
      }
      filters.$or = [{ requestFromId: userId }, { requestToId: userId }];
    } else filters.requestToId = userId;
    const requests = await this.friendshipRepo.findDocuments(
      filters,
      {},
      {
        populate: [
          {
            path: "requestToId",
            select: "username profilePicture",
          },
          {
            path: "requestFromId",
            select: "username profilePicture",
          },
        ],
      }
    );
    if (!requests.length)
      return res.status(200).json(SuccessResponse("no friends yet", 200));
    return res.status(200).json(SuccessResponse(" friends", 200, { requests }));
  };

  createGroup = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as string;
    const { name, memberIds } = req.body as IGroup;
    const members = await this.userRepo.findDocuments({
      _id: { $in: memberIds },
    });
    if (members.length !== memberIds.length)
      throw new notFoundException("users not found");
    const friends = await redis.smembers(`friends:${userId}`);
    if (friends.length) {
      const result = await redis.smismember(`friends:${userId}`, memberIds);
      const IsAllFriends = result.every((v) => v == 1);
      if (!IsAllFriends)
        throw new BadRequestException("Some members are not your friends");
    } else {
      const IsFriends = await this.friendshipRepo.findDocuments({
        $or: [
          { requestFromId: userId, requestToId: { $in: memberIds } },
          { requestToId: userId, requestFromId: { $in: memberIds } },
        ],
      });
      if (IsFriends.length !== memberIds.length) {
        throw new BadRequestException("Some members are not your friends");
      }
    }
    const Group = await this.conversationRepo.createDocument({
      name,
      members: [userId, ...memberIds],
      type: conversation.group,
    });
  };
  listUserGroups = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as string;
    const groups = await this.conversationRepo.findDocuments(
      { members: { $in: userId }, type: conversation.group },
      { name: 1, members: 1, createdAt: 1 }
    );
    if (!groups.length) return [];
    return groups;
  };
  unfriend = async (req: Request, res: Response) => {
    const userId = req.user?._id as mongoose.Types.ObjectId;
    const { friendId } = req.body;
    const friendship = await this.friendshipRepo.findOneDocument({
      $or: [
        { requestFromId: userId, requestToId: friendId },
        { requestFromId: friendId, requestToId: userId },
      ],
      status: friendshipEnum.accepted,
    });
    if (!friendship) throw new notFoundException("friendship not found");
    await this.friendshipRepo.deleteDocument({ _id: friendship._id });
    await redis.srem(`friends:${userId}`, friendId);
    await redis.srem(`friends:${friendId}`, userId as any);
    return res
      .status(200)
      .json(SuccessResponse("friend removed successfully", 200));
  };
  blockFriend = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const user = await this.userRepo.findByIdDocument(userId);
    if (!user) throw new notFoundException("user not found");
    const { friendId } = req.body;
    const isExist = await this.userRepo.findByIdDocument(friendId);
    if (!isExist) throw new notFoundException("user not found");
    if (user.blockFriends?.includes(friendId))
      throw new BadRequestException("user already blocked");
    user?.blockFriends?.push(friendId);
    await this.userRepo.updateUser(user);
    if (await redis.sismember(`friends:${user?._id}`, friendId)) {
      const friendship = await this.friendshipRepo.findOneDocument({
        $or: [
          { requestFromId: userId, requestToId: friendId },
          { requestFromId: friendId, requestToId: userId },
        ],
        status: friendshipEnum.accepted,
      });
      await this.friendshipRepo.deleteDocument({ _id: friendship?._id });
      await Promise.all([
        redis.srem(`friends:${userId}`, friendId),
        redis.srem(`friends:${friendId}`, userId as any),
      ]);
    }
    await redis.sadd(`blocked_friends:${userId}`, friendId);
    return res.status(200).json(SuccessResponse("user blocked", 200));
  };
  unBlockFriend = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const user = await this.userRepo.findByIdDocument(userId);
    if (!user) throw new notFoundException("user not found");
    const { friendId } = req.body;
    const isExist = user.blockFriends?.includes(friendId);
    if (!isExist)
      throw new notFoundException("user not found in your block list");
    user.blockFriends = user.blockFriends?.filter((f) => {
      return f.toString() !== friendId.toString();
    });
    await this.userRepo.updateUser(user);
    await redis.srem(`blocked_friends:${userId}`, friendId);
    return res.status(200).json(SuccessResponse("user  unblocked", 200));
  };
  blockFriendsList = async (req: Request, res: Response) => {
    const userId = req.user?._id as unknown as mongoose.Types.ObjectId;
    const user = await this.userRepo.findByIdDocument(userId);
    if (!user) throw new notFoundException("user not found");
    let list = await friends_Blacklist(userId);
    if (!list.length) list = user.blockFriends?.map((f) => f.toString()) || [];
    if (!list.length)
      return res
        .status(200)
        .json(SuccessResponse("no blocked users", 200, { list: [] }));
    const blockedUsers = await this.userRepo.findDocuments(
      { _id: { $in: list } },
      {
        select: ["username", "profileImage"],
      }
    );
    return res
      .status(200)
      .json(SuccessResponse("users blocked", 200, { blockedUsers }));
  };
  logout = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err: any, decoded: any) => {
        if (!err && decoded.jti) {
          await redis.del(`refreshToken:${decoded.id}:${decoded.jti}`);
        }
        return res.clearCookie("refreshToken").sendStatus(204);
      }
    );
    return;
  };
  logoutAllDevices = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err: any, decoded: any) => {
        if (!err && decoded.jti) {
          const keys = await redis.keys(`refreshToken:${decoded.id}:*`);
          if (keys.length) await redis.del(keys);
        }
        return res.clearCookie("refreshToken").sendStatus(204);
      }
    );
    return;
  };
}

export default new ProfileServices();
