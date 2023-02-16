import { FormEvent, useState } from "react"

export function AnswerForm(props: { pc: RTCPeerConnection }) {
    const [answer, setAnswer] = useState<RTCSessionDescription | null>()


    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        console.log('answer form submitted')
        // setup the remote ICE candidates
        props.pc.onicecandidate = (e) => {
            console.log('new ICE candidate! reprinting SDP ', JSON.stringify(props.pc.localDescription))
            setAnswer(props.pc.localDescription)
        }
        const formData = new FormData(e.target as HTMLFormElement);
        const offerString = formData.get('offer') as string
        const offer = JSON.parse(offerString) as RTCSessionDescription
        const answer = await setupAnswer(props.pc, offer)
        setAnswer(answer)

    }


    return (
        <div className="card">

            <form onSubmit={handleSubmit}>
                <div className="offerbox">
                    <label htmlFor="offer"
                    >Enter a offer:
                        <input
                            type="text"
                            name="offer"
                            id="offer"
                            placeholder="Enter the Offer"
                        />
                    </label>
                </div>
                <button id="generateAnwserButton" name="generateAnwserButton" className="buttonright" >
                    Generate Answer
                </button>
            </form>
            <Answer answer={JSON.stringify(answer)} />


        </div>
    )
}

function Answer(props: { answer: string | undefined }) {
    if (props.answer) {
        return (
            <>
                <label>answer:</label>
                <textarea value={props.answer} disabled />
            </>
        )
    } else {
        return (<></>)
    }
}

async function setupAnswer(remoteConnection: RTCPeerConnection, offer: RTCSessionDescriptionInit) {
    await remoteConnection.setRemoteDescription(offer)
    const answer = await remoteConnection.createAnswer();
    await remoteConnection.setLocalDescription(answer);
    return remoteConnection.localDescription
}