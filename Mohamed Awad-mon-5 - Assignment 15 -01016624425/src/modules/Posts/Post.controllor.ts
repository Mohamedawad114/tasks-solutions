import { postSchema, reactionSchema, updatePostSchema } from "../../common";
import { isFreezed, IsOwner, uploadFile, validate, verifyToken } from "../../middlwares";
import { comment_controller } from "../Comments/comment.controller";
import postServices from "./services/Post.services";
import { Router } from "express";
const postControllor = Router({ mergeParams: true });

postControllor.use("/:postId/comments", comment_controller);
postControllor.get("/", verifyToken, postServices.getMyPosts);
postControllor.get("/:postId", verifyToken, postServices.getPost);
postControllor.get(
  "/:postId/reactions",
  verifyToken,
  postServices.getReactionsUsers
);
postControllor.post(
  "/create",
  verifyToken,
  isFreezed,
  uploadFile().array("attachments"),
  validate(postSchema),
  postServices.createPost
);
postControllor.post("/share", verifyToken, isFreezed, postServices.sharePost);
postControllor.put(
  "/:postId/update",
  verifyToken,
  isFreezed,
  validate(updatePostSchema),
  IsOwner,
  postServices.updatePost
);
postControllor.patch(
  "/:postId",
  verifyToken,
  isFreezed,
  validate(reactionSchema),
  postServices.Reaction
);
postControllor.delete(
  "/:postId",
  verifyToken,
  IsOwner,
  isFreezed,
  postServices.deletePost
);

export { postControllor };
