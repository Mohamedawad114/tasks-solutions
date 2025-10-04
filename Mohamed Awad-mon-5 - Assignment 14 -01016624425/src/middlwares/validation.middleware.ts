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
    .string({ error: "username is requied and min length6" })
    .min(6)
    .max(20)
    .trim(),
  phone: z.string().length(11),
  DOB: z.date(),
  email: z.email(),
  role: z.string().optional().default("user"),
  password: z
    .string()
    .min(6)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{6,}$/
    ),
};
