import { Request, Response } from "express";
// import { UserRepo } from "../../../repositories";
// import { UserModel } from "../../../DB/models";
import { decrypt } from "../../../utils";
import { IUser } from "../../../common";

export class ProfileServices {
    // private userRep: UserRepo = new UserRepo(UserModel)
    async profile(req: Request, res: Response) {
        const user = req.user as IUser;
        if (user.phone) {
            user.phone = decrypt(user.phone);
        }
        return res.status(200).json({ profile: user });
    }
}


export default new ProfileServices