import { ButtonHTMLAttributes, useEffect, useState } from 'react'
import './App.css'
import { connectPeers } from './rtc-connection'

function App() {

  const localConnection = new RTCPeerConnection();
  const remoteConnection = new RTCPeerConnection();
  const [connectionState, setConnectionState] = useState(localConnection.connectionState)
  const [isConnectBtnDisabled, setConnectBtnDisabled] = useState(false)
  const [isDisconnectBtnDisabled, setDisconnectBtnDisabled] = useState(true)

  // configure event listeners for connection state  
  localConnection.onconnectionstatechange = e => setConnectionState(localConnection.connectionState)

  // remoteConnection.onconnectionstatechange = e => console.log({ remoteConnectionState: remoteConnection.connectionState })


  // create data channel for local peer
  const sendChannel = localConnection.createDataChannel("sendChannel");
  sendChannel.onopen = (e) => console.log('sendChannel opened', sendChannel);
  sendChannel.onclose = (e) => {
    console.log('sendChannel closed on local peer');
  };

  // remote data channel event listener
  remoteConnection.ondatachannel = (e) => {
    console.log('receivedChannel opened', e.channel);
    e.channel.onclose = (e) => {
      console.log('sendChannel closed on remote peer');
    };
  }


  // setup the ICE candidates
  localConnection.addEventListener('icecandidate', async (e) => {
    if (e.candidate) {
      console.log('local connection ICE candidate: ', e.candidate)
      await remoteConnection.addIceCandidate(e.candidate)
    }
  })
  remoteConnection.addEventListener('icecandidate', async (e) => {
    if (e.candidate) {
      console.log('remote connection ICE candidate: ', e.candidate);
      await localConnection.addIceCandidate(e.candidate)
    }
  })

  function handleConnectClick() {
    connectPeers(localConnection, remoteConnection)
  }
  function handleDisonnectClick() {
    sendChannel.close()
    localConnection.close()
    remoteConnection.close()
    setConnectionState(localConnection.connectionState)
    console.log(localConnection.connectionState)
  }

  useEffect(() => {
    if (connectionState === 'connected') {
      setConnectBtnDisabled(true)
      setDisconnectBtnDisabled(false)
    } else if (connectionState === 'closed') {
      setConnectBtnDisabled(false)
      setDisconnectBtnDisabled(true)
    }
    console.log('use effect used')
  }, [connectionState])

  return (
    <div className="App">

      <h1>Peers</h1>
      <div className="card">

        <button id='connectBtn' onClick={handleConnectClick} disabled={isConnectBtnDisabled}>
          Connect Peers
        </button>

        <button id='connectBtn' onClick={handleDisonnectClick} disabled={isDisconnectBtnDisabled}>
          Disconnect Peers
        </button>

      </div>
      <div className="card">
        <p>connection state is {connectionState}</p>
      </div>

    </div >
  )
}

export default App
