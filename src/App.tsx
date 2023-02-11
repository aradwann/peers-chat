import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { connectPeers } from './rtc-connection'

function App() {

  const [localConnection, setLocalConnection] = useState(new RTCPeerConnection())
  const [remoteConnection, setRemoteConnection] = useState(new RTCPeerConnection())
  const [connectionState, setConnectionState] = useState(localConnection.connectionState)

  function handleConnectClick() {
    connectPeers(localConnection, remoteConnection, setConnectionState)
  }

  return (
    <div className="App">

      <h1>Peers</h1>
      <div className="card">
        <button onClick={handleConnectClick}>
          Connect Peers
        </button>
      </div>
      <div className="card">
        <p>connection state is {connectionState}</p>
      </div>

    </div>
  )
}

export default App
