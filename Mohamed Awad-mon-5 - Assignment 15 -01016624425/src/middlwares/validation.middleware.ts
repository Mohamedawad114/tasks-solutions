import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { BadRequestException } from "../common/Errors";
import z from "zod";

type ReqTypesKeys = keyof Request;
type TypeSchema = Partial<Record<ReqTypesKeys, ZodType>>;
export const validate = (schema: TypeSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const Keys: ReqTypesKeys[] = ["body", "params", "query"];
    const validationErrors = [];
    for (const key of Keys) {
      if (schema[key]) {
        const result = schema[key].safeParse(req[key]);
        if (!result.success) {
          const issues = result.error?.issues?.map((issue) => ({
            path: issue.path,
            message: issue.message,
          }));
          validationErrors.push(...issues);
        }
      }
    }
    if (validationErrors.length)
      throw new BadRequestException("validation Errors", { validationErrors });
    next();
  };
};


export const generalFeilds = {
  username: z
    .string({
      error: "Username is required",
    })
    .min(6, "Username must be at least 6 characters")
    .max(20, "Username must be less than 20 characters")
    .trim(),
  phone: z
    .string({
      error: "Phone number is required",
    })
    .length(11, { message: "Phone number must be exactly 11 digits" }),
  DOB: z.coerce.date(),
  email: z.email({ message: "Invalid email format" }),
  role: z.string().optional().default("user"),
  password: z
    .string({
      error: "Password is required",
    })
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    ),
};
