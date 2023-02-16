import { FormEvent, MouseEvent, useState } from "react";
import { MessageSender } from "../typing/enums";

export function ClientTypeForm(props: { setClientType: (messageSender: MessageSender) => void }) {

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
    }
    function handleClick(e: MouseEvent) {
        const buttonId = e.currentTarget.id
        buttonId === "localButton" ? props.setClientType(MessageSender.local) : props.setClientType(MessageSender.remote)
    }



    return (
        <div className="card">
            <form onSubmit={handleSubmit}>
                <h2>Who Are you?</h2>
                <button id="localButton" name="localButton" className="buttonright" onClick={handleClick}>
                    I am the {MessageSender.local}
                </button>
                <button id="remoteButton" name="remoteButton" className="buttonright" onClick={handleClick}>
                    I am the {MessageSender.remote}
                </button>
            </form>
        </div>
    )
}