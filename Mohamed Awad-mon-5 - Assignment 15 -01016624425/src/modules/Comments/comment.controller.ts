import { isFreezed, uploadFile, verifyToken } from "../../middlwares";
import commentServices from "./services/comment.services";
import { Router } from "express";
const comment_controller = Router({ mergeParams: true });

comment_controller.get("/:commentId", verifyToken, commentServices.getComment);
comment_controller.get("/", verifyToken, commentServices.getComments);
comment_controller.get(
  "/:commentId/replies",
  verifyToken,
  commentServices.getComments_reply
);
comment_controller.get(
  "/:commentId/reactions",
  verifyToken,
  commentServices.getReactionsUsers
);
comment_controller.post(
  "/create",
  verifyToken,
  isFreezed,
  uploadFile().single("attachment"),
  commentServices.createComment
);
comment_controller.post(
  "/reply/:commentId",
  verifyToken,
  isFreezed,
  uploadFile().single("attachment"),
  commentServices.createReply
);
comment_controller.put(
  "/:commentId/update",
  verifyToken,
  isFreezed,
  commentServices.updateComment
);
comment_controller.patch(
  "/:commentId",
  verifyToken,
  isFreezed,
  commentServices.Reaction
);
comment_controller.delete(
  "/:commentId/delete",
  verifyToken,
  isFreezed,
  commentServices.deleteComment
);

export { comment_controller };
