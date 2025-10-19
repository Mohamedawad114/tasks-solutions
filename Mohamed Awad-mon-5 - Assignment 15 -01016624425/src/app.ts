import express, { NextFunction, Response, Request } from "express";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import db_connection from "./DB/db.connection";
import * as controllors from "./modules/controllor.index";
import { AppError } from "./common/Errors";
import { FailerResponse } from "./utils";
import { server } from ".";
import { httpLogger } from "./middlwares";
import dotenv from "dotenv";
dotenv.config({ path: "./dev.env" });

const app = express();
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(httpLogger);

db_connection();
app.get("/api/home", controllors.homeRouter);
app.use("/api/auth", controllors.authControllor);
app.use("/api/profile", controllors.profileControllor);
app.use("/api/posts", controllors.postControllor);
app.use("/api/admin", controllors.adminRouter);


app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Page Not Found` });
});
app.use(
  async (
    err: AppError | Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (req.session && req.session.inTransaction()) {
      await req.session.abortTransaction();
      req.session.endSession();
    }
    if (err instanceof AppError) {
      return res
        .status(err.statusCode)
        .json(FailerResponse(err.message, err.statusCode, err.error));
    }
    return res.status(500).json({
      messsage: "something broking",
      context: err.message,
      stck: err.stack,
    });
  }
);

export default app;
