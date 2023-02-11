import { Dispatch, SetStateAction } from "react";


export async function connectPeers(localConnection: RTCPeerConnection, remoteConnection: RTCPeerConnection, setConnectionState: Dispatch<SetStateAction<"closed" | "connected" | "connecting" | "disconnected" | "failed" | "new">>) {

    // setup the local peer

    const sendChannel = localConnection.createDataChannel("sendChannel");
    sendChannel.onopen = (e) => console.log('sendChannel opened');
    sendChannel.onclose = (e) => console.log('sendChannel closed');

    // setup the remote peer

    remoteConnection.ondatachannel = (e) => {
        console.log('receivedChannel opened');
    };

    // setup the ICE candidates
    localConnection.onicecandidate = (e) =>
        !e.candidate ||
        remoteConnection.addIceCandidate(e.candidate).catch((e) => console.log('error on adding local condidate to remote peer'));

    remoteConnection.onicecandidate = (e) =>
        !e.candidate ||
        localConnection.addIceCandidate(e.candidate).catch((e) => console.log('error on adding remote condidate to local peer'));


    // start the connection attempt
    try {
        const offer = await localConnection.createOffer();
        await localConnection.setLocalDescription(offer);

        await remoteConnection.setRemoteDescription(offer)//localConnection.localDescription)

        const answer = await remoteConnection.createAnswer();
        await remoteConnection.setLocalDescription(answer);

        await localConnection.setRemoteDescription(answer)//remoteConnection.localDescription)

        localConnection.onconnectionstatechange = e => {
            console.log({ localConnectionState: localConnection.connectionState });
            setConnectionState(localConnection.connectionState)
        }
        remoteConnection.onconnectionstatechange = e => console.log({ remoteConnectionState: remoteConnection.connectionState })
    } catch (e) { console.log(`error on attempting to connect ${e}`) };
    return sendChannel;// , receiveChannel];

}

export async function disconnectPeers(local: RTCPeerConnection, remote: RTCPeerConnection) {

    // Close the RTCDataChannels if they're open.

    // sendChannel.close();
    // receiveChannel.close();

    // Close the RTCPeerConnections

    local.close();
    remote.close();

}

export async function sendMessage() {

}