import { FC } from "react";

enum MessageSender {
    local = 'local',
    remote = 'remote'
}
interface SenderProps {
    className: string;
    imageSource: string;
    imageAlignment?: string;
    labelClass: string;
    labelName: string;
    timeAligment: string
}

interface Message {
    message: string
}

const MessageComponentFactory = (senderProps: SenderProps) => {
    const messageComponent: FC<Message> = (msg) => (
        <div className={senderProps.className}>
            <img src={senderProps.imageSource} alt="Avatar" className={senderProps.imageAlignment} />
            <span className={senderProps.labelClass}>{senderProps.labelName}</span>
            <p>{msg.message}</p>
            <span className={senderProps.timeAligment}>11:00</span>
        </div>
    )
    return messageComponent
}


const localProps: SenderProps = {
    className: "container",
    imageSource: "/pepe-smile.png",
    labelClass: "peer-left",
    labelName: "Local",
    timeAligment: "time-right"
}
const LocalMessage = MessageComponentFactory(localProps)


const remoteProps: SenderProps = {
    className: "container darker",
    imageSource: "/pepe-cool-mirrored.png",
    imageAlignment: 'right',
    labelClass: "peer-right",
    labelName: "Remote",
    timeAligment: "time-left"
}
const RemoteMessage = MessageComponentFactory(remoteProps)


export { LocalMessage, RemoteMessage }