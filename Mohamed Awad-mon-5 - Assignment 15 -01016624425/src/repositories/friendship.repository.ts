import { IFriendship } from "../common";
import { friendshipModel } from "../DB/models";
import { BaseRepository } from "./Base.repository";


export class friendshipRepo extends BaseRepository<IFriendship>{
    constructor() {
        super(friendshipModel);
    }
    async  saveUpdate(friendship:IFriendship):Promise <IFriendship> {
        return await friendship.save()
    }
}