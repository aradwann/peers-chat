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

export async function makeCall(signalingChannel: BroadcastChannel, pc: RTCPeerConnection, handleReceiveMsg: (message: string) => void) {

    publishIceCandidate(signalingChannel, pc)
    //create data channel for local / offer maker peer
    const sendChannel = pc.createDataChannel("sendChannel");
    sendChannel.onopen = (e) => {
        console.log('sendChannel opened');
        sendChannel.send('Hello')
    };
    sendChannel.onmessage = (event) => {
        console.log('message receive on remote', event.data)
        handleReceiveMsg(event.data)
    }
    sendChannel.onclose = (e) => {
        console.log('sendChannel closed on local peer');
    };


    const offer = await pc.createOffer();
    signalingChannel.postMessage({ type: offer.type, sdp: offer.sdp });
    await pc.setLocalDescription(offer);

}

export async function handleOffer(signalingChannel: BroadcastChannel, pc: RTCPeerConnection, offer: RTCSessionDescriptionInit, handleReceiveMsg: (message: string) => void) {
    let receiveChannel: RTCDataChannel
    publishIceCandidate(signalingChannel, pc)

    // remote data channel event listener
    pc.ondatachannel = (event) => {
        receiveChannel = event.channel
        console.log('sendChannel opened on remote');
        receiveChannel.onclose = (event) => {
            console.log('sendChannel closed on remote peer');
        };
        receiveChannel.onmessage = (event) => {
            console.log('message receive on remote', event.data)
            if (event.data === 'Hello') receiveChannel.send('Hello back')
            handleReceiveMsg(event.data)
        }
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
