import jwt from 'jsonwebtoken'
import { SYS_role } from './Enums/user.enums'
import {v4 as uuidV4} from 'uuid'
import redis from './redis';
import mongoose from 'mongoose';


export const generateTokens = async ( userId:mongoose.Types.ObjectId, role:SYS_role) => {
  const jti = uuidV4();
  await redis.set(
    `refreshToken:${userId}:${jti}`,
    "1",
    "EX",
    60 * 60 * 24 * 30
  );
  const accessToken = jwt.sign(
    { id: userId, role: role },
    process.env.SECRET_KEY as string,
    {
      expiresIn: "30m",
    }
  );
  const refreshToken = jwt.sign(
    { id: userId, jti, role: role },
    process.env.SECRET_KEY as string,
    {
      expiresIn: "30d",
    }
  );
  return {accessToken,refreshToken};
};