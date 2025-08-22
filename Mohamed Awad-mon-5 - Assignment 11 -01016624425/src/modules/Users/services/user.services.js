import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import user from "../../../DB/models/Users.model.js";
import redis from "../../../utils/redis.js";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import {
  createAndSendOTP,
  createAndSendOTP_Password,
} from "../../../utils/send-email.js";
import dotenv from "dotenv";
import { v4 as uuidV4 } from "uuid";
import Token from "../../../DB/models/refreshToke.model.js";
dotenv.config();

export const signup = asyncHandler(async (req, res) => {
  const { Name, password, email, isAdmin } = req.body;
  const valid_email = await user.findOne({ email });
  if (valid_email) throw new Error(`email is aleardy existed`, { cause: 409 });
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
  const hashpassword = await bcrypt.hash(password, salt);
  const create = await user.create({
    Name,
    password: hashpassword,
    email,
    isAdmin,
  });
  if (create) await createAndSendOTP(create, email);
  return res.status(201).json({ message: `signup done, otp send` });
});
export const confrim_email = asyncHandler(async (req, res) => {
  const { OTP, email } = req.body;
  const User = await user.findOne({ email: email, isconfirmed: false });
  if (!User) throw new Error(`email aleardy confirmed`, { cause: 400 });
  if (!OTP) throw new Error(`OTP required`, { cause: 400 });
  const savedOTP = await redis.get(`otp_${email}`);
  if (!savedOTP) {
    throw new Error(`Expire OTP `, { cause: 400 });
  }
  const isMAtch = await bcrypt.compare(OTP, savedOTP);
  if (!isMAtch) throw new Error(`invaled otp`, { cause: 400 });
  User.isconfirmed = true;
  await redis.del(`otp_${email}`);
  await User.save();
  return res.status(200).json({ message: `email is confirmed ` });
});
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const User = await user.findOne({ email });
  if (!User) throw new Error(`user not found`, { cause: 404 });
  createAndSendOTP(User, email);
  res.status(200).json({ message: "otp is send" });
});
export const loginuser = asyncHandler(async (req, res) => {
  const key = process.env.SECRET_KEY;
  const { password, email } = req.body;
  const valid_email = await user.findOne({ email });
  if (!valid_email) {
    throw new Error(`email not found`, { cause: 404 });
  }
  const passMatch = await bcrypt.compare(password, valid_email.password);
  if (!passMatch) throw new Error(`invalid password`, { cause: 400 });
  const accessToken = jwt.sign(
    {
      id: valid_email._id,
      isAdmin: valid_email.isAdmin,
    },
    key,
    { expiresIn: "10m" }
  );
  const refreshTokenExpire = dayjs().add(1, "week").toDate();
  const jti = uuidV4();
  const refreshToken = jwt.sign(
    { id: valid_email._id, isAdmin: valid_email.isAdmin, jti },
    key,
    { expiresIn: "1d" }
  );
  await Token.create({
    refreshToken,
    userId: valid_email._id,
    expireAt: refreshTokenExpire,
  });
  res
    .status(200)
    .json({ message: `login seccussfully`, accessToken, refreshToken });
});

export const uploadphoto = asyncHandler(async (req, res) => {
  const file = req.file;
  const id = req.user.id;
  const User = await user.findById(id);
  if (!User) throw new Error("user not found", { cause: 404 });
  if (!file) throw new Error("image required", { cause: 400 });
  const { public_id, secure_url } = await uploadfile({
    file,
    path: `users/${id}`,
  });
  if (User.image?.public_id) await deleteFile(User.image.public_id);
  User.image = { public_id, url: secure_url };
  await User.save();
  return res.status(200).json({ message: `photo uploaded` });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  const storedToken = await Token.findOne({ refreshToken: token });
  if (!storedToken) return res.sendStatus(403);
  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) throw new Error();
    const accessToken = jwt.sign(
      { id: decoded.id, isAdmin: decoded.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );
    return res.json({ accessToken });
  });
});
export const logout = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const tokens = await Token.find({ userId: id });
  if (!tokens.length) return res.sendStatus(204);
  await Token.deleteMany({ userId: id });
  return res.json({ message: "Logged out successfully" });
});

export const deleteaccount = asyncHandler(async (req, res) => {
  let id = req.user.id;
  if (req.user.isAdmin != true) {
    const deleted = await user.findByIdAndDelete(id);
    if (!deleted) throw new Error(`user not found`, { cause: 404 });
    await Token.deleteMany({ userId: id });
    return res.status(200).json({ message: `account deleted` });
  }
});
export const updatePass = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const User = await user.findById(id);
  if (!User) throw new Error(`user not found`, { cause: 404 });
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new Error(`All input required`, { cause: 400 });
  const IsMatch = await bcrypt.compare(oldPassword, User.password);
  if (!IsMatch) throw new Error(`Invalid oldPassword`, { cause: 400 });
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
  User.password = await bcrypt.hash(newPassword, salt);
  await User.save();
  await Token.deleteMany({ userId: id });
  return res.status(200).json({ message: `password updated` });
});

export const resetPasswordreq = asyncHandler(async (req, res) => {
  const User = await user.findById(req.user.id);
  if (!User) throw new Error(`user not found`, { cause: 404 });
  createAndSendOTP_Password(User, User.email);
  return res.status(200).json({ message: `OTP is sent` });
});
export const resendOtpPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const User = await user.findOne({ email });
  if (!User) throw new Error(`user not found`, { cause: 404 });
  createAndSendOTP_Password(User, email);
  res.status(200).json({ message: "otp is send" });
});
export const resetPasswordconfrim = asyncHandler(async (req, res) => {
  const User = await user.findById(req.user.id);
  const { OTP, newPassword } = req.body;
  if (!OTP || !newPassword)
    throw new Error(`Both OTP and new passwords are required`, { cause: 400 });
  const savedOTP = await redis.get(`otp_${User.email}`);
  if (!savedOTP) {
    createAndSendOTP_Password(User, User.email);
    throw new Error(`expire OTP`, { cause: 400 });
  }
  const isMatch = await bcrypt.compare(OTP, savedOTP);
  if (!isMatch) throw new Error(`invalid OTP`, { cause: 400 });
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
  const hashpassword = await bcrypt.hash(newPassword, salt);
  User.password = hashpassword;
  await redis.del(`otp_${User.email}`);
  await User.save();
  await Token.deleteMany({ userId: req.user.id });
  return res.status(200).json({ message: `password updated` });
});
