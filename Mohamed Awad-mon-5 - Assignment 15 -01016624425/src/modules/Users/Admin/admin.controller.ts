import { IsAdmin, verifyToken } from "../../../middlwares";
import adminServices from "./admin.services";
import { Router } from "express";
const adminControllor = Router();

adminControllor.get(
  "/Dashboard",
  verifyToken,
  IsAdmin,
  adminServices.dashboard
);
adminControllor.patch(
  "/strictFreezeUser/:userId",
  verifyToken,
  IsAdmin,
  adminServices.strictFreezeUser
);
adminControllor.patch(
  "/FreezeUser/:userId",
  verifyToken,
  IsAdmin,
  adminServices.FreezeUser_peroid
);
adminControllor.delete(
  "/deleteUser/:userId",
  verifyToken,
  IsAdmin,
  adminServices.deleteUserAccount
);

export { adminControllor };
