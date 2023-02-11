import { Dispatch, SetStateAction } from "react";


export async function connectPeers(localConnection: RTCPeerConnection, remoteConnection: RTCPeerConnection) {

    // start the connection attempt
    try {
        const offer = await localConnection.createOffer();
        await localConnection.setLocalDescription(offer);

        await remoteConnection.setRemoteDescription(offer)

        const answer = await remoteConnection.createAnswer();
        await remoteConnection.setLocalDescription(answer);

        await localConnection.setRemoteDescription(answer)

    } catch (e) { console.log(`error on attempting to connect ${e}`) };

}


export async function sendMessage() {

}