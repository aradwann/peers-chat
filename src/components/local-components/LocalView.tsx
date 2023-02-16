import { AcceptAnswerForm } from "./AcceptAnswerForm";
import { OfferForm } from "./OfferForm";

export function LocalView(props: { pc: RTCPeerConnection }) {

    return (
        <>
            <OfferForm pc={props.pc} />
            <AcceptAnswerForm pc={props.pc} />
        </>
    )
}