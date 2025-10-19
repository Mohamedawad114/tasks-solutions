
import { Router } from "express";
import { verifyToken } from "../../middlwares";
import homeServices from "./home.services";
const homeRouter = Router()

homeRouter.get("/search",verifyToken,homeServices.search)
homeRouter.get("/searh/:userId", verifyToken, homeServices.getUserPosts)
homeRouter.get("/", verifyToken, homeServices.getFeedsPosts)

export {homeRouter}