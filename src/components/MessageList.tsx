import { MessageSender } from "../typing/enums";
import { Message } from "../typing/interfaces";
import { LocalMessage, RemoteMessage } from "./Message";

export function MessageList(props: { messages: Message[] }) {
    const messages = props.messages.map(
        (message) => message.sender === MessageSender.local ?
            <LocalMessage data={message.data} />
            : <RemoteMessage data={message.data} />)
    return (
        <div className='card'>
            {messages}
        </div>
    )
}