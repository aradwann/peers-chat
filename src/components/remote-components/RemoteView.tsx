import { AnswerForm } from "./AnswerForm";

export function RemoteView(props: { pc: RTCPeerConnection }) {
    return (<AnswerForm pc={props.pc} />)
}