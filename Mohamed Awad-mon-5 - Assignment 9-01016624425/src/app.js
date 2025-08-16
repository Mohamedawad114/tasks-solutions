import express from 'express'
import db_connection from './DB/db.connection.js';
import user_routers from './modules/User/user.controllor.js';
import hpp from "hpp";
import helmet from "helmet";
import env from "dotenv";
import cookieParser from 'cookie-parser';


const app = express();
app.use(helmet());
env.config();
app.use(hpp());
app.use(express.json());
app.use(cookieParser());

app.use('/users',user_routers)



 await db_connection()



app.use((err, req, res, next) => {
  res.status(err.cause||500).json({message:`something wrong`,err:err.message,stack:err.stack});
});

app.use((req, res) => {
  res.status(404).json({message:`Page Not Found`});
});

export default app;
