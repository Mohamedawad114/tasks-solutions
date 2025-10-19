import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface Tokens {
  res: Response;
  id: JwtPayload | string;
  role?: string;
  username?: string;
}
export interface accessToken {
  id: JwtPayload | string;
  role?: string;
  username?: string;
}
export interface JwtPayloadCustom {
  id: string | JwtPayload;
  role?: string;
  jti: string;
  username?: string;
}
