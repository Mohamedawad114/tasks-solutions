import {sequelize_config} from "../db.connection.js";
import {DataTypes,Model} from "sequelize"
import user from "./users.model.js";
import post from "./posts.model.js";

class comment extends Model{}
comment.init({
    content:{
        type:DataTypes.TEXT,
    },
  postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize_config,
    modelName: "comment",
    timestamps: true,
  }
);


export default comment;