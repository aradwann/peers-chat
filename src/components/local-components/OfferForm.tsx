import { FormEvent, useEffect, useState } from "react"

export function OfferForm(props: { pc: RTCPeerConnection }) {
    const [offer, setOffer] = useState<string>()


    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        // setup the Local ICE candidates
        props.pc.onicecandidate = (e) => {
            console.log('new ICE candidate! reprinting SDP ', JSON.stringify(props.pc.localDescription))
            setOffer(JSON.stringify(props.pc.localDescription))
        }
        const offerData = await setupOffer(props.pc)
        setOffer(JSON.stringify(offerData))

    }


    return (
        <div className="card">
            <div>
                <form onSubmit={handleSubmit}>

                    <button id="generateOfferButton" name="sendButton" className="buttonright" >
                        Generate Offer
                    </button>
                </form>
                <Offer offer={offer} />
            </div>

        </div>
    )
}



function Offer(props: { offer: string | undefined }) {
    if (props.offer) {
        return (
            <>
                <label>offer:</label>
                <textarea value={props.offer} disabled />
            </>
        )
    } else {
        return (<></>)
    }
}

async function setupOffer(pc: RTCPeerConnection) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    return offer
}