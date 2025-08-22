import express from "express";
import * as services from "./services/user.services.js";
import { validate } from "../../middlwares/validation.middleware.js";
import { cloudFileUpload } from '../../utils/cloudinary.js';
import verifyToken from "../../middlwares/auth.middlewares.js";
import {
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  UpdatePasswordSchema,
  UpdateUserSchema,
} from "../../validators/user.validator.js";
import { limitter } from "../../middlwares/rateLimit.js";

const router = express.Router();


router.post("/signup", validate(signupSchema), services.signup);
router.post("/confirmEmail",limitter, services.confrim_email);
router.get("/resendOTP", services.resendOtp);
router.post("/login",limitter, validate(loginSchema), services.loginuser);
router.get("/refresh", services.refreshToken);
router.delete("/logout", verifyToken, services.logout);

router.post("/photo", verifyToken, cloudFileUpload.single("image"), services.uploadphoto);
router.put("/updatepassword",limitter, verifyToken, validate(UpdatePasswordSchema), services.updatePass);


router.get("/resetPasswordReq", verifyToken, services.resetPasswordreq);
router.put("/resetPassword",limitter, verifyToken, validate(resetPasswordSchema), services.resetPasswordconfrim);
router.get("/resendOTP",verifyToken, services.resendOtpPassword);


export default router;
