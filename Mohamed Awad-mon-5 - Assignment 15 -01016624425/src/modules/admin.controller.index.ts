import{ adminControllor } from "./Users/Admin/admin.controller";
import{ adminPostController } from "./Posts/Admin/admin.controller";
import { Router } from "express";

const adminRouter = Router();
 
adminRouter.use("/users", adminControllor);
adminRouter.use("/posts", adminPostController);


export { adminRouter };