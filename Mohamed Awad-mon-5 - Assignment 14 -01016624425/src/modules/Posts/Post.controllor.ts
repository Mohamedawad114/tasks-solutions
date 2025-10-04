import { IsOwner, uploadFile, verifyToken } from "../../middlwares";
import { comment_controller } from "../Comments/comment.controller";
import * as postServices from "./services/Post.services";
import { Router } from "express";
const postControllor = Router({ mergeParams: true });

postControllor.use("/:postId/comments", comment_controller);
postControllor.get("/:id", verifyToken, postServices.default.getPost);
postControllor.get(
  "/:id/reactions",
  verifyToken,
  postServices.default.getReactionsUsers
);
postControllor.post(
  "/share",
  verifyToken,
  uploadFile().array("attachments"),
  postServices.default.createPost
);
postControllor.put(
  "/:id/update",
  verifyToken,
  IsOwner,
  postServices.default.updatePost
);
postControllor.patch("/:id", verifyToken, postServices.default.Reaction);
postControllor.delete(
  "/:id",
  verifyToken,
  IsOwner,
  postServices.default.deletePost
);

export { postControllor };
