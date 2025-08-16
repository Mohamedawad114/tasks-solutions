import express from "express";
import * as user_serv from "./services/user.services.js";
import verifyToken from "../../middlwares/auth.middlewaress.js";
const router = express.Router();

router.post("/signup", user_serv.signup);
router.post("/confirmemail", user_serv.confrim_email);
router.post("/login", user_serv.loginuser);
router.put("/update", verifyToken, user_serv.updateuser);
router.put("/updatePassword", verifyToken, user_serv.updatePass);
router.put("/editpassword", verifyToken, user_serv.resetPasswordconfrim);
router.get("/refresh", user_serv.refreshToken);
router.get("/reqresestpassword", verifyToken, user_serv.resetPasswordreq);
router.get("/profile", verifyToken, user_serv.getprofile);
router.delete("/logout", user_serv.logout);
router.delete("/delete", verifyToken, user_serv.deleteaccount);

export default router;
