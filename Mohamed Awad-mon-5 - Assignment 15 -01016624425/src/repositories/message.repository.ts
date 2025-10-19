import { IMessage } from "../common";
import { messageModel } from "../DB/models";
import { BaseRepository } from "./Base.repository";

export class Message_Repo extends BaseRepository<IMessage> {
  constructor() {
    super(messageModel);
  }
}
