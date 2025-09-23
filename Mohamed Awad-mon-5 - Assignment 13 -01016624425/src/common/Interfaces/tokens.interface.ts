import { Response } from "express";
import mongoose from "mongoose";

export interface Tokens{
    res: Response,
    id: mongoose.Types.ObjectId|string,
    role:string
}
export interface accessToken{

    id: mongoose.Types.ObjectId|string,
    role:string
}
export interface JwtPayloadCustom  {
  id: string;
  role: string;
  jti: string;
}