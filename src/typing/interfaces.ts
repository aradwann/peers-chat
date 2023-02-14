import { MessageSender } from "./enums";

export interface Message {
    data: string,
    sender: MessageSender
}