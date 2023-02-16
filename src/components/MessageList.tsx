import { MessageSender } from "../typing/enums";
import { Message } from "../typing/interfaces";
import { LocalMessage } from "./local-components/LocalMessage";
import { RemoteMessage } from "./remote-components/RemoteMessage";

export function MessageList(props: { messages: Message[] }) {
    const messages = props.messages.map(
        (message) => message.sender === MessageSender.local ?
            <LocalMessage key={crypto.randomUUID()} data={message.data} />
            : <RemoteMessage key={crypto.randomUUID()} data={message.data} />)
    return (
        <div className='card'>
            {messages}
        </div>
    )
}