
import { verifyToken } from "../../../middlwares";
import profilecServices from "../services/profile.services";
import { Router } from "express";
const profileControllor=Router()


profileControllor.post('/signup',verifyToken,profilecServices.profile);


 

export {profileControllor}