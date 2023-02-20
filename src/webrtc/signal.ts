import { SignalMessageType } from "../typing/enums";

export function publishIceCandidate(signalingChannel: BroadcastChannel, pc: RTCPeerConnection) {

    pc.onicecandidate = e => {

        if (e.candidate) {
            const message = {
                type: SignalMessageType.candidate,
                candidate: {
                    candidate: e.candidate.candidate,
                    sdpMLineIndex: e.candidate.sdpMLineIndex,
                    sdpMid: e.candidate.sdpMid,
                    usernameFragment: e.candidate.usernameFragment,
                }
            };

            signalingChannel.postMessage(message);
        }

    };
}

export async function makeCall(signalingChannel: BroadcastChannel, pc: RTCPeerConnection, handleDataChannel: (dataChannel: RTCDataChannel) => void) {

    publishIceCandidate(signalingChannel, pc)
    //create data channel for local / offer maker peer
    const sendChannel = pc.createDataChannel("localChannel");

    handleDataChannel(sendChannel)

    const offer = await pc.createOffer();
    signalingChannel.postMessage({ type: offer.type, sdp: offer.sdp });
    await pc.setLocalDescription(offer);

}

export async function handleOffer(signalingChannel: BroadcastChannel, pc: RTCPeerConnection, offer: RTCSessionDescriptionInit, handleDataChannel: (dataChannel: RTCDataChannel) => void) {

    publishIceCandidate(signalingChannel, pc)

    // remote data channel event listener
    pc.ondatachannel = (event) => {

        handleDataChannel(event.channel)
    }

    await pc.setRemoteDescription(offer);

    const answer = await pc.createAnswer();
    signalingChannel.postMessage({ type: answer.type, sdp: answer.sdp });
    await pc.setLocalDescription(answer);
}

export async function handleAnswer(pc: RTCPeerConnection, answer: RTCSessionDescriptionInit) {

    await pc.setRemoteDescription(answer);
}

export async function handleCandidate(pc: RTCPeerConnection, candidate: RTCIceCandidateInit | undefined) {

    if (candidate) {
        await pc.addIceCandidate(candidate);
    }
}
