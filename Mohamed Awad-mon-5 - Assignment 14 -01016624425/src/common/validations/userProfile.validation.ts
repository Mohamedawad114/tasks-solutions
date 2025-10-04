import z from "zod";
import { generalFeilds } from "../../middlwares";

export const updateUserSchema = {
  body: z.strictObject({
    username: generalFeilds.username.optional(),
    phone: generalFeilds.phone.optional(),
    DOB: generalFeilds.DOB.optional,
    email: z.email().optional(),
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
      OTP: z.string().length(6).trim(),
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
