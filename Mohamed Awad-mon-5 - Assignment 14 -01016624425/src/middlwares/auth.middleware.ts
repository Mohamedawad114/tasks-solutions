import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import 'dotenv/config'
import { UserModel } from "../DB/models";
import { notAuthorizedException } from "../common/Errors";
import { FailerResponse } from "../utils";

async function verifyToken(req: Request, res: Response, next: NextFunction):Promise<void|Response> {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  try {
    if (!token) throw new notAuthorizedException("no token provided")
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string)as JwtPayload;
    const user = await UserModel.findById(decoded.id );
    if (!user) throw new notAuthorizedException('user not found')
    req.user = user;
    next();
  } catch (err) {
    return res.json(FailerResponse("Invalid or expired token" ,401));
  }
}

export { verifyToken}