import { IsOwnerComment, uploadFile, verifyToken } from "../../middlwares";
import commentServices from "./services/comment.services";
import { Router } from "express";
const comment_controller = Router({ mergeParams: true });

comment_controller.get("/:commentId", verifyToken, commentServices.getComment);
comment_controller.get("/", verifyToken, commentServices.getComments);
comment_controller.get(
  "/:commentId/reactions",
  verifyToken,
  commentServices.getReactionsUsers
);
comment_controller.post("/create", verifyToken,uploadFile().single("attachment"), commentServices.createComment);
comment_controller.post(
  "/replay/:commentId",
  verifyToken,
  uploadFile().single("attachment"),
  commentServices.createReply
);
comment_controller.put(
  "/:commentId/update",
  verifyToken,
  IsOwnerComment,
  commentServices.updateComment
);
comment_controller.patch("/:commentId", verifyToken, commentServices.Reaction);
comment_controller.delete(
  "/:commentId/delete",
  verifyToken,
  IsOwnerComment,
  commentServices.deleteComment
);

export { comment_controller };
