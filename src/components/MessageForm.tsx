import { FormEvent } from "react";
import { MessageSender } from "../typing/enums";
import { Message } from "../typing/interfaces";

export function MessageForm(props: { sender: MessageSender, disabled: boolean, handleSend: (message: Message) => void }) {
    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement);
        const messageData = formData.get('message') as string
        props.handleSend({ data: messageData, sender: props.sender })
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
                <button id="sendButton" name="sendButton" className="buttonright" disabled={props.disabled}>
                    Send from {props.sender}
                </button>
            </form>
        </div>
    )
}