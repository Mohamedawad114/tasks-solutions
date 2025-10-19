import { IConversation } from "../common";
import { conversationModel } from "../DB/models";
import { BaseRepository } from "./Base.repository";


export class conversation_Repo extends BaseRepository<IConversation>{
    constructor() {
        super(conversationModel)
    }
}