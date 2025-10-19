import {
  blockuserSchema,
  resetPasswordSchema,
  responseFreindshipSchema,
  updatePasswordSchema,
  updateUserSchema,
} from "../../../common";
import { uploadFile, validate, verifyToken } from "../../../middlwares";
import profilecServices from "../services/profile.services";
import { postControllor } from "../../Posts/Post.controllor";
import { Router } from "express";
const profileControllor = Router({ mergeParams: true });

profileControllor.use("/posts", postControllor);
profileControllor.get("/Info", verifyToken, profilecServices.profile);
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
profileControllor.get(
  "/friends-request",
  verifyToken,
  profilecServices.listRequsts
);
profileControllor.get(
  "/blocked-users",
  verifyToken,
  profilecServices.blockFriendsList
);
profileControllor.get(
  "/group-list",
  verifyToken,
  profilecServices.listUserGroups
);
profileControllor.post(
  "/profile-picture",
  verifyToken,
  uploadFile().single("profile"),
  profilecServices.uploadProfile_pic
);
profileControllor.post(
  "/cover-picture",
  verifyToken,
  uploadFile().single("cover"),
  profilecServices.uploadCover_pic
);
profileControllor.post(
  "/renew-signedUrl",
  verifyToken,
  profilecServices.renew_SignedUrl
);
profileControllor.post(
  "/friend-request",
  verifyToken,
  profilecServices.sendFreindship
);
profileControllor.post(
  "/create-group",
  verifyToken,
  profilecServices.createGroup
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
profileControllor.patch(
  "/rsponse-friendship",
  verifyToken,
  validate(responseFreindshipSchema),
  profilecServices.responseFreindship
);
profileControllor.patch(
  "/blockUser",
  verifyToken,
  validate(blockuserSchema),
  profilecServices.blockFriend
);
profileControllor.patch(
  "/unblockUser",
  verifyToken,
  validate(blockuserSchema),
  profilecServices.unBlockFriend
);
profileControllor.delete("/unfriend", verifyToken, profilecServices.unfriend);
profileControllor.delete("/logout", verifyToken, profilecServices.logout);
profileControllor.delete(
  "/logout-all",
  verifyToken,
  profilecServices.logoutAllDevices
);
profileControllor.delete(
  "/delete",
  verifyToken,
  profilecServices.deleteAccount
);

export { profileControllor };
