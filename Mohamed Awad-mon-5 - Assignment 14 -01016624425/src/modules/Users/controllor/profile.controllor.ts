import {
  resetPasswordSchema,
  updatePasswordSchema,
  updateUserSchema,
} from "../../../common";
import { uploadFile, validate, verifyToken } from "../../../middlwares";
import profilecServices from "../services/profile.services";
import { Router } from "express";
const profileControllor = Router();

profileControllor.get("/profile", verifyToken, profilecServices.profile);
profileControllor.get(
  "/reset-password",
  verifyToken,
  profilecServices.resetPasswordreq
);
profileControllor.get(
  "/resend-OTP",
  verifyToken,
  profilecServices.resendOTP_reset
);
profileControllor.post(
  "/profile-picture",
  verifyToken,
  uploadFile().single("profile"),
  profilecServices.uploadProfile_pic
);
profileControllor.post(
  "/renew-signedUrl",
  verifyToken,
  profilecServices.renew_SignedUrl
);
profileControllor.put(
  "/update",
  verifyToken,
  validate(updateUserSchema),
  profilecServices.Updateuser
);
profileControllor.put(
  "/update-password",
  validate(updatePasswordSchema),
  verifyToken,
  profilecServices.updatePassword
);
profileControllor.put(
  "/reset-password-confirmation",
  verifyToken,
  validate(resetPasswordSchema),
  profilecServices.resetPasswordconfrim
);
profileControllor.delete(
  "/delete",
  verifyToken,
  profilecServices.deleteAccount
);

export { profileControllor };
