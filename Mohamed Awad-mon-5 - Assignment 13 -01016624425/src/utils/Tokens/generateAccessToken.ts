import jwt from "jsonwebtoken";
import { accessToken } from "../../common";


export const generateAccessToken = ({ id, role }:accessToken) => {
  const accessToken = jwt.sign({ id: id, role: role }, process.env.SECRET_KEY as string, {
    expiresIn: "30m",
  });

  return accessToken;
};
