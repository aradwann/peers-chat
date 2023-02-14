import { FormEvent, MouseEvent, useState } from "react";
import { MessageSender } from "../typing/enums";
import { Message } from "../typing/interfaces";

export function MessageForm(props: { disabled: boolean, handleSend: (message: Message) => void }) {

    const [sender, setSender] = useState(MessageSender.local)

    function handleClick(e: MouseEvent) {
        const buttonId = e.currentTarget.id
        buttonId === "localSendButton" ? setSender(MessageSender.local) : setSender(MessageSender.remote)
        console.log(e.currentTarget.id);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement);
        const messageData = formData.get('message') as string
        props.handleSend({ data: messageData, sender })
        console.log(`you submitted ${messageData}`);

    }

    return (
        <div className="card">
            <form onSubmit={handleSubmit}>
                <div className="messagebox">
                    <label htmlFor="message"
                    >Enter a message:
                        <input
                            type="text"
                            name="message"
                            id="message"
                            placeholder="Message text"
                        />
                    </label>
                </div>
                <button id="localSendButton" name="sendButton" className="buttonright" disabled={props.disabled} onClick={handleClick}>
                    Send from {MessageSender.local}
                </button>
                <button id="remoteSendButton" name="sendButton" className="buttonright" disabled={props.disabled} onClick={handleClick}>
                    Send from {MessageSender.local}
                </button>
            </form>
        </div>
    )
}