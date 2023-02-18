import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { MessageForm } from './components/MessageForm';
import { MessageList } from './components/MessageList';
import { MessageSender, SignalMessageType } from './typing/enums';
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
    signalingChannel.postMessage({ type: SignalMessageType.ready });
  }
  function handleDisonnectClick() {
    pc.close()
    setConnectionState(pc.connectionState)
    signalingChannel.postMessage({ type: SignalMessageType.bye });
  }

  const handleReceiveMsg = useCallback(function handleReceiveMsg(message: string) {
    const msg: Message = { data: message, sender: MessageSender.remote }
    setMessages([...messages, msg])
  }, [messages])

  const handleSend = (rtcDataChannel: RTCDataChannel) => (message: string) => {
    rtcDataChannel.send(message)
    const msg: Message = { data: message, sender: MessageSender.remote }
    setMessages([...messages, msg])
  }

  let handleSendMsg: (message: string) => void | undefined

  useEffect(() => {
    // set signal channel message handling once the component rendered
    signalingChannel.onmessage = async (e: MessageEvent<any>) => {
      const msgType: SignalMessageType = e.data.type
      switch (msgType) {
        case SignalMessageType.offer:
          console.log("recieved message", e.data);

          await handleOffer(signalingChannel, pc, e.data, handleReceiveMsg);
          break;
        case SignalMessageType.answer:
          console.log("recieved message", e.data);

          await handleAnswer(pc, e.data);
          break;
        case SignalMessageType.candidate:
          console.log("recieved message", e.data);

          await handleCandidate(pc, e.data.candidate);
          break;
        case SignalMessageType.ready:
          console.log("recieved message", e.data);

          await makeCall(signalingChannel, pc, handleReceiveMsg)
          break;
        case SignalMessageType.bye:
          console.log("recieved message", e.data);

          pc.close()
          setConnectionState(pc.connectionState)
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

  }, [connectionState, handleReceiveMsg, pc, signalingChannel])

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

      {/* <MessageForm disabled={!isConnectBtnDisabled} handleSend={handleSendMsg} /> */}
      <MessageList messages={messages} />
    </div >
  )
}

export default App


