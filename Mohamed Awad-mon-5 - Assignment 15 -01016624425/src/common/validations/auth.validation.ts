import z from "zod";
import { generalFeilds } from "../../middlwares";
import { Gender } from "../Enums/User.Enum";

export const signupSchema = {
  body: z.object({
    username: generalFeilds.username,
    phone: z.string().length(11),
    DOB: z.coerce.date(),
    email: generalFeilds.email,
    role: z.string().optional().default("user"),
    password: generalFeilds.password,
    gender: z.enum([Gender.female, Gender.male, Gender.other]).optional(),
  }),
};
export const loginSchema = {
  body: z.strictObject({
    email: z.email(),
    password: generalFeilds.password,
  }),
};
export const confirmEmailSchema = {
  body: z.strictObject({
    email: z.email(),
    OTP: z.string().length(6).trim(),
  }),
};
