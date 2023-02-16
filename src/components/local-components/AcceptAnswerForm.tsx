import { FormEvent, useState } from "react"

export function AcceptAnswerForm(props: { pc: RTCPeerConnection }) {
    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        console.log('accepting answer')
        const formData = new FormData(e.target as HTMLFormElement);
        const answerString = formData.get('answer') as string
        const answer = JSON.parse(answerString) as RTCSessionDescriptionInit
        await acceptAnswer(props.pc, answer)


    }


    return (
        <div className="card">
            <form onSubmit={handleSubmit}>
                <div className="offerbox">
                    <label htmlFor="answer"
                    >Enter a received answer:
                        <input
                            type="text"
                            name="answer"
                            id="answer"
                            placeholder="Enter the answer"
                        />
                    </label>
                </div>
                <button id="acceptAnwserButton" name="acceptAnwserButton" className="buttonright" >
                    Accept Answer
                </button>
            </form>


        </div>
    )
}



async function acceptAnswer(localConnection: RTCPeerConnection, answer: RTCSessionDescriptionInit) {
    await localConnection.setRemoteDescription(answer)

}