import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { MessageForm } from './components/MessageForm';
import { MessageList } from './components/MessageList';
import { Message } from './typing/interfaces';
import { handleOffer, handleAnswer, handleCandidate, makeCall } from './webrtc/signal';



function App() {

  const pc = useMemo(() => new RTCPeerConnection(), []);
  const signalingChannel = useMemo(() => new BroadcastChannel('webrtc'), []);

  const [connectionState, setConnectionState] = useState(pc.connectionState)
  const [isConnectBtnDisabled, setConnectBtnDisabled] = useState(false)
  const [messages, setMessages] = useState<Array<Message>>([])

  // configure event listeners for connection state  
  pc.onconnectionstatechange = e => setConnectionState(pc.connectionState)

  function handleConnectClick() {
    signalingChannel.postMessage({ type: 'ready' });
  }
  function handleDisonnectClick() {
    pc.close()
    setConnectionState(pc.connectionState)
    signalingChannel.postMessage({ type: 'bye' });
  }

  function handleSend(message: Message) {
    // sendChannel.send(message.data)
    setMessages([...messages, message])
  }

  useEffect(() => {
    // set signal channel message handling once the component rendered
    signalingChannel.onmessage = async (e: MessageEvent<any>) => {

      switch (e.data.type) {
        case 'offer':
          console.log("recieved message", e.data);
          await handleOffer(signalingChannel, pc, e.data);
          break;
        case 'answer':
          console.log("recieved message", e.data);

          await handleAnswer(pc, e.data);
          break;
        case 'candidate':
          console.log("recieved message", e.data);

          await handleCandidate(pc, e.data.candidate);
          break;
        case 'ready':
          console.log("recieved message", e.data);

          await makeCall(signalingChannel, pc);
          break;
        case 'bye':
          console.log("recieved message", e.data);

          if (pc) {
            pc.close()
          }
          break;
        default:
          console.log('unhandled', e);
          break;
      }
    };
    if (connectionState === 'connected') {
      setConnectBtnDisabled(true)
    } else if (connectionState === 'closed') {
      setConnectBtnDisabled(false)
    }
    console.log('use effect used')
  }, [connectionState, pc, signalingChannel])

  return (
    <div className="App">

      <h1>Peers</h1>
      <div className="card">
        <button id='connectBtn' onClick={handleConnectClick} disabled={isConnectBtnDisabled}>
          Connect Peers
        </button>
        <button id='disconnectBtn' onClick={handleDisonnectClick} disabled={!isConnectBtnDisabled}>
          Disconnect Peers
        </button>
        <p>connection state is {connectionState}</p>
      </div>

      <MessageForm disabled={!isConnectBtnDisabled} handleSend={handleSend} />
      <MessageList messages={messages} />
    </div >
  )
}

export default App


