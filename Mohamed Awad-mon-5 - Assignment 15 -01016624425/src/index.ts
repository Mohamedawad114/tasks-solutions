import app from "./app";
import { logger } from "./middlwares";
let port=process.env.PORT as string||3000;


export const server=app.listen(port,()=>{
   logger.info(`port ${port} is running....`)
})