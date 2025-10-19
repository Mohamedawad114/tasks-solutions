import z from "zod";
import { generalFeilds } from "../../middlwares";

export const updateUserSchema = {
  body: z.strictObject({
    username: generalFeilds.username.optional(),
    phone: generalFeilds.phone.optional(),
    DOB: generalFeilds.DOB.optional(),
    email: z.email({ message: "Invalid email format" }).optional(),
  }),
};
export const updatePasswordSchema = {
  body: z
    .strictObject({
      oldPassword: generalFeilds.password,
      newPassword: generalFeilds.password,
      confirmPassword: generalFeilds.password,
    })
    .refine(
      (data) => {
        return data.confirmPassword == data.newPassword;
      },
      {
        message: "confirmPassword must match newPassword",
        path: ["confirmPassword"],
      }
    ),
};
export const resetPasswordSchema = {
  body: z
    .strictObject({
      OTP: z
        .string()
        .length(6, { message: "OTP must be exactly 6 digits" })
        .trim(),
      newPassword: generalFeilds.password,
      confirmPassword: generalFeilds.password,
    })
    .refine(
      (data) => {
        return data.confirmPassword == data.newPassword;
      },
      {
        message: "confirmPassword must match newPassword",
        path: ["confirmPassword"],
      }
    ),
};

export const responseFreindshipSchema = {
  body: z.strictObject({
    requestFromId: z.string().length(24),
    response: z.enum(["accepted", "rejected"]),
  }),
};
export const blockuserSchema = {
  body: z.strictObject({
    friendId: z.string().length(24),
  }),
};
