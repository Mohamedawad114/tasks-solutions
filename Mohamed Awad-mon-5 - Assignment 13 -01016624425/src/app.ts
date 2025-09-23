import express, { NextFunction, Response,Request } from "express";
import helmet from "helmet";
import hpp from "hpp"
import db_connection from "./DB/db.connection"
import * as controllors from "./modules/controllor.index";
import { authControllor } from "./modules/controllor.index";
import morgan from 'morgan'
import { AppError } from "./common/Errors";
import { FailerResponse } from "./utils";


const app = express();
app.use(helmet());
app.use(morgan("combined"))
app.use(hpp());
app.use(express.json());

db_connection();

app.use('/api/auth',authControllor)

app.use('/api/profile',controllors.profileControllor)
console.log(controllors)


app.use((req:Request, res:Response) => {
  res.status(404).json({ message: `Page Not Found` });
});
app.use((err: AppError|Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return res.json(FailerResponse(err.message,err.statusCode,err.error
    ));
  }
       return res.json(FailerResponse('something broking',500,err
    ));
});


export default app;
