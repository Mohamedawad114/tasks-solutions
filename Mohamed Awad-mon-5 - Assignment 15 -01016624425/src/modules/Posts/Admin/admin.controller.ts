import { IsAdmin, verifyToken } from "../../../middlwares";
import AdminPostServices from "./admin.services";
import { Router } from "express";

const adminPostController = Router();

adminPostController.delete(
  "/:postId",
  verifyToken,
  IsAdmin,
  AdminPostServices.deletepost
);

export { adminPostController };
