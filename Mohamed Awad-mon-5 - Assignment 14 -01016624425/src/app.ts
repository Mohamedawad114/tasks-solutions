import express, { NextFunction, Response,Request } from "express";
import helmet from "helmet";
import hpp from "hpp"
import cookieParser from "cookie-parser";
import db_connection from "./DB/db.connection"
import * as controllors from "./modules/controllor.index";
import morgan from 'morgan'
import { AppError } from "./common/Errors";
import { FailerResponse } from "./utils";


const app = express();
app.use(helmet());
app.use(morgan("combined"))
app.use(hpp());
app.use(express.json());
app.use(cookieParser())

db_connection();

app.use('/api/auth',controllors.authControllor)
app.use('/api/profile',controllors.profileControllor)
app.use('/api/posts',controllors.postControllor)



app.use((req:Request, res:Response) => {
  res.status(404).json({ message: `Page Not Found` });
});
app.use((err: AppError|Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json(FailerResponse(err.message,err.statusCode,err.error
    ));
  }
  return res.status(500).json({
    messsage:'something broking',
    context:err.message,
    stck:err.stack
  }
    );
});



export default app;
