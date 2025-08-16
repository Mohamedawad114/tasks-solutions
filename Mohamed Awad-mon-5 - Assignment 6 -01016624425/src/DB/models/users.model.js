import {sequelize_config} from "../db.connection.js";
import {DataTypes} from "sequelize" 
export const user= sequelize_config.define(
   "user",
    {
        name:{
            type:DataTypes.STRING(25),
            allowNull:false,
            validate:{
                namelength(value){
                    if (value.length<=2){
                        throw Error(`the name must be greater than 2`)
                    }
                }
            }
        },
        email:{
            type:DataTypes.STRING(200),
            allowNull:false,
            validate:{
                isEmail:true
            }
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
            validate:{
                checkPasswordLength(value){
                    if(value.length<=6){
                        throw Error(`password must be longer than 6`)
                    }
                }
                
            }
        },
        role:{
            type:DataTypes.ENUM("user","admin"),
            allowNull:false,
            defaultValue:"user"
        },
    },
    {
        paranoid:true,
        timestamps:true,
        createdAt:true,
        updatedAt:true,
        indexes:[{
            name:"email_valid",
            unique:true,
            fields:["email"]
        }]
    }
)
export default user