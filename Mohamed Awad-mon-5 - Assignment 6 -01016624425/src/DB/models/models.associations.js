import Post from "./posts.model.js";
import User from "./users.model.js";
import Comment from "./comments.model.js";

Post.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Post, { foreignKey: "userId" });

Comment.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });
Post.hasMany(Comment, { foreignKey: "postId" });

Comment.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Comment, { foreignKey: "userId" });

export { Post, User, Comment };
