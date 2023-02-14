import { FC } from "react";
import { Message, SenderProps } from "../typing/interfaces";

const createMessageComponent = (senderProps: SenderProps) => {
    const messageComponent: FC<Pick<Message, "data">> = (msg) => (
        <div className={senderProps.className}>
            <img src={senderProps.imageSource} alt="Avatar" className={senderProps.imageAlignment} />
            <span className={senderProps.labelClass}>{senderProps.labelName}</span>
            <p>{msg.data}</p>
            <span className={senderProps.timeAligment}>11:00</span>
        </div>
    )
    return messageComponent
}

export { createMessageComponent } 