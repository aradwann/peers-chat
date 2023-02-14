import { MessageSender } from "../typing/enums";

export function MessageForm(props: { sender: MessageSender }) {
    return (
        <div className="card">
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
            <button id="sendButton" name="sendButton" className="buttonright" >
                Send from {props.sender}
            </button>
        </div>
    )
}