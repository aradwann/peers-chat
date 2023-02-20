import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { MessageForm } from './components/MessageForm';
import { MessageList } from './components/MessageList';
import { MessageSender, SignalMessageType } from './typing/enums';
import { Message } from './typing/interfaces';
import { handleOffer, handleAnswer, handleCandidate, makeCall } from './webrtc/signal';



function App() {

  const pc = useMemo(() => {
    const pc = new RTCPeerConnection()
    // configure event listeners for connection state  
    pc.onconnectionstatechange = e => setConnectionState(pc.connectionState)
    return pc
  }, []);

  const signalingChannel = useMemo(() => new BroadcastChannel('webrtc'), []);

  const [connectionState, setConnectionState] = useState(pc.connectionState)
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null)
  const [messages, setMessages] = useState<Array<Message>>([])

  const handleDataChannel = useCallback((dataChannel: RTCDataChannel) => {
    setDataChannel(dataChannel);

    dataChannel.onopen = () => console.log("localChannel opened")
    dataChannel.onclose = () => console.log("localChannel closed")

    dataChannel.onmessage = e => {
      const msg: Message = { data: e.data, sender: MessageSender.remote }
      setMessages([...messages, msg])

    }
  }, [messages])



  function handleConnectClick() {
    signalingChannel.postMessage({ type: SignalMessageType.ready });
  }
  function handleDisonnectClick() {
    pc.close()
    setConnectionState(pc.connectionState)
    signalingChannel.postMessage({ type: SignalMessageType.bye });
  }

  function handleSend(message: string) {
    if (dataChannel) {
      dataChannel.send(message)
      const msg: Message = { data: message, sender: MessageSender.local }
      setMessages([...messages, msg])
    } else {
      console.log("data channel value is", dataChannel);
    }
  }


  useEffect(() => {

    // set signal channel message handling once the component rendered
    signalingChannel.onmessage = async (e: MessageEvent<any>) => {
      const msgType: SignalMessageType = e.data.type
      switch (msgType) {
        case SignalMessageType.offer:
          console.log("recieved message", e.data);

          await handleOffer(signalingChannel, pc, e.data, handleDataChannel);
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

          await makeCall(signalingChannel, pc, handleDataChannel)
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


  }, [connectionState, handleDataChannel, pc, signalingChannel])

  return (
    <div className="App">

      <h1>Peers</h1>
      <div className="card">
        <button id='connectBtn' onClick={handleConnectClick} disabled={connectionState === 'connected'}>
          Connect Peers
        </button>
        <button id='disconnectBtn' onClick={handleDisonnectClick} disabled={connectionState !== 'connected'}>
          Disconnect Peers
        </button>
        <p>connection state is {connectionState}</p>
      </div>

      <MessageForm disabled={connectionState !== 'connected'} handleSend={handleSend} />
      <MessageList messages={messages} />
    </div >
  )
}

export default App


