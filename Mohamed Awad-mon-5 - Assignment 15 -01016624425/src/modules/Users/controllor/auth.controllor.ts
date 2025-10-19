import { loginSchema, signupSchema, confirmEmailSchema } from "../../../common";
import { validate } from "../../../middlwares";
import AuthServices from "../services/Auth.services";
import { Router } from "express";
const authControllor = Router();

authControllor.post("/signup", validate(signupSchema), AuthServices.SignUp);
authControllor.post("/signup-gmail", AuthServices.signWithGoogle);
authControllor.post(
  "/confirmEmail",
  validate(confirmEmailSchema),
  AuthServices.confrim_email
);
authControllor.post("/login", validate(loginSchema), AuthServices.loginuser);
authControllor.get("/resendOTP", AuthServices.resendOTP);
authControllor.get("/refresh-token", AuthServices.refreshToken);

export { authControllor };
