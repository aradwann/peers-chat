import { FormEvent } from "react";

export function MessageForm(props: { disabled: boolean, handleSend: (message: string) => void }) {

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement);
        const messageData = formData.get('message') as string
        props.handleSend(messageData)

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
                <button id="SendButton" name="sendButton" className="buttonright" disabled={props.disabled}>
                    Send
                </button>
            </form>
        </div>
    )
}