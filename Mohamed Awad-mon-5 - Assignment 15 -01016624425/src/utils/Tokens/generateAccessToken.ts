import jwt from "jsonwebtoken";
import { accessToken, Sys_Role } from "../../common";


export const generateAccessToken = ({ id, role=Sys_Role.user,username }:accessToken) => {
  const accessToken = jwt.sign({ id: id, role: role ,username}, process.env.SECRET_KEY as string, {
    expiresIn: "30m",
  });

  return accessToken;
};
