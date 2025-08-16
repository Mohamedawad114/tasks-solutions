import { sequelize_config } from "../db.connection.js";
import { DataTypes, Model } from "sequelize";
import user from "./users.model.js";
import comment from './comments.model.js';

class post extends Model {}

post.init(
  {
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: user,      
        key: "id",        
      },
    },
  },
  {
    sequelize: sequelize_config,
    modelName: "post",
    timestamps: true,
    paranoid: true,
  }
);



export default post;
