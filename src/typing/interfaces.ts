import { MessageSender } from "./enums";

export interface SenderProps {
    className: string;
    imageSource: string;
    imageAlignment?: string;
    labelClass: string;
    labelName: string;
    timeAligment: string
}

export interface Message {
    data: string,
    sender: MessageSender
}